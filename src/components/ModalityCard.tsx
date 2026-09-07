import React, { useState } from "react";
import {
  Mic,
  FileText,
  Scan,
  ShieldCheck,
  Zap,
  Radio,
  Layers,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

export interface ModalityItem {
  id: string;
  type: "voice" | "handwritten" | "document" | "text";
  tag: string;
  subsystemTag: string;
  modelName: string;
  headline: string;
  frontTitle: string;
  frontDescription: string;
  frontMetricLabel: string;
  frontCtaLabel: string;
  gradient: string;
  hoverThemeColor: string; // e.g. text-emerald-400
  hoverBadgeBg: string; // e.g. bg-emerald-500/20 text-emerald-300 border-emerald-500/30
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
  hoverRole: string;
  deepDescription: string;
  focusAreas: string[];
}

export const MODALITY_DATA: ModalityItem[] = [
  {
    id: "modality-voice",
    type: "voice",
    tag: "AUDIO ASR",
    subsystemTag: "AUDIO PIPELINE • ASR CORE",
    modelName: "WhisperX + Indic CTC",
    headline: "Vernacular Speech",
    frontTitle: "Spoken Dialect Ingestion",
    frontDescription:
      "Processes 16 kHz telephony voice notes across 22 Indic languages with word-level phonetic alignment and ambient noise cancellation.",
    frontMetricLabel: "WER < 3.2%",
    frontCtaLabel: "Launch Audio Ingestion",
    gradient: "from-teal-500 to-[#007A99]",
    hoverThemeColor: "text-teal-400",
    hoverBadgeBg: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    icon: <Mic className="w-4 h-4 text-teal-100" />,
    bgIcon: <Radio className="w-16 h-16" />,
    hoverRole: "22 Indic Dialects & Telephony Ingestion",
    deepDescription:
      "Deploys WhisperX Large-v3 fine-tuned on Indic corpora with Wav2Vec2/IndicCTC acoustic alignment. Features 8kHz-to-16kHz neural upsampling, VAD diarization, and real-time noise suppression for toll-free citizen grievance recording.",
    focusAreas: [
      "WhisperX Large",
      "IndicCTC Alignment",
      "VAD Diarization",
      "Air-Gapped Telephony",
    ],
  },
  {
    id: "modality-ocr",
    type: "handwritten",
    tag: "VISION OCR",
    subsystemTag: "VISION OCR • NEURAL TRANSFORMER",
    modelName: "TrOCR Vision Transformer",
    headline: "Handwritten Postcards",
    frontTitle: "Panchayat Letters & Postcards",
    frontDescription:
      "Digitizes handwritten citizen letters and postcards in Devanagari, Gurmukhi, and Tamil with Character Error Rates under 1.5%.",
    frontMetricLabel: "CER < 1.4%",
    frontCtaLabel: "Launch OCR Ingestion",
    gradient: "from-indigo-500 to-indigo-700",
    hoverThemeColor: "text-indigo-400",
    hoverBadgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    icon: <FileText className="w-4 h-4 text-indigo-100" />,
    bgIcon: <Scan className="w-16 h-16" />,
    hoverRole: "Multi-Script Handwriting Digitization",
    deepDescription:
      "Utilizes Microsoft TrOCR encoder-decoder architecture coupled with Donut spatial document segmentation. Resolves complex cursive handwriting across Devanagari, Gurmukhi, Tamil, and Bengali postcards with native postal pin-code extraction.",
    focusAreas: [
      "TrOCR Vision",
      "Donut Parser",
      "Multi-Script OCR",
      "CER < 1.4%",
    ],
  },
  {
    id: "modality-doc",
    type: "document",
    tag: "DOCUMENT & GEO",
    subsystemTag: "MULTIMODAL • SPATIAL PARSER",
    modelName: "PaddleOCR + LayoutLM",
    headline: "Printed Forms & Photos",
    frontTitle: "Hazard Photos & Circulars",
    frontDescription:
      "Extracts structured table data from printed municipal notices and parses geotagged images of road sinkholes and pipe ruptures.",
    frontMetricLabel: "Layout F1: 97.2%",
    frontCtaLabel: "Upload Photos & Docs",
    gradient: "from-amber-500 to-amber-700",
    hoverThemeColor: "text-amber-400",
    hoverBadgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: <Scan className="w-4 h-4 text-amber-100" />,
    bgIcon: <Layers className="w-16 h-16" />,
    hoverRole: "Tabular Gazette & Hazard Vision Engine",
    deepDescription:
      "Integrates LayoutLMv3 multimodal spatial-textual embeddings with PaddleOCR v4 table extraction. Automatically reads stamped gazette notifications, parses Geo-EXIF camera metadata, and detects road pothole severity.",
    focusAreas: [
      "LayoutLMv3",
      "PaddleOCR v4",
      "Geo-EXIF GPS",
      "Hazard Vision",
    ],
  },
  {
    id: "modality-triage",
    type: "text",
    tag: "TRIAGE & SLA",
    subsystemTag: "STATUTORY • TRIAGE ENGINE",
    modelName: "Mathematical Risk Matrix",
    headline: "Deterministic Scoring",
    frontTitle: "Risk Prioritization & SLAs",
    frontDescription:
      "Scores grievances on an objective 0–100 risk scale. Enforces sub-15 minute field dispatches for life-safety emergencies.",
    frontMetricLabel: "SLA: <15 min",
    frontCtaLabel: "Inspect SLA Triage",
    gradient: "from-rose-500 to-rose-700",
    hoverThemeColor: "text-rose-400",
    hoverBadgeBg: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: <Zap className="w-4 h-4 text-rose-100" />,
    bgIcon: <ShieldCheck className="w-16 h-16" />,
    hoverRole: "Objective 0–100 Emergency Escalation",
    deepDescription:
      "Applies zero-shot semantic categorization and deterministic weighted scoring for public safety. Evaluates electrocution hazards, ward boundary maps, and statutory RPTS Act resolution mandates to trigger automated sub-15 min dispatch alerts.",
    focusAreas: [
      "Deterministic Matrix",
      "Geo-Ward Routing",
      "DPDP Compliance",
      "Sub-15m Dispatch",
    ],
  },
];

interface ModalityCardProps {
  item: ModalityItem;
  onSelect: (type: "voice" | "handwritten" | "document" | "text") => void;
}

export const ModalityCard: React.FC<ModalityCardProps> = ({ item, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item.type)}
      className="relative h-[380px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-slate-700 select-none group"
    >
      {/* =========================================================================
          FRONT FACE (Clean Civic Card - Image 2 Style)
         ========================================================================= */}
      <div
        className={`absolute inset-0 bg-white flex flex-col justify-between p-5 transition-all duration-500 ease-in-out ${
          isHovered
            ? "opacity-0 -translate-y-4 pointer-events-none scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div className="space-y-4">
          {/* Top Graphic Thumbnail Header */}
          <div
            className={`h-32 rounded-xl bg-gradient-to-br ${item.gradient} p-3.5 flex flex-col justify-between text-white relative overflow-hidden shadow-xs`}
          >
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs">
                {item.tag}
              </span>
              <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center">
                {item.icon}
              </div>
            </div>
            <div className="z-10">
              <div className="text-[11px] font-mono opacity-85">{item.modelName}</div>
              <div className="text-sm sm:text-base font-bold font-sans">{item.headline}</div>
            </div>
            {/* Background Icon Watermark */}
            <div className="absolute right-2 bottom-2 opacity-20">
              {item.bgIcon}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-base font-bold font-sans text-slate-900 flex items-center justify-between">
              <span>{item.frontTitle}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
              {item.frontDescription}
            </p>
          </div>
        </div>

        {/* Card Footer Strip */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
          <span className="text-slate-500">{item.frontMetricLabel}</span>
          <span className="flex items-center gap-1 text-[#007A99]">
            <span>{item.frontCtaLabel}</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          HOVER STATE (Dark Architectural Tech Info Card - Image 3 Style)
         ========================================================================= */}
      <div
        className={`absolute inset-0 bg-[#0B132B] text-white flex flex-col justify-between p-5 transition-all duration-500 ease-in-out border border-slate-700/80 rounded-2xl ${
          isHovered
            ? "opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none z-0"
        }`}
      >
        <div className="space-y-3">
          {/* Top Eyebrow & Diagonal Arrow */}
          <div className="flex items-center justify-between">
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.hoverBadgeBg}`}
            >
              {item.subsystemTag}
            </span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Model Name Heading & Role Subtitle */}
          <div className="space-y-0.5">
            <h4 className="text-lg font-serif font-bold text-white tracking-tight leading-tight">
              {item.modelName}
            </h4>
            <div className={`text-xs font-sans italic ${item.hoverThemeColor}`}>
              {item.hoverRole}
            </div>
          </div>

          {/* Deep Architectural Content */}
          <p className="text-[11.5px] font-sans text-slate-300 leading-relaxed font-normal pt-1">
            {item.deepDescription}
          </p>
        </div>

        {/* Bottom Section: Focus Areas / Tech Stack Chips */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            FOCUS AREAS / ARCHITECTURE
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.focusAreas.map((chip, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-200 font-mono text-[10px] font-medium"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
