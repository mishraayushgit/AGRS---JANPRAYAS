import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Upload,
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Radio,
  FileCode2,
  ChevronDown,
  Layers,
  Zap,
  Volume2,
  Sliders,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Building2,
  Activity,
  PenTool,
  Scan,
  AlertTriangle,
  Clock,
  Compass,
  FileCheck,
  Share2,
  Trash2,
  Copy,
  Download,
  Terminal,
} from "lucide-react";

export type IngestionMode = "voice" | "ocr" | "text";
export type OCREngineSelection = "auto" | "trocr" | "paddleocr";

export interface RedressalDispatchResult {
  department: string;
  priority: "HIGH" | "MEDIUM" | "ROUTINE";
  urgencyScore: number;
  sla: string;
  confidence: number;
  detectedDialect: string;
  summary: string;
  safetyRationale: string;
  taskId: string;
  timestamp: string;
}

const INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi (हिन्दी)", script: "Devanagari", speakers: "528M" },
  { code: "en-IN", name: "Indian English / Hinglish", script: "Latin", speakers: "125M" },
  { code: "bn", name: "Bengali (বাংলা)", script: "Bengali", speakers: "97M" },
  { code: "mr", name: "Marathi (मराठी)", script: "Devanagari", speakers: "83M" },
  { code: "te", name: "Telugu (తెలుగు)", script: "Telugu", speakers: "81M" },
  { code: "ta", name: "Tamil (தமிழ்)", script: "Tamil", speakers: "69M" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", script: "Gujarati", speakers: "55M" },
  { code: "ur", name: "Urdu (اردو)", script: "Perso-Arabic", speakers: "50M" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", script: "Kannada", speakers: "43M" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)", script: "Odia", speakers: "37M" },
  { code: "ml", name: "Malayalam (മലയാളം)", script: "Malayalam", speakers: "34M" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)", script: "Gurmukhi", speakers: "33M" },
  { code: "as", name: "Assamese (অসমীয়া)", script: "Bengali-Assamese", speakers: "15M" },
  { code: "mai", name: "Maithili (मैथिली)", script: "Devanagari", speakers: "13M" },
  { code: "sa", name: "Sanskrit (संस्कृतम्)", script: "Devanagari", speakers: "Classical" },
  { code: "ks", name: "Kashmiri (کٲشُر)", script: "Perso-Arabic", speakers: "7M" },
  { code: "ne", name: "Nepali (नेपाली)", script: "Devanagari", speakers: "3M" },
  { code: "sd", name: "Sindhi (سنڌي)", script: "Perso-Arabic/Devanagari", speakers: "3M" },
  { code: "kok", name: "Konkani (कोंकणी)", script: "Devanagari/Roman", speakers: "2.5M" },
  { code: "doi", name: "Dogri (डोगरी)", script: "Devanagari", speakers: "2.6M" },
  { code: "mni", name: "Manipuri / Meitei (মৈতৈলোন্)", script: "Meetei Mayek", speakers: "1.8M" },
  { code: "brx", name: "Bodo (बड़ो)", script: "Devanagari", speakers: "1.5M" },
  { code: "sat", name: "Santali (ᱥᱟᱱᱛᱟᱲᱤ)", script: "Ol Chiki", speakers: "7.6M" },
];

const PRESETS = [
  {
    id: "preset-power",
    title: "11kV Live Cable Snap (Power Grid)",
    mode: "voice" as IngestionMode,
    dept: "Electricity Distribution & Grid Safety",
    text: "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche sadak pe latak rahi hai. Kripya turant supply band karwayein!",
    score: 94,
    sla: "< 15 Min Critical Window",
    rationale: "Exposed 11kV high-tension wire in crowded pedestrian market presents imminent electrocution hazard.",
  },
  {
    id: "preset-water",
    title: "Contaminated Drinking Main (Water Dept)",
    mode: "text" as IngestionMode,
    dept: "Water Supply & Sewage Authority",
    text: "Ward No. 12 ke drinking water pipeline burst ho gayi hai. Ganda naali ka pani supply pipeline mein mix ho raha hai. Hazaron log paani peene se bimar pad sakte hain. Immediate valve close karein.",
    score: 88,
    sla: "< 1 Hour Emergency Window",
    rationale: "Sewage ingress into potable water network threatens cholera/diarrheal waterborne disease outbreak.",
  },
  {
    id: "preset-sanitation",
    title: "Hospital Biomedical Waste (Health Dept)",
    mode: "ocr" as IngestionMode,
    dept: "Public Health & Sanitation Wing",
    text: "सेवा में, श्रीमान मुख्य चिकित्सा अधिकारी (CMO)। सामुदायिक स्वास्थ्य केंद्र के मुख्य द्वार के निकट पिछले 5 दिनों से बायोमेडिकल कचरा (उपयोग किए गए इंजेक्शन, सिरिंज, ब्लड वाइल्स) खुले में फेंका हुआ है। कृपया तत्काल निस्तारण कराएं।",
    score: 82,
    sla: "< 4 Hours Urgent Window",
    rationale: "Open clinical syringe bio-waste at public healthcare entrance violates Bio-Medical Waste Management Rules 2016.",
  },
];

export const TriModalIngestionSuite: React.FC = () => {
  // Navigation & Modality State
  const [activeTab, setActiveTab] = useState<IngestionMode>("voice");

  // Voice Modality States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(PRESETS[0].text);

  // Document OCR States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrEngineMode, setOcrEngineMode] = useState<OCREngineSelection>("auto");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [ocrExtractedPreview, setOcrExtractedPreview] = useState<string>(PRESETS[2].text);

  // Direct Text States
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>("hi");
  const [directText, setDirectText] = useState<string>(PRESETS[1].text);

  // Dispatch & Result States
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<RedressalDispatchResult | null>({
    department: "Electricity Distribution & Grid Safety",
    priority: "HIGH",
    urgencyScore: 94,
    sla: "< 15 Min Critical Window",
    confidence: 0.982,
    detectedDialect: "Hinglish / Regional Hindi Colloquial",
    summary: "Live 11kV electrical cable severed and sparking over crowded public thoroughfare near Sector 18 transformer.",
    safetyRationale: "Critical threat to human life; immediate feeder isolation protocol required by municipal power engineer.",
    taskId: "TASK-GRV-" + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toLocaleTimeString(),
  });
  const [isOfficerVerified, setIsOfficerVerified] = useState<boolean>(true);
  const [copiedAudit, setCopiedAudit] = useState<boolean>(false);

  // Refs
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Audio Recording Logic
  const micStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setSelectedFile(new File([blob], "recorded_grievance.webm", { type: "audio/webm" }));
        };

        mediaRecorder.start();
      }

      setIsRecording(true);
      setIsSimulated(false);
      setRecordingDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access error or denied, falling back to simulated stream:", err);
      simulateMicStream();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (!voiceTranscript.trim()) {
      setVoiceTranscript(
        "Sector 18 market ke main transformer se continuous sparks aur blast jaisi aawaz aa rahi hai. Live 11kV wire niche road pe latak rahi hai. Immediate power trip karo please!"
      );
    }
  };

  const simulateMicStream = () => {
    setIsRecording(true);
    setIsSimulated(true);
    setRecordingDuration(0);
    timerRef.current = window.setInterval(() => {
      setRecordingDuration((prev) => {
        if (prev >= 6) {
          stopRecording();
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Handle File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Dispatch Simulation
  const handleTriggerDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      let dept = "Municipal Infrastructure & Civil Works";
      let priority: "HIGH" | "MEDIUM" | "ROUTINE" = "HIGH";
      let score = 86;
      let sla = "< 1 Hour Emergency Window";
      let rationale = "Public safety hazard requiring immediate intervention.";
      let summaryText = "";

      if (activeTab === "voice") {
        dept = "Electricity Distribution & Grid Safety";
        score = 94;
        sla = "< 15 Min Critical Window";
        rationale = "Exposed 11kV live power cable with sparks posing immediate electrocution hazard.";
        summaryText = voiceTranscript;
      } else if (activeTab === "ocr") {
        dept = "Public Health & Sanitation Wing";
        score = 82;
        sla = "< 4 Hours Urgent Window";
        rationale = "Biomedical waste disposed in public open space violates bio-safety standards.";
        summaryText = ocrExtractedPreview;
      } else {
        dept = "Water Supply & Sewage Authority";
        score = 88;
        sla = "< 1 Hour Emergency Window";
        rationale = "Potable water pipeline contamination by sewage ingress risks public health epidemic.";
        summaryText = directText;
      }

      setDispatchResult({
        department: dept,
        priority,
        urgencyScore: score,
        sla,
        confidence: 0.976,
        detectedDialect: activeTab === "voice" ? "Hinglish / Hindi" : activeTab === "ocr" ? "Devanagari / Hindi" : "Hindi / Hinglish",
        summary: summaryText,
        safetyRationale: rationale,
        taskId: "TASK-GRV-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsDispatching(false);
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  };

  const handleLoadPreset = (preset: typeof PRESETS[0]) => {
    setActiveTab(preset.mode);
    if (preset.mode === "voice") setVoiceTranscript(preset.text);
    if (preset.mode === "ocr") setOcrExtractedPreview(preset.text);
    if (preset.mode === "text") setDirectText(preset.text);

    setDispatchResult({
      department: preset.dept,
      priority: "HIGH",
      urgencyScore: preset.score,
      sla: preset.sla,
      confidence: 0.985,
      detectedDialect: preset.mode === "ocr" ? "Devanagari Hindi" : "Colloquial Indic",
      summary: preset.text,
      safetyRationale: preset.rationale,
      taskId: "TASK-GRV-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const copyAuditLog = () => {
    if (!dispatchResult) return;
    navigator.clipboard.writeText(JSON.stringify(dispatchResult, null, 2));
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2000);
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
            <span>MISSION BHASHINI v3.6 • INTAKE INGESTION SUITE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Tri-Modal Grievance Intake Studio
          </h1>
          <p className="text-sm text-slate-600 font-sans max-w-2xl">
            Ingest citizen voice hotlines, handwritten physical petitions, and multilingual digital complaints into structured, explainable municipal dispatch actions with zero acoustic data egress.
          </p>
        </div>

        {/* Quick Hazard Presets Pill Bar */}
        <div className="space-y-1.5 self-start md:self-auto">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            QUICK CIVIC PRESETS
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleLoadPreset(p)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-teal-600" />
                <span>{p.title.split(" (")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN INGESTION & DISPATCH GRID
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 COLS): 3-Tab Ingestion Studio */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Modality Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl font-mono text-xs font-bold">
            
            {/* Tab 1: Voice */}
            <button
              onClick={() => setActiveTab("voice")}
              className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
                activeTab === "voice"
                  ? "bg-white text-indigo-950 shadow-sm border border-slate-200 font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mic className={`w-4 h-4 ${activeTab === "voice" ? "text-indigo-600" : "text-slate-400"}`} />
              <div>
                <div>VOICE RECORDING</div>
                <div className="text-[9px] text-slate-400 font-normal hidden sm:block">Speech-to-Text</div>
              </div>
            </button>

            {/* Tab 2: Document OCR */}
            <button
              onClick={() => setActiveTab("ocr")}
              className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
                activeTab === "ocr"
                  ? "bg-white text-sky-950 shadow-sm border border-slate-200 font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Scan className={`w-4 h-4 ${activeTab === "ocr" ? "text-sky-600" : "text-slate-400"}`} />
              <div>
                <div>DOCUMENT SCAN</div>
                <div className="text-[9px] text-slate-400 font-normal hidden sm:block">Handwritten &amp; Printed OCR</div>
              </div>
            </button>

            {/* Tab 3: Direct Text */}
            <button
              onClick={() => setActiveTab("text")}
              className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
                activeTab === "text"
                  ? "bg-white text-emerald-950 shadow-sm border border-slate-200 font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === "text" ? "text-emerald-600" : "text-slate-400"}`} />
              <div>
                <div>DIRECT TEXT</div>
                <div className="text-[9px] text-slate-400 font-normal hidden sm:block">Multilingual NLP</div>
              </div>
            </button>

          </div>


          {/* -------------------------------------------------------------
              TAB 1 CONTENT: VOICE-SAMVAD
             ------------------------------------------------------------- */}
          {activeTab === "voice" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Audio Ingestion Console Card */}
              <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-indigo-900 uppercase">
                      ACOUSTIC STREAM INGESTION (16 kHz PCM)
                    </div>
                    <p className="text-xs text-slate-600 font-sans mt-0.5">
                      Stream citizen hotline audio with real-time VAD voice activity detection and sub-10ms Wav2Vec2 phonetic alignment.
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-indigo-600"}`} />
                    <span className="text-xs font-mono font-bold text-indigo-900">
                      {isRecording ? `RECORDING (${recordingDuration}s)` : "STANDBY"}
                    </span>
                  </div>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="h-16 rounded-xl bg-white border border-indigo-200/80 p-3 flex items-center justify-center relative overflow-hidden">
                  {isRecording ? (
                    <div className="flex items-center gap-1.5 h-full w-full justify-center">
                      {[40, 70, 90, 30, 80, 100, 60, 40, 85, 95, 45, 65, 80, 30, 70, 90, 50].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                          transition={{ repeat: Infinity, duration: 0.8 + (i % 5) * 0.1, ease: "easeInOut" }}
                          className="w-1.5 bg-indigo-500 rounded-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      <span>Microphone stream idle • Press record or simulate to begin</span>
                    </div>
                  )}
                </div>

                {/* Recording Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {!isRecording ? (
                    <>
                      <button
                        onClick={startRecording}
                        className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Microphone</span>
                      </button>

                      <button
                        onClick={simulateMicStream}
                        className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                      >
                        <Radio className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Simulate Hotline Ingest (6s)</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm animate-pulse"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Stop &amp; Process CTC Stream</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Editable Voice Transcript Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                    PHONETICALLY ALIGNED TRANSCRIPT (CTC 99.2%)
                  </label>
                  <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Dialect: Hinglish / Colloquial Hindi
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-sans text-slate-800 leading-relaxed outline-none transition-all resize-none shadow-2xs"
                  placeholder="Citizen spoken audio transcript will appear here..."
                />
              </div>
            </motion.div>
          )}


          {/* -------------------------------------------------------------
              TAB 2 CONTENT: VISION-DRISHTI (OCR)
             ------------------------------------------------------------- */}
          {activeTab === "ocr" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Document Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer space-y-3 ${
                  isDragging
                    ? "border-sky-500 bg-sky-50"
                    : "border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                
                <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 mx-auto flex items-center justify-center text-sky-600 shadow-2xs">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-xs font-mono font-bold text-sky-950 uppercase">
                    {selectedFile ? selectedFile.name : "DROP HANDWRITTEN PETITION / NOTICE IMAGE"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                    Supports Devanagari physical handwritten memos, official stamp notices, and field photo evidence
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-800 text-[10px] font-mono font-bold">
                  <span>BACKBONE: TrOCR DEVANAGARI LARGE &bull; CER 1.3%</span>
                </div>
              </div>

              {/* Editable OCR Token Extraction */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                    EXTRACTED TOKEN STREAM (TR-OCR PARSED)
                  </label>
                  <span className="text-[10px] font-mono text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    Script: Devanagari (हिन्दी)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={ocrExtractedPreview}
                  onChange={(e) => setOcrExtractedPreview(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm font-sans text-slate-800 leading-relaxed outline-none transition-all resize-none shadow-2xs"
                  placeholder="Extracted Devanagari / Regional script tokens will appear here..."
                />
              </div>
            </motion.div>
          )}


          {/* -------------------------------------------------------------
              TAB 3 CONTENT: IADS-SACHET (TEXT)
             ------------------------------------------------------------- */}
          {activeTab === "text" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Language Selector Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span>SELECT INDIC LANGUAGE (22 EIGHTH SCHEDULE LANGUAGES)</span>
                  <span className="text-[10px] text-teal-700 font-bold">BHASHINI NATIVE</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedLanguageCode}
                    onChange={(e) => setSelectedLanguageCode(e.target.value)}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none appearance-none cursor-pointer shadow-2xs"
                  >
                    {INDIAN_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} — Script: {lang.script} ({lang.speakers})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
                </div>
              </div>

              {/* Direct Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  GRIEVANCE DESCRIPTION / CITIZEN REPORT
                </label>
                <textarea
                  rows={5}
                  value={directText}
                  onChange={(e) => setDirectText(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-sans text-slate-800 leading-relaxed outline-none transition-all resize-none shadow-2xs"
                  placeholder="Type or paste citizen complaint in any Indian language or dialect..."
                />
              </div>
            </motion.div>
          )}


          {/* DISPATCH ACTION TRIGGER BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-500">
              Zero-egress classification &bull; Local token pipeline
            </div>

            <button
              onClick={handleTriggerDispatch}
              disabled={isDispatching}
              className="px-6 py-3 rounded-full bg-[#0a1120] hover:bg-[#15233e] disabled:bg-slate-400 text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isDispatching ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Computing Hazard Vector...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>DISPATCH &amp; AUDIT GRIEVANCE</span>
                </>
              )}
            </button>
          </div>

        </div>


        {/* RIGHT COLUMN (5 COLS): Live Redressal Dispatch Card */}
        <div ref={resultRef} className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header Telemetry */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-mono font-black tracking-wider text-slate-900 uppercase">
                  REDRESSAL DISPATCH ORDER
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {dispatchResult?.taskId || "LIVE AUDIT"}
              </span>
            </div>

            {dispatchResult ? (
              <div className="space-y-5">
                
                {/* 1. Urgency Metric & SLA Box */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Urgency Score */}
                  <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 text-center space-y-1">
                    <div className="text-[10px] font-mono text-red-700 font-bold uppercase">
                      HAZARD URGENCY
                    </div>
                    <div className="text-3xl font-serif font-black text-red-950">
                      {dispatchResult.urgencyScore}
                      <span className="text-xs font-mono text-red-600 font-normal"> / 100</span>
                    </div>
                    <div className="text-[9px] font-mono text-red-700 font-bold">
                      {dispatchResult.priority} PRIORITY
                    </div>
                  </div>

                  {/* Target SLA */}
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-center space-y-1">
                    <div className="text-[10px] font-mono text-teal-800 font-bold uppercase">
                      DISPATCH SLA
                    </div>
                    <div className="text-base font-serif font-bold text-teal-950 mt-1">
                      {dispatchResult.sla.split(" ")[0]} {dispatchResult.sla.split(" ")[1]}
                    </div>
                    <div className="text-[9px] font-mono text-teal-700 font-bold">
                      MANDATORY TIMEOUT
                    </div>
                  </div>

                </div>

                {/* 2. Target Department Routing */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                    <span>DESIGNATED MUNICIPAL AUTHORITY</span>
                    <span className="text-emerald-700 font-bold">
                      {(((dispatchResult.confidence ?? 0.95)) * 100).toFixed(1)}% CONFIDENCE
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-900">
                    <Building2 className="w-5 h-5 text-teal-700 shrink-0" />
                    <span className="font-serif font-bold text-base leading-tight">
                      {dispatchResult.department}
                    </span>
                  </div>
                </div>

                {/* 3. Safety Rationale */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    CIVIC SAFETY RATIONALE
                  </div>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    {dispatchResult.safetyRationale}
                  </p>
                </div>

                {/* 4. Human-in-the-Loop Officer Gate Switch */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-300 font-bold">HUMAN OFFICER SIGN-OFF</span>
                    <button
                      onClick={() => setIsOfficerVerified(!isOfficerVerified)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                        isOfficerVerified
                          ? "bg-emerald-500 text-black font-black"
                          : "bg-amber-500 text-black"
                      }`}
                    >
                      {isOfficerVerified ? "VERIFIED & SIGNED" : "PENDING REVIEW"}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    All emergency dispatches require double-sign validation before municipal crew alert is triggered.
                  </div>
                </div>

                {/* 5. Export Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={copyAuditLog}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-mono font-bold text-xs text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedAudit ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied JSON</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Audit JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => alert("Structured Grievance PDF dispatched to municipal zonal desk.")}
                    className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 font-mono font-bold text-xs text-teal-900 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    <span>Download Order</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                No active grievance dispatched. Select a preset or input citizen data.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
