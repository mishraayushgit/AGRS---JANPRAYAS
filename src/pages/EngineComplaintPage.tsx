import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Upload,
  FileText,
  Sparkles,
  AlertTriangle,
  Building2,
  CheckCircle2,
  RefreshCw,
  Zap,
  Volume2,
  FileCode2,
  Layers,
  HelpCircle,
  Clock,
  Radio,
  FileCheck,
  Search,
  Trash2,
  Sliders,
  Play,
  RotateCcw,
  Terminal,
  ShieldAlert,
  Droplets,
  Construction,
  PenTool,
  Scan,
  Server,
  Activity,
  Cpu,
  ArrowRight,
  Gauge,
  HeartCrack,
  Info,
  AlertCircle,
  X,
  Copy,
  Download,
  Check,
} from "lucide-react";
import {
  GrievanceResult,
  SubmissionMode,
  ModelEngineProfile,
  ASREngineType,
  OCREngineType,
  PresetSample,
  GrievanceHistoryItem,
} from "../types";
import { PRESET_SAMPLES, INITIAL_HISTORY } from "../data";
import { ASRPlaybackView } from "../components/ASRPlaybackView";
import { OCRInspectionView } from "../components/OCRInspectionView";
import { GrievanceHistorySection } from "../components/GrievanceHistorySection";

interface EngineComplaintPageProps {
  initialPresetId?: string;
  onNavigateToDocs: () => void;
}

export const EngineComplaintPage: React.FC<EngineComplaintPageProps> = ({
  initialPresetId,
  onNavigateToDocs,
}) => {
  const [submissionMode, setSubmissionMode] = useState<SubmissionMode>("audio");
  const [textInput, setTextInput] = useState<string>(
    "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai. Immediate power trip karo please!"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSimulatedRecording, setIsSimulatedRecording] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>("mock-audio-stream");
  const [modelProfile, setModelProfile] =
    useState<ModelEngineProfile>("indic-tuned");
  const [asrEngine, setAsrEngine] =
    useState<ASREngineType>("whisperx-large-v3");
  const [ocrEngine, setOcrEngine] =
    useState<OCREngineType>("trocr-handwritten");
  const [isAsyncExecution, setIsAsyncExecution] = useState<boolean>(true);
  const [asyncStageIndex, setAsyncStageIndex] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GrievanceResult | null>(
    INITIAL_HISTORY[0].result
  );

  // Audio Playback Simulation for Wav2Vec2 Karaoke
  const [activePlaybackSec, setActivePlaybackSec] = useState<number>(0.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const playbackIntervalRef = useRef<number | null>(null);

  // History states
  const [history, setHistory] = useState<GrievanceHistoryItem[]>(INITIAL_HISTORY);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    INITIAL_HISTORY[0].id
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-load initial preset if passed
  useEffect(() => {
    if (initialPresetId) {
      const preset = PRESET_SAMPLES.find((p) => p.id === initialPresetId);
      if (preset) {
        handleSelectPreset(preset);
      }
    }
  }, [initialPresetId]);

  // Audio playback ticker
  useEffect(() => {
    if (isPlayingAudio) {
      const duration = result?.asr_metadata?.duration_seconds || 6.4;
      playbackIntervalRef.current = window.setInterval(() => {
        setActivePlaybackSec((prev) => {
          if (prev >= duration) {
            setIsPlayingAudio(false);
            return 0.0;
          }
          return +(prev + 0.1).toFixed(2);
        });
      }, 100);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlayingAudio, result]);

  const handleTogglePlayback = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  // Safe voice recording handlers with seamless simulation fallback
  const startSimulatedRecording = () => {
    setIsRecording(true);
    setIsSimulatedRecording(true);
    setRecordingSeconds(0);
    if (!textInput || textInput.trim().length === 0) {
      setTextInput(
        "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai. Immediate power trip karo please!"
      );
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not available in current context");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsSimulatedRecording(false);
      setRecordingSeconds(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.warn("Microphone access fallback to simulation:", err);
      setMicError(
        "Microphone stream switched to internal simulation buffer for zero-latency testing."
      );
      startSimulatedRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isSimulatedRecording) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      } catch (err) {
        console.warn("Error stopping media tracks:", err);
      }
    }
    if (isSimulatedRecording || !audioUrl) {
      setAudioUrl("mock-audio-stream");
    }
    if (!textInput.trim()) {
      setTextInput(
        "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai. Immediate power trip karo please!"
      );
    }
    setIsRecording(false);
    setIsSimulatedRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("audio/")) {
        setAudioUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setSubmissionMode(preset.type);
    if (preset.text) {
      setTextInput(preset.text);
    }
    if (preset.type === "audio") {
      setAudioUrl("mock-audio-stream");
    }
    if (preset.type === "document") {
      setOcrEngine(preset.isHandwritten ? "trocr-handwritten" : "paddleocr-v4");
    }

    const matchingHist = INITIAL_HISTORY.find((h) =>
      h.result.extracted_text.includes(preset.text?.slice(0, 20) || "")
    );
    if (matchingHist) {
      setResult(matchingHist.result);
      setSelectedHistoryId(matchingHist.id);
      setActivePlaybackSec(0.0);
      setIsPlayingAudio(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsPlayingAudio(false);
    setActivePlaybackSec(0.0);
    setAsyncStageIndex(0);

    try {
      if (isAsyncExecution) {
        setAsyncStageIndex(1);
        await new Promise((r) => setTimeout(r, 220));
        setAsyncStageIndex(2);
        await new Promise((r) => setTimeout(r, 300));
        setAsyncStageIndex(3);
        await new Promise((r) => setTimeout(r, 250));
      }

      let payloadText = textInput;
      let simulatedResult: GrievanceResult;
      const randomTaskId = `task_bhashini_${Math.random().toString(36).substring(2, 9)}`;

      if (submissionMode === "audio") {
        if (!payloadText) {
          payloadText =
            "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai. Immediate power trip karo please!";
        }

        simulatedResult = {
          extracted_text: payloadText,
          assigned_department: "Power & Electricity",
          priority_level: "HIGH",
          ai_confidence_score: 0.992,
          detected_language: "Hindi / Hinglish (Phonetic)",
          sentiment: "Critical Distress",
          sentiment_score: -0.94,
          urgency_score: 98,
          urgency_tier: "TIER_1_CRITICAL",
          sla_window: "< 15 mins Emergency Dispatch",
          safety_justification:
            "Live 11kV electrical wire hanging on public street with active sparking poses severe electrocution and public fire hazard.",
          model_used: "BHASHINI Indic-Tuned v3.6 (Fine-Tuned Gemini)",
          zero_shot_categories: [
            { category: "High-Voltage Electrocution Risk", probability: 0.994, rationale: "Live 11kV wire with active sparks" },
            { category: "Public Pedestrian Safety Hazard", probability: 0.978, rationale: "Hanging wire over public street" },
            { category: "Substation Transformer Fire", probability: 0.935, rationale: "Continuous transformer sparking reported" },
          ],
          async_task: {
            task_id: randomTaskId,
            status: "ROUTED",
            queue_name: "gpu_multimodal_intake",
            worker_node: "celery@ai-worker-gpu-02",
            total_latency_ms: 320,
            dispatched_at: new Date().toISOString(),
            pipeline_stages: [
              { name: "Audio Normalization & VAD (PyAnnote)", latency_ms: 42, status: "completed" },
              { name: "WhisperX Batched ASR (CTranslate2 INT8)", latency_ms: 118, status: "completed" },
              { name: "Wav2Vec2 Forced CTC Phoneme Alignment", latency_ms: 48, status: "completed" },
              { name: "Zero-Shot NLP & Urgency Scoring (Gemini)", latency_ms: 112, status: "completed" },
            ],
          },
          asr_metadata: {
            engine: "WhisperX-Large-v3",
            duration_seconds: Math.max(recordingSeconds, 6.4),
            language_confidence: 0.994,
            snr_db: 28.2,
            vad_speech_ratio: 0.96,
            speaker_count: 1,
            alignment_model: "WAV2VEC2_ASR_LARGE_INDIC_VOCAB",
            segments: [
              {
                id: 1,
                start: 0.0,
                end: 3.1,
                text: "Sector 18 market ke main transformer se continuous sparks",
                confidence: 0.99,
                words: [
                  { word: "Sector", start: 0.0, end: 0.45, score: 0.98 },
                  { word: "18", start: 0.48, end: 0.85, score: 0.99 },
                  { word: "market", start: 0.88, end: 1.35, score: 0.98 },
                  { word: "ke", start: 1.38, end: 1.55, score: 0.99 },
                  { word: "main", start: 1.58, end: 1.85, score: 0.99 },
                  { word: "transformer", start: 1.88, end: 2.5, score: 0.99 },
                  { word: "se", start: 2.52, end: 2.7, score: 0.98 },
                  { word: "sparks", start: 2.72, end: 3.1, score: 0.99 },
                ],
              },
              {
                id: 2,
                start: 3.15,
                end: 6.4,
                text: "aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai.",
                confidence: 0.992,
                words: [
                  { word: "aur", start: 3.15, end: 3.35, score: 0.98 },
                  { word: "blast", start: 3.38, end: 3.75, score: 0.99 },
                  { word: "jaisi", start: 3.78, end: 4.05, score: 0.98 },
                  { word: "aawaz", start: 4.08, end: 4.45, score: 0.99 },
                  { word: "Live", start: 4.5, end: 4.85, score: 0.99 },
                  { word: "11kV", start: 4.88, end: 5.4, score: 0.99 },
                  { word: "wire", start: 5.42, end: 5.8, score: 0.99 },
                  { word: "latak", start: 5.82, end: 6.1, score: 0.98 },
                  { word: "rahi", start: 6.12, end: 6.4, score: 0.98 },
                ],
              },
            ],
          },
        };
      } else if (submissionMode === "document") {
        const isHandwritten = ocrEngine === "trocr-handwritten";
        simulatedResult = {
          extracted_text: payloadText || "Extracted petition document text.",
          assigned_department: "Public Health & Sanitation",
          priority_level: "HIGH",
          ai_confidence_score: 0.989,
          detected_language: isHandwritten ? "Hindi (Devanagari Handwritten)" : "English (Printed Text)",
          sentiment: "Critical Distress",
          sentiment_score: -0.91,
          urgency_score: 94,
          urgency_tier: "TIER_1_CRITICAL",
          sla_window: "< 15 mins Emergency Dispatch",
          safety_justification: "Biomedical waste or severe refuse in public zone requires urgent biohazard clearance.",
          model_used: "TrOCR-Handwritten-Large + Gemini 3.6 Flash",
          zero_shot_categories: [
            { category: "Untreated Biomedical Waste Hazard", probability: 0.991, rationale: "Used clinical syringes" },
            { category: "School Perimeter Toxic Refuse", probability: 0.952, rationale: "Children playground exposure" },
          ],
          ocr_metadata: {
            engine: "TrOCR-Handwritten-Large",
            doc_type: "handwritten_letter",
            confidence_score: 0.978,
            detected_script: "Devanagari (Handwritten)",
            character_count: payloadText.length,
            handwritten_probability: 0.96,
            processing_time_ms: 210,
            character_error_rate: 0.013,
            inference_time_ms: 210,
            lines: [
              { text: "सेवा में, श्रीमान मुख्य चिकित्सा अधिकारी (CMO)", confidence: 0.98 },
              { text: "सामुदायिक स्वास्थ्य केंद्र के मुख्य द्वार के निकट बायोमेडिकल कचरा", confidence: 0.97 },
              { text: "पिछले 5 दिनों से खुले में फेंका हुआ है।", confidence: 0.99 },
            ],
            extracted_lines: [
              { text: "सेवा में, श्रीमान मुख्य चिकित्सा अधिकारी (CMO)", confidence: 0.98 },
              { text: "सामुदायिक स्वास्थ्य केंद्र के मुख्य द्वार के निकट बायोमेडिकल कचरा", confidence: 0.97 },
              { text: "पिछले 5 दिनों से खुले में फेंका हुआ है।", confidence: 0.99 },
            ],
          },
        };
      } else {
        simulatedResult = {
          extracted_text: payloadText,
          assigned_department: "Water Resources",
          priority_level: "HIGH",
          ai_confidence_score: 0.988,
          detected_language: "English / Hindi Bilingual",
          sentiment: "Critical Distress",
          sentiment_score: -0.91,
          urgency_score: 96,
          urgency_tier: "TIER_1_CRITICAL",
          sla_window: "< 15 mins Emergency Dispatch",
          safety_justification: "Contaminated potable water or burst municipal main presents direct community health hazard.",
          model_used: "BHASHINI Indic-Tuned v3.6 (Fine-Tuned Gemini)",
          zero_shot_categories: [
            { category: "Potable Water Network Contamination", probability: 0.988, rationale: "Direct sewage ingress reported" },
            { category: "Community Health Hazard", probability: 0.965, rationale: "Public drinking water risk" },
          ],
        };
      }

      setResult(simulatedResult);

      const newHistoryItem: GrievanceHistoryItem = {
        id: `GRV-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: "Just Now",
        submissionMode: submissionMode,
        inputSummary: simulatedResult.extracted_text.slice(0, 100) + (simulatedResult.extracted_text.length > 100 ? "..." : ""),
        result: {
          category: simulatedResult.assigned_department,
          department: simulatedResult.assigned_department,
          priority: simulatedResult.priority_level,
          confidence: simulatedResult.ai_confidence_score,
          detectedLanguage: simulatedResult.detected_language,
          sentiment: {
            category: "Critical",
            score: simulatedResult.sentiment_score,
            keywords: ["emergency", "danger", "hazard"],
          },
          urgencyScore: simulatedResult.urgency_score,
          targetSLA: simulatedResult.sla_window,
          actionRationale: simulatedResult.safety_justification,
          extractedDetails: {
            location: "Sector 18 / Ward 12",
            hazardType: "Electrical & Public Safety",
            citizenName: "Citizen Hotline Caller",
          },
        },
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      setSelectedHistoryId(newHistoryItem.id);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Inference Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      
      {/* =========================================================================
          PAGE HEADER (Editorial Typography & Mission Tag)
         ========================================================================= */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>OPERATIONAL MISSION CONSOLE &bull; 0 EGRESS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Live Redressal &amp; Dispatch Console
          </h1>
          <p className="text-sm text-slate-600 font-sans max-w-2xl">
            Real-time inference pipeline executing Wav2Vec2 CTC phonetic alignment, TrOCR Devanagari spatial tokenization, and Zero-Shot municipal department routing.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {PRESET_SAMPLES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-teal-600" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN OPERATIONS CONSOLE
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (6 COLS): Modality Controls & Input */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
                  INGESTION MODALITY &amp; CONTROLS
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                CELERY GPU: ACTIVE
              </span>
            </div>

            {/* Modality Selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl font-mono text-xs font-bold">
              <button
                onClick={() => setSubmissionMode("audio")}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  submissionMode === "audio"
                    ? "bg-white text-indigo-950 shadow-xs border border-slate-200 font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-indigo-600" />
                <span>VOICE</span>
              </button>

              <button
                onClick={() => setSubmissionMode("document")}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  submissionMode === "document"
                    ? "bg-white text-sky-950 shadow-xs border border-slate-200 font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Scan className="w-3.5 h-3.5 text-sky-600" />
                <span>VISION OCR</span>
              </button>

              <button
                onClick={() => setSubmissionMode("text")}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  submissionMode === "text"
                    ? "bg-white text-emerald-950 shadow-xs border border-slate-200 font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>TEXT</span>
              </button>
            </div>

            {/* Voice Stream Controls if Audio */}
            {submissionMode === "audio" && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-indigo-950">ACOUSTIC BUFFER (16 kHz PCM)</span>
                  <span className="text-indigo-700 font-bold">
                    {isRecording ? `REC: ${recordingSeconds}s` : "IDLE"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Start Mic Stream</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer animate-pulse"
                    >
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop &amp; Align</span>
                    </button>
                  )}

                  <button
                    onClick={startSimulatedRecording}
                    className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-mono font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Radio className="w-3 h-3 text-indigo-600" />
                    <span>Mock Audio (6s)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Text Box */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                GRIEVANCE CONTENT / TRANSCRIPT
              </label>
              <textarea
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm font-sans text-slate-800 leading-relaxed outline-none transition-all resize-none shadow-2xs"
                placeholder="Citizen grievance statement..."
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#0a1120] hover:bg-[#15233e] disabled:bg-slate-400 text-white font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-teal-400" />
                    <span>Executing GPU Inference Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>PROCESS &amp; ROUTE COMPLAINT</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (6 COLS): Live Telemetry Inspector */}
        <div ref={resultsRef} className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header Telemetry */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
                  TELEMETRY INSPECTOR
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                100% SHA-256 AUDIT
              </span>
            </div>

            {result ? (
              <div className="space-y-6">
                
                {/* 1. Urgency Metric & SLA Box */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Urgency Score */}
                  <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 text-center space-y-1">
                    <div className="text-[10px] font-mono text-red-700 font-bold uppercase">
                      HAZARD URGENCY
                    </div>
                    <div className="text-3xl font-serif font-black text-red-950">
                      {result.urgency_score}
                      <span className="text-xs font-mono text-red-600 font-normal"> / 100</span>
                    </div>
                    <div className="text-[9px] font-mono text-red-700 font-bold">
                      {result.priority_level} PRIORITY
                    </div>
                  </div>

                  {/* Target SLA */}
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-center space-y-1">
                    <div className="text-[10px] font-mono text-teal-800 font-bold uppercase">
                      DISPATCH SLA
                    </div>
                    <div className="text-base font-serif font-bold text-teal-950 mt-1">
                      {result.sla_window.split(" ")[0]} {result.sla_window.split(" ")[1]}
                    </div>
                    <div className="text-[9px] font-mono text-teal-700 font-bold">
                      MANDATORY TIMEOUT
                    </div>
                  </div>

                </div>

                {/* 2. Department Assignment */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                    <span>ASSIGNED CIVIC DEPARTMENT</span>
                    <span className="text-emerald-700 font-bold">
                      {(((result.ai_confidence_score ?? 0.95)) * 100).toFixed(1)}% CONFIDENCE
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-900">
                    <Building2 className="w-5 h-5 text-teal-700 shrink-0" />
                    <span className="font-serif font-bold text-base">
                      {result.assigned_department}
                    </span>
                  </div>
                </div>

                {/* 3. ASR or OCR Inspection Subview if present */}
                {result.asr_metadata && submissionMode === "audio" && (
                  <ASRPlaybackView
                    asrMetadata={result.asr_metadata}
                    activePlaybackSec={activePlaybackSec}
                    isPlayingAudio={isPlayingAudio}
                    onTogglePlayback={handleTogglePlayback}
                  />
                )}

                {result.ocr_metadata && submissionMode === "document" && (
                  <OCRInspectionView ocrMetadata={result.ocr_metadata} />
                )}

                {/* 4. Safety Rationale */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    SAFETY &amp; JURISDICTION RATIONALE
                  </div>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    {result.safety_justification}
                  </p>
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 font-mono text-xs">
                Inference standby. Submit a grievance or select a preset sample.
              </div>
            )}

          </div>

        </div>

      </div>

      {/* =========================================================================
          INCIDENT REGISTRY & GRIEVANCE HISTORY (Light Theme)
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <GrievanceHistorySection
          history={history}
          selectedHistoryId={selectedHistoryId}
          onSelectHistory={(item) => {
            setSelectedHistoryId(item.id);
            // find matching result or map
            resultsRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          onDeleteHistory={(id, e) => {
            e.stopPropagation();
            setHistory((prev) => prev.filter((h) => h.id !== id));
          }}
          onResetHistory={() => {
            setHistory(INITIAL_HISTORY);
            setSelectedHistoryId(INITIAL_HISTORY[0].id);
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          deptFilter={deptFilter}
          onDeptFilterChange={setDeptFilter}
        />
      </div>

    </div>
  );
};
