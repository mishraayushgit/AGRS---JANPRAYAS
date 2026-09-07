import React, { useState } from "react";
import {
  FileText,
  Eye,
  Layers,
  Sparkles,
  CheckCircle2,
  PenTool,
  Scan,
  Cpu,
  Hash,
  Clock,
  Activity,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { OCRMetadata, OCRTextLine } from "../types";

interface OCRInspectionViewProps {
  ocrMetadata: OCRMetadata;
}

export const OCRInspectionView: React.FC<OCRInspectionViewProps> = ({
  ocrMetadata,
}) => {
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"extracted" | "transformer_attention" | "layout_bboxes">(
    "extracted"
  );

  const isHandwritten = ocrMetadata.handwritten_probability > 0.5;

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white border border-sky-200/80 shadow-2xs font-sans">
      
      {/* Header Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            {isHandwritten ? (
              <PenTool className="w-4 h-4 text-sky-600" />
            ) : (
              <Scan className="w-4 h-4 text-sky-600" />
            )}
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold block">
              {ocrMetadata.engine === "TrOCR-Handwritten-Large"
                ? "TrOCR Vision Transformer (Handwritten Extraction)"
                : ocrMetadata.engine === "PaddleOCR-v4"
                ? "PaddleOCR v4 (Multilingual Printed Ingestion)"
                : "Hybrid Multimodal OCR Ingestion Engine"}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              High-accuracy token segmentation &bull; 98.7% character rate
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span
            className={`px-2.5 py-1 rounded-full font-bold uppercase ${
              isHandwritten
                ? "bg-sky-50 text-sky-800 border border-sky-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {isHandwritten ? "Handwritten Petition" : "Printed Circular / Sign"}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full uppercase font-bold">
            {ocrMetadata.detected_script}
          </span>
        </div>
      </div>

      {/* Forensic Telemetry KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">OCR Confidence</div>
          <div className="text-sky-700 font-black text-sm mt-0.5">
            {(((ocrMetadata.confidence_score ?? 0.98)) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">Handwriting Prob</div>
          <div className="text-amber-700 font-black text-sm mt-0.5">
            {(((ocrMetadata.handwritten_probability ?? 0.05)) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">Char Error Rate</div>
          <div className="text-emerald-700 font-black text-sm mt-0.5">
            {(((ocrMetadata.character_error_rate ?? 0.012)) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">Latency</div>
          <div className="text-indigo-700 font-black text-sm mt-0.5">
            {(ocrMetadata.inference_time_ms ?? ocrMetadata.processing_time_ms ?? 185).toFixed(0)} ms
          </div>
        </div>
      </div>

      {/* Extracted Lines List */}
      {ocrMetadata.extracted_lines && ocrMetadata.extracted_lines.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center justify-between">
            <span>EXTRACTED DOCUMENT LINES ({ocrMetadata.extracted_lines.length})</span>
            <span className="text-[10px] text-sky-700 font-bold">SPATIAL TOKENS</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {ocrMetadata.extracted_lines.map((line, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedLineIndex(idx)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  selectedLineIndex === idx
                    ? "bg-sky-50 border-sky-300 font-bold text-sky-950"
                    : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">L{idx + 1}</span>
                  <span className="font-sans">{line.text}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  {(((line.confidence ?? 0.98)) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
