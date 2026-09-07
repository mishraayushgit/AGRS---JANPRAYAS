import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  FileText,
  Scan,
  Type,
  Cpu,
  Layers,
  Zap,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Database,
  Radio,
  Clock,
  Gauge,
  MapPin,
  Check,
} from "lucide-react";

export interface PipelineStage {
  id: string;
  stepNumber: number;
  name: string;
  shortName: string;
  category: string;
  latency: string;
  hardware: string;
  model: string;
  description: string;
  inputSample: string;
  outputSample: string;
  keyFeatures: string[];
  metrics: { label: string; value: string }[];
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "intake",
    stepNumber: 1,
    name: "Multimodal Citizen Ingest",
    shortName: "Intake",
    category: "Ingress Gateway",
    latency: "18 ms",
    hardware: "FastAPI + Edge CDN",
    model: "Zero-Loss Buffer / Redis Stream",
    description:
      "Captures heterogeneous citizen inputs from 16 kHz telephony audio, camera uploads, scanned handwritten postcards, SMS, or direct web portals into an encrypted sovereign queue.",
    inputSample: "Raw 16kHz PCM Audio Stream / High-res JPEG Postcard (2400x1600)",
    outputSample: "Standardized binary payload tagged with Geo-IP, Ward metadata & timestamp",
    keyFeatures: [
      "24x7 IVR Telephony Gateway (PSTN & SIP)",
      "High-throughput Redis Celery Task Queue",
      "Automatic media integrity & anti-spam validation",
      "DPDP 2023 zero-egress edge encryption",
    ],
    metrics: [
      { label: "Ingest Rate", value: "2,400 req/s" },
      { label: "Drop Rate", value: "0.000%" },
      { label: "Buffer SLA", value: "< 25 ms" },
    ],
  },
  {
    id: "extraction",
    stepNumber: 2,
    name: "Sovereign AI Extraction",
    shortName: "Extraction",
    category: "Perception Layer",
    latency: "142 ms",
    hardware: "GPU Cluster (T4 / A10G)",
    model: "WhisperX Large-v3 + TrOCR + PaddleOCR",
    description:
      "Translates spoken dialects and cursive handwriting into normalized digital text with word-level forced alignment timestamps and Character Error Rates below 1.5%.",
    inputSample: "Audio: 'बिजली का तार टूट कर गिर गया है...' (Bhojpuri/Hindi dialect)",
    outputSample: "Transcript: 'मेन मार्केट में 11kV बिजली का तार टूट कर पानी में गिर गया है' [Confidence: 99.4%]",
    keyFeatures: [
      "PyAnnote Voice Activity Detection (SNR > 18dB)",
      "CTranslate2 WhisperX with batched beam search",
      "Devanagari TrOCR Vision Transformer",
      "Wav2Vec2 phoneme boundary alignment (<10ms)",
    ],
    metrics: [
      { label: "ASR WER", value: "3.2%" },
      { label: "OCR CER", value: "1.4%" },
      { label: "Indic Dialects", value: "22 Languages" },
    ],
  },
  {
    id: "understanding",
    stepNumber: 3,
    name: "Indic Zero-Shot Understanding",
    shortName: "Understanding",
    category: "Cognitive NLU",
    latency: "52 ms",
    hardware: "CPU High-Density Nodes",
    model: "Indic-BERT / Sovereign Zero-Shot NLP",
    description:
      "Parses syntactic intent, extracts geographic landmarks, identifies named entities (Panchayat, Ward, Landmark), and strictly sanitizes Aadhaar/Phone PII.",
    inputSample: "Extracted raw civic transcript with resident phone & Aadhaar number",
    outputSample: "Entities: { Hazard: 'Live 11kV Wire', Landmark: 'Near Municipal School', PII: '[MASKED]' }",
    keyFeatures: [
      "Statutory PII Sanitization under DPDP Act 2023",
      "Geo-Entity Extraction (Landmarks, Crossings, Wards)",
      "Multilingual translation to English/Hindi canonical formats",
      "Zero-Shot categorical classification across 12 departments",
    ],
    metrics: [
      { label: "PII Masking", value: "100.0%" },
      { label: "Entity F1", value: "96.8%" },
      { label: "Canonical Norm", value: "52 ms" },
    ],
  },
  {
    id: "prioritization",
    stepNumber: 4,
    name: "Deterministic Risk Prioritization",
    shortName: "Prioritization",
    category: "Mathematical Risk Engine",
    latency: "28 ms",
    hardware: "Deterministic Rule Engine",
    model: "Municipal Hazard Severity Matrix (0–100)",
    description:
      "Calculates objective threat severity on a 0–100 index based on life-safety impact, population density, water/power lifelines, and weather alerts.",
    inputSample: "Hazard: 'Live electrical cable in flooded road' + Weather: 'Heavy Rain Alert'",
    outputSample: "Risk Score: 98/100 (TIER-1 CRITICAL) -> Enforce < 15 Min Rapid Response SLA",
    keyFeatures: [
      "Tier-1 Critical (Score 90-100): Immediate life/health hazard",
      "Tier-2 High (Score 50-89): Major infrastructural interruption",
      "Tier-3 Routine (Score 0-49): Standard civic service request",
      "Automated escalation triggers upon SLA timer breach",
    ],
    metrics: [
      { label: "Triage Accuracy", value: "99.8%" },
      { label: "Critical False Neg", value: "0.00%" },
      { label: "Avg Calibration", value: "28 ms" },
    ],
  },
  {
    id: "routing",
    stepNumber: 5,
    name: "Geospatial Ward Routing & Dispatch",
    shortName: "Routing & SLA",
    category: "Field Operations",
    latency: "35 ms",
    hardware: "GeoSpatial PostGIS / Kafka Stream",
    model: "Automated Ward Boundary & Officer Assignment",
    description:
      "Pins grievance to verified municipal polygon coordinates, assigns the designated Assistant Engineer, and requires cryptographic Human-In-The-Loop approval for final closure.",
    inputSample: "Risk: 98/100 + Location: 'Sector 18 Market, Ward 07' -> Coordinates: 28.5700°N, 77.3218°E",
    outputSample: "Dispatched: Rapid Electrical Response Team A & Nodal Officer AE Verma [SLA Clock Active]",
    keyFeatures: [
      "Geofenced Ward Boundary matching (<5m accuracy)",
      "Automated SMS/WhatsApp siren alerts to on-duty field teams",
      "Human-in-the-loop officer digital signature ledger",
      "Citizen live tracking link generated instantly",
    ],
    metrics: [
      { label: "Ward Match Rate", value: "100.0%" },
      { label: "Dispatch SLA", value: "< 15 Mins" },
      { label: "Ledger Audit", value: "SHA-256" },
    ],
  },
];

export const MultimodalPipelineDiagram: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto progression when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % PIPELINE_STAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStage = PIPELINE_STAGES[activeStepIndex];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10 space-y-8">
      
      {/* =========================================================================
          TOP CONTROLS & HEADER
         ========================================================================= */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#007A99] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#007A99] animate-ping" />
            <span>INTERACTIVE ARCHITECTURE WORKFLOW</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mt-1">
            Multimodal Processing Pipeline
          </h3>
          <p className="text-sm text-slate-600 font-sans mt-0.5">
            Follow the live transformation of raw citizen signals into prioritized municipal dispatches.
          </p>
        </div>

        {/* Playback Controls & Stage Stepper */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              isPlaying
                ? "bg-[#007A99] text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Auto-Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Tour</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setActiveStepIndex(0);
              setIsPlaying(false);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE SVG PIPELINE CONDUIT (5 Nodes Connected by Pulsing Signal Paths)
         ========================================================================= */}
      <div className="relative w-full overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-[760px] relative py-6 px-4 bg-[#F8FAFC] rounded-2xl border border-slate-200/80">
          
          {/* Background SVG Signal Conduits */}
          <svg
            className="absolute top-1/2 left-8 right-8 -translate-y-1/2 w-[calc(100%-64px)] h-12 pointer-events-none"
            viewBox="0 0 700 48"
            fill="none"
          >
            {/* Base Wire Track */}
            <path
              d="M 20 24 L 680 24"
              stroke="#CBD5E1"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            {/* Animated Active Flow Line */}
            <motion.path
              d={`M 20 24 L ${20 + (activeStepIndex / 4) * 660} 24`}
              stroke="#007A99"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* Pulsing Signal Dot */}
            <motion.circle
              cx={20 + (activeStepIndex / 4) * 660}
              cy={24}
              r={7}
              fill="#007A99"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </svg>

          {/* 5 Interactive Step Nodes */}
          <div className="relative z-10 grid grid-cols-5 gap-3">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = idx < activeStepIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`group relative flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-white border-2 border-[#007A99] shadow-md -translate-y-1"
                      : isPast
                      ? "bg-white/90 border border-slate-300 hover:border-slate-400"
                      : "bg-white/60 border border-slate-200 hover:bg-white"
                  }`}
                >
                  {/* Step Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-transform ${
                      isActive
                        ? "bg-[#007A99] text-white shadow-sm scale-110"
                        : isPast
                        ? "bg-teal-50 text-[#007A99] border border-teal-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>0{stage.stepNumber}</span>
                    )}
                  </div>

                  {/* Node Title & Latency */}
                  <div className="mt-2.5 space-y-0.5">
                    <span className="block text-xs font-sans font-bold text-slate-900 group-hover:text-[#007A99] transition-colors leading-tight">
                      {stage.shortName}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500">
                      {stage.latency}
                    </span>
                  </div>

                  {/* Active Indicator Triangle */}
                  {isActive && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#007A99]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* =========================================================================
          STAGE DETAILS & TELEMETRY BREAKDOWN (Smooth Transition)
         ========================================================================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/90"
        >
          {/* Left Column: Stage Explanation & Specs */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-sky-100 text-[#007A99] text-[10px] font-mono font-bold uppercase">
                  Stage 0{currentStage.stepNumber} &bull; {currentStage.category}
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  Latency: <strong className="text-slate-900">{currentStage.latency}</strong>
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {currentStage.name}
              </h4>
              <p className="text-sm text-slate-600 font-sans leading-relaxed mt-2">
                {currentStage.description}
              </p>
            </div>

            {/* Core Neural Architectures & Models */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#007A99]" />
                  <span>COMPUTE HARDWARE</span>
                </div>
                <div className="font-bold text-slate-900">{currentStage.hardware}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>NEURAL INFERENCE ENGINE</span>
                </div>
                <div className="font-bold text-slate-900">{currentStage.model}</div>
              </div>
            </div>

            {/* Key Capabilities Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase">
                CRITICAL CAPABILITIES:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-700">
                {currentStage.keyFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Data Payloads & Real-Time Metrics */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Metrics Row */}
            <div className="grid grid-cols-3 gap-2 font-mono">
              {currentStage.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                  <div className="text-[10px] text-slate-400 uppercase">{m.label}</div>
                  <div className="text-sm font-black text-[#007A99] mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Payload Transformation Box */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-teal-400 pb-1.5 border-b border-slate-800">
                <span className="font-bold uppercase tracking-wider">LIVE TELEMETRY STREAM</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED
                </span>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">INPUT PAYLOAD:</div>
                <div className="text-slate-300 mt-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-words">
                  {currentStage.inputSample}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-teal-400 uppercase font-bold flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>OUTPUT MANIFEST:</span>
                </div>
                <div className="text-teal-300 mt-1 bg-slate-950 p-2.5 rounded-lg border border-teal-900/50 break-words font-semibold">
                  {currentStage.outputSample}
                </div>
              </div>
            </div>

            {/* Next Step Nav Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setActiveStepIndex((prev) => (prev + 1) % PIPELINE_STAGES.length);
                  setIsPlaying(false);
                }}
                className="text-xs font-mono font-bold text-[#007A99] hover:text-[#005a72] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>
                  {activeStepIndex === PIPELINE_STAGES.length - 1
                    ? "Loop to Start"
                    : `Next: ${PIPELINE_STAGES[activeStepIndex + 1].shortName}`}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
