import React from "react";
import {
  Mic,
  FileText,
  Scan,
  Type,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Cpu,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  Building2,
  Lock,
  Compass,
} from "lucide-react";

/**
 * Horizontal 5-Step Process Diagram: FROM CITIZEN SIGNAL TO CIVIC ACTION
 */
export const ProcessFlowDiagram: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "CITIZEN SIGNAL",
      subtitle: "Unstructured Input",
      tags: ["Voice", "Handwritten", "Printed", "Text"],
      icon: <Compass className="w-4 h-4 text-teal-700" />,
      accent: "border-teal-300 bg-teal-50/50",
    },
    {
      num: "02",
      title: "EXTRACT",
      subtitle: "Acoustic & Vision OCR",
      tags: ["ASR", "OCR", "Language Detect"],
      icon: <Scan className="w-4 h-4 text-sky-700" />,
      accent: "border-sky-300 bg-sky-50/50",
    },
    {
      num: "03",
      title: "UNDERSTAND",
      subtitle: "Zero-Shot Indic NLP",
      tags: ["Entities", "Classification", "Context"],
      icon: <Cpu className="w-4 h-4 text-indigo-700" />,
      accent: "border-indigo-300 bg-indigo-50/50",
    },
    {
      num: "04",
      title: "PRIORITIZE",
      subtitle: "Deterministic Risk Model",
      tags: ["Urgency", "0–100 Scale", "Public Safety"],
      icon: <Zap className="w-4 h-4 text-amber-700" />,
      accent: "border-amber-300 bg-amber-50/50",
    },
    {
      num: "05",
      title: "ROUTE",
      subtitle: "Departmental Dispatch",
      tags: ["Department", "SLA", "Field Dispatch"],
      icon: <Send className="w-4 h-4 text-emerald-700" />,
      accent: "border-emerald-300 bg-emerald-50/50",
    },
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="min-w-[920px] grid grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Step Number & Icon */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-black text-slate-400">
                  STEP {step.num}
                </span>
                <div className={`p-1.5 rounded-lg border ${step.accent}`}>
                  {step.icon}
                </div>
              </div>

              <h4 className="text-xs font-mono font-black tracking-wider text-slate-900 uppercase">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5 mb-3">
                {step.subtitle}
              </p>
            </div>

            {/* Tags */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
              {step.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-mono text-slate-700 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Connecting arrow except last */}
            {idx < steps.length - 1 && (
              <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-slate-200 items-center justify-center shadow-xs">
                <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Diagram A — MULTIMODAL INTAKE CONVERGENCE
 * Four inputs converge into Common Processing Layer into Structured Grievance
 */
export const DiagramMultimodalIntake: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
            DIAGRAM A &bull; MULTIMODAL INTAKE CONVERGENCE
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          ZERO FORMAT CONSTRAINTS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: 4 Citizen Ingestion Modalities */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-900">VOICE</div>
                <div className="text-[10px] text-slate-500 font-sans">Spoken Vernacular &amp; Hinglish</div>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">PCM 16k</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-900">HANDWRITTEN PETITION</div>
                <div className="text-[10px] text-slate-500 font-sans">Handwritten Vernacular Letters</div>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">TrOCR</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800">
                <Scan className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-900">PRINTED DOCUMENT</div>
                <div className="text-[10px] text-slate-500 font-sans">Official Circulars &amp; Signboards</div>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">PaddleOCR</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                <Type className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-900">DIRECT TEXT</div>
                <div className="text-[10px] text-slate-500 font-sans">Multilingual Web Portal &amp; SMS</div>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">UTF-8</span>
          </div>
        </div>

        {/* Center: Converging Flow arrows */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50/80 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
            &darr;
          </div>
          <div>
            <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
              COMMON PROCESSING LAYER
            </div>
            <div className="text-[11px] text-slate-600 font-sans max-w-xs mt-1">
              Phoneme alignment, script normalization, entity extraction and DPDP PII pseudonymization.
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-mono text-slate-700">
            <Lock className="w-3 h-3 text-teal-700" />
            <span>Air-Gapped In-Memory Buffer</span>
          </div>
        </div>

        {/* Right: One Structured Grievance Output */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border-2 border-slate-900 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              STANDARDIZED RECORD
            </span>
            <span className="text-[10px] font-mono text-slate-400">JSON SCHEMA</span>
          </div>
          <div className="text-xs font-mono font-black text-slate-900 uppercase">
            STRUCTURED CIVIC CASE
          </div>
          <ul className="text-[11px] font-mono text-slate-600 space-y-1">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Verbatim normalized text</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Confidence &amp; CER metrics</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Extracted geo-ward &amp; hazards</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Cryptographic audit hash</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Diagram B — INTELLIGENCE PIPELINE
 * Voice (PyAnnote/Whisper/Wav2Vec2), Handwritten (TrOCR), Printed (PaddleOCR), Text (LangDetect)
 * -> Normalized -> Zero-Shot -> Urgency -> Dept -> SLA
 */
export const DiagramIntelligencePipeline: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-700" />
          <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
            DIAGRAM B &bull; MODALITY EXTRACTION &amp; TRIAGE PIPELINE
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          LATENCY &lt; 350MS
        </span>
      </div>

      {/* Grid of Modality Pipelines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Voice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-black text-teal-800 uppercase">
            <Mic className="w-3.5 h-3.5 text-teal-700" />
            <span>VOICE</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; PyAnnote VAD</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; WhisperX Batched</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; Wav2Vec2 CTC Align</div>
          </div>
        </div>

        {/* Handwritten */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-black text-sky-800 uppercase">
            <FileText className="w-3.5 h-3.5 text-sky-700" />
            <span>HANDWRITTEN</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; Adaptive Binarization</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; Line Segmentation</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; TrOCR Transformer</div>
          </div>
        </div>

        {/* Printed */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-black text-indigo-800 uppercase">
            <Scan className="w-3.5 h-3.5 text-indigo-700" />
            <span>PRINTED</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; DBNet Layout Detection</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; PaddleOCR v4</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; SVTR-LCNet Multi-Script</div>
          </div>
        </div>

        {/* Text */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-black text-emerald-800 uppercase">
            <Type className="w-3.5 h-3.5 text-emerald-700" />
            <span>DIRECT TEXT</span>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; 22 Indic Lang ID</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; Script Transliteration</div>
            <div className="p-1.5 rounded bg-white border border-slate-200">&rarr; PII Pseudonymization</div>
          </div>
        </div>
      </div>

      {/* Converging Downward Flow to NLP, Urgency, Department, SLA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-teal-400 font-bold">ALL CONVERGE INTO NORMALIZED GRIEVANCE</span>
          <span className="text-[10px] text-slate-400">UNIFIED REASONING ENGINE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase">STAGE 01</div>
            <div className="font-bold text-white mt-0.5">ZERO-SHOT NLP</div>
            <div className="text-[10px] text-slate-300 font-sans mt-0.5">Semantic hazard taxonomy</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase">STAGE 02</div>
            <div className="font-bold text-amber-400 mt-0.5">URGENCY SCORE</div>
            <div className="text-[10px] text-slate-300 font-sans mt-0.5">0–100 risk calculation</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase">STAGE 03</div>
            <div className="font-bold text-teal-400 mt-0.5">DEPT ROUTING</div>
            <div className="text-[10px] text-slate-300 font-sans mt-0.5">Deterministic municipal route</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="text-[10px] text-slate-400 uppercase">STAGE 04</div>
            <div className="font-bold text-emerald-400 mt-0.5">SLA WINDOW</div>
            <div className="text-[10px] text-slate-300 font-sans mt-0.5">&lt;15m / &lt;2h / &lt;24h timer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Diagram C — RESPONSIBLE AI GOVERNANCE & RESPONSE LOOP
 * Citizen -> Grievance -> AI Assessment -> Human Verification -> Department -> Field Response -> Resolution -> Audit Trail
 */
export const DiagramResponseLoop: React.FC = () => {
  const loopStages = [
    { label: "CITIZEN", desc: "Citizen lodges complaint in any dialect", icon: <Mic className="w-3.5 h-3.5" />, color: "border-slate-300 text-slate-800" },
    { label: "GRIEVANCE", desc: "Ingested via voice, paper, or text", icon: <FileText className="w-3.5 h-3.5" />, color: "border-teal-300 text-teal-800" },
    { label: "AI ASSESSMENT", desc: "Urgency score & department route", icon: <Cpu className="w-3.5 h-3.5" />, color: "border-indigo-300 text-indigo-800" },
    { label: "HUMAN CHECKPOINT", desc: "Officer verification before field trigger", icon: <UserCheck className="w-3.5 h-3.5" />, color: "border-amber-400 text-amber-900 bg-amber-50/70 font-bold" },
    { label: "DEPARTMENT", desc: "Assigned to Power, Water, Roads, Health", icon: <Building2 className="w-3.5 h-3.5" />, color: "border-sky-300 text-sky-800" },
    { label: "FIELD RESPONSE", desc: "Quick response squad deployed on site", icon: <Zap className="w-3.5 h-3.5" />, color: "border-orange-300 text-orange-800" },
    { label: "RESOLUTION", desc: "Citizen notified of completed repair", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "border-emerald-300 text-emerald-800" },
    { label: "AUDIT TRAIL", desc: "SHA-256 tamper-proof governance log", icon: <ShieldCheck className="w-3.5 h-3.5" />, color: "border-slate-900 text-slate-900 bg-slate-100 font-bold" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
            DIAGRAM C &bull; RESPONSIBLE CIVIC RESPONSE LOOP
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-mono text-amber-900 font-bold">
          <UserCheck className="w-3 h-3 text-amber-700" />
          <span>HUMAN VERIFICATION GATEWAY MANDATORY</span>
        </div>
      </div>

      {/* Visual Flow Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {loopStages.map((stage, idx) => (
          <div
            key={stage.label}
            className={`p-3 rounded-2xl border ${stage.color} bg-white flex flex-col justify-between text-left space-y-2 relative shadow-2xs`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-400 font-bold">
                0{idx + 1}
              </span>
              <div className="p-1 rounded-md bg-slate-50 border border-slate-200/80">
                {stage.icon}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono font-black tracking-tight uppercase leading-tight">
                {stage.label}
              </div>
              <div className="text-[10px] text-slate-500 font-sans leading-tight mt-1">
                {stage.desc}
              </div>
            </div>

            {idx < loopStages.length - 1 && (
              <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                &rarr;
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Explanatory callout */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans text-slate-600">
        <div className="space-y-0.5">
          <div className="font-mono font-bold text-slate-900 text-xs uppercase">
            Traceable &bull; Accountable &bull; DPDP Act 2023 Compliant
          </div>
          <p className="text-[11px] text-slate-500 max-w-2xl">
            Automated urgency scoring and department classification provide high-confidence recommendations. Every critical dispatch requires human officer sign-off before field crews mobilize.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono text-[10px] font-bold text-slate-800 whitespace-nowrap self-end sm:self-auto">
          ZERO PHYSICAL VERIFICATION CLAIM
        </div>
      </div>
    </div>
  );
};

/**
 * Visual Urgency Model Scale (Critical <15m, High <2h, Routine <24h)
 */
export const UrgencyScaleDiagram: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
            THREE-TIER CIVIC RISK &amp; SLA MATRIX
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          MATHEMATICALLY CALIBRATED
        </span>
      </div>

      {/* Horizontal Severity Bar Connecting all three */}
      <div className="relative pt-2 pb-1">
        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600" />
      </div>

      {/* 3 Tier Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 Critical */}
        <div className="p-5 rounded-2xl bg-rose-50/50 border-2 border-rose-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-rose-800 uppercase tracking-wider">
              01 &bull; CRITICAL
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-900 font-mono font-bold text-[10px]">
              &lt; 15 MIN SLA
            </span>
          </div>

          <div className="text-2xl font-serif font-bold text-slate-900">
            90 – 100 <span className="text-xs font-sans text-slate-500 font-normal">Score</span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">
            Imminent threat to human life, public safety, or core civic utility infrastructure.
          </p>

          <div className="pt-2 border-t border-rose-200/60 space-y-1 text-[11px] font-mono text-rose-950">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <span>Exposed live conductor</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <span>Water contamination / Cholera</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <span>Gas leak / Toxic biohazard</span>
            </div>
          </div>
        </div>

        {/* Tier 2 High */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border-2 border-amber-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-amber-800 uppercase tracking-wider">
              02 &bull; HIGH
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono font-bold text-[10px]">
              &lt; 2 HR SLA
            </span>
          </div>

          <div className="text-2xl font-serif font-bold text-slate-900">
            50 – 89 <span className="text-xs font-sans text-slate-500 font-normal">Score</span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">
            Significant public disruption, major transport hazard, or community water failure.
          </p>

          <div className="pt-2 border-t border-amber-200/60 space-y-1 text-[11px] font-mono text-amber-950">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Deep road sinkholes</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Municipal main water failures</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Corridor lighting blackouts</span>
            </div>
          </div>
        </div>

        {/* Tier 3 Routine */}
        <div className="p-5 rounded-2xl bg-emerald-50/40 border-2 border-emerald-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-emerald-800 uppercase tracking-wider">
              03 &bull; ROUTINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono font-bold text-[10px]">
              &lt; 24 HR SLA
            </span>
          </div>

          <div className="text-2xl font-serif font-bold text-slate-900">
            0 – 49 <span className="text-xs font-sans text-slate-500 font-normal">Score</span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">
            Non-emergency civic requests, informational inquiries, and scheduled sanitation.
          </p>

          <div className="pt-2 border-t border-emerald-200/60 space-y-1 text-[11px] font-mono text-emerald-950">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Garbage collection schedule</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Information &amp; ward queries</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>General citizen feedback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Department Routing Section Diagram
 */
export const DepartmentRoutingDiagram: React.FC = () => {
  const departments = [
    {
      title: "POWER & ELECTRICITY",
      code: "PWR",
      sla: "< 15 MIN",
      examples: "High-voltage wire snapped, sparking transformers, substation fences, feeder faults",
      accent: "border-amber-200 bg-amber-50/40 text-amber-900",
    },
    {
      title: "WATER RESOURCES",
      code: "WTR",
      sla: "< 15 MIN / < 2 HR",
      examples: "Canal breaches, pipeline cross-contamination, dry ward supply, main burst",
      accent: "border-sky-200 bg-sky-50/40 text-sky-900",
    },
    {
      title: "PUBLIC HEALTH & SANITATION",
      code: "HLT",
      sla: "< 15 MIN / < 24 HR",
      examples: "Biomedical waste dumps, sewage overflows, disease hotspots, dead animals",
      accent: "border-emerald-200 bg-emerald-50/40 text-emerald-900",
    },
    {
      title: "ROADS & INFRASTRUCTURE",
      code: "RDS",
      sla: "< 2 HR / < 24 HR",
      examples: "Flyover sinkholes, missing manhole covers, bridge structural cracks, paving",
      accent: "border-indigo-200 bg-indigo-50/40 text-indigo-900",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
            DEPARTMENTAL TAXONOMY &amp; DISPATCH PATHS
          </span>
        </div>
        <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
          4 MUNICIPAL CADRES
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.code}
            className={`p-5 rounded-2xl border ${dept.accent} flex flex-col justify-between space-y-3 shadow-2xs`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200">
                  {dept.code}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  {dept.sla}
                </span>
              </div>
              <h4 className="text-xs font-mono font-black text-slate-900 uppercase">
                {dept.title}
              </h4>
            </div>

            <p className="text-[11px] text-slate-600 font-sans leading-relaxed pt-2 border-t border-slate-200/60">
              {dept.examples}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
