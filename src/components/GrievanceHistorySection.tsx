import React, { useState } from "react";
import {
  History,
  Search,
  RotateCcw,
  Trash2,
  Eye,
  Building2,
  Construction,
  Zap,
  Droplets,
  Mic,
  FileText,
  Image as ImageIcon,
  ShieldAlert,
  Gauge,
  Clock,
  Sparkles,
  PieChart as PieChartIcon,
  Smile,
  Frown,
  AlertCircle,
  HelpCircle,
  Activity,
  HeartCrack,
  CheckCircle2,
  Scan,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GrievanceHistoryItem, SentimentCategory } from "../types";

interface GrievanceHistorySectionProps {
  history: GrievanceHistoryItem[];
  selectedHistoryId: string | null;
  onSelectHistory: (item: GrievanceHistoryItem) => void;
  onDeleteHistory: (id: string, e: React.MouseEvent) => void;
  onResetHistory: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: "ALL" | "HIGH" | "MEDIUM";
  onPriorityFilterChange: (filter: "ALL" | "HIGH" | "MEDIUM") => void;
  deptFilter: string;
  onDeptFilterChange: (dept: string) => void;
}

export const GrievanceHistorySection: React.FC<GrievanceHistorySectionProps> = ({
  history,
  selectedHistoryId,
  onSelectHistory,
  onDeleteHistory,
  onResetHistory,
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  deptFilter,
  onDeptFilterChange,
}) => {
  const [sentimentFilter, setSentimentFilter] = useState<string>("ALL");

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case "ROADS_BRIDGES":
        return <Construction className="w-4 h-4 text-amber-600" />;
      case "POWER_ELECTRICITY":
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case "WATER_SANITATION":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "PUBLIC_HEALTH":
        return <ShieldAlert className="w-4 h-4 text-emerald-600" />;
      default:
        return <Building2 className="w-4 h-4 text-teal-600" />;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "audio":
        return <Mic className="w-3.5 h-3.5 text-indigo-600" />;
      case "image":
        return <Scan className="w-3.5 h-3.5 text-sky-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  // Filter items
  const filteredHistory = history.filter((item) => {
    const inputSummary = (item.inputSummary || item.input_preview || "").toLowerCase();
    const category = (item.result?.category || item.result?.assigned_department || "").toLowerCase();
    const department = (item.result?.department || item.result?.assigned_department || "").toLowerCase();
    const sTerm = (searchTerm || "").toLowerCase();

    const matchesSearch =
      !sTerm ||
      inputSummary.includes(sTerm) ||
      category.includes(sTerm) ||
      department.includes(sTerm);

    const itemPriority = item.result?.priority || item.result?.priority_level;
    const matchesPriority =
      priorityFilter === "ALL" || itemPriority === priorityFilter;

    const itemDept = item.result?.department || item.result?.assigned_department;
    const matchesDept =
      deptFilter === "ALL" || itemDept === deptFilter;

    const matchesSentiment =
      sentimentFilter === "ALL" ||
      item.result?.sentiment?.category === sentimentFilter ||
      item.result?.sentiment === sentimentFilter;

    return matchesSearch && matchesPriority && matchesDept && matchesSentiment;
  });

  // Calculate Metrics for Pie Chart
  const priorityData = [
    {
      name: "Critical / High",
      value: history.filter((h) => (h.result?.priority === "HIGH" || h.result?.priority_level === "HIGH")).length,
      color: "#ef4444",
    },
    {
      name: "Medium",
      value: history.filter((h) => (h.result?.priority === "MEDIUM" || h.result?.priority_level === "MEDIUM")).length,
      color: "#f59e0b",
    },
    {
      name: "Routine",
      value: history.filter((h) => (h.result?.priority === "ROUTINE" || h.result?.priority_level === "LOW" || h.result?.priority === "LOW")).length,
      color: "#10b981",
    },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 pt-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-700 uppercase tracking-wider">
            <History className="w-4 h-4 text-teal-600" />
            <span>INCIDENT REGISTRY &amp; DISPATCH AUDIT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
            Grievance Ingestion Records ({filteredHistory.length})
          </h2>
        </div>

        <button
          onClick={onResetHistory}
          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3 h-3 text-slate-500" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Analytics Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
            TOTAL LOGGED PETITIONS
          </div>
          <div className="text-2xl font-serif font-black text-slate-900">
            {history.length}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Across 22 Indic scheduled dialects
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-mono text-red-600 font-bold uppercase">
            CRITICAL ESCALATIONS (&lt;15M SLA)
          </div>
          <div className="text-2xl font-serif font-black text-red-700">
            {history.filter((h) => h.result.urgencyScore >= 80).length}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Immediate field engineer dispatch
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-mono text-teal-700 font-bold uppercase">
            AVG TRIAGE CONFIDENCE
          </div>
          <div className="text-2xl font-serif font-black text-teal-900">
            96.8%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Zero-Shot Indic Gemini classifier
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search grievance history by keyword, department, or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none shadow-2xs"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-mono font-bold self-stretch sm:self-auto">
          {(["ALL", "HIGH", "MEDIUM"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPriorityFilterChange(p)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                priorityFilter === p
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

      </div>

      {/* Grievance Record List */}
      <div className="space-y-3">
        {filteredHistory.map((item) => {
          const isSelected = selectedHistoryId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? "bg-teal-50/70 border-teal-300 shadow-sm ring-2 ring-teal-200"
                  : "bg-white border-slate-200 hover:bg-slate-50/80 shadow-2xs"
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {getModeIcon(item.submissionMode || item.submission_type || "text")}
                    <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                      {item.result?.category || item.result?.assigned_department || "Grievance"}
                    </span>
                  </div>

                  <span className="text-slate-300">&bull;</span>

                  <span className="text-[11px] font-mono text-slate-600 font-medium">
                    {item.result?.department || item.result?.assigned_department || "General"}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      (item.result?.priority === "HIGH" || item.result?.priority_level === "HIGH")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.result?.priority || item.result?.priority_level || "ROUTINE"} ({item.result?.urgencyScore ?? item.result?.urgency_score ?? 75}/100)
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans line-clamp-2">
                  {item.inputSummary || item.input_preview || item.result?.extracted_text}
                </p>

                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                  <span>SLA: <strong className="text-slate-700">{item.result?.targetSLA || item.result?.sla_window || "< 2 HR"}</strong></span>
                  <span>&bull;</span>
                  <span>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Recent"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={(e) => onDeleteHistory(item.id, e)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
