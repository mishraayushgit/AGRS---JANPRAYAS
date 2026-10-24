import React, { useState } from "react";
import {
  Building2,
  Droplets,
  Zap,
  Trash2,
  Hammer,
  ShieldAlert,
  Send,
  CheckCircle2,
  PhoneCall,
  Clock,
  MapPin,
  UserCheck,
  ChevronDown,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Check,
  Copy,
} from "lucide-react";
import { GrievanceRecord, DepartmentType } from "../types";

interface DepartmentAssignmentCardProps {
  grievance: GrievanceRecord;
  onDispatch: () => void;
  onResolve: () => void;
  onReassignDepartment?: (newDept: DepartmentType) => void;
}

export const DepartmentAssignmentCard: React.FC<DepartmentAssignmentCardProps> = ({
  grievance,
  onDispatch,
  onResolve,
  onReassignDepartment,
}) => {
  const [showReassignMenu, setShowReassignMenu] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);

  // Department Styling Configuration & Metadata
  const getDeptConfig = (dept: DepartmentType) => {
    switch (dept) {
      case "Water Resources":
        return {
          title: "Department of Water Resources & Irrigation",
          shortName: "Water Resources",
          nodalOfficer: "Er. Sanjay K. Verma",
          designation: "Executive Engineer (Hydraulic & Potable Supply)",
          contactNumber: "+91 94140 28192",
          fieldSquad: "Hydraulic Rapid Repair Unit-04",
          icon: Droplets,
          badgeColor: "bg-sky-700 text-white",
          lightBg: "bg-sky-50/80 border-sky-200 text-sky-950",
          accentColor: "text-sky-700",
          slaColor: "bg-sky-100 text-sky-900 border-sky-300",
          actionColor: "bg-sky-700 hover:bg-sky-800",
          zone: "Zone 4 (Canal & Ground Water Division)",
        };
      case "Power & Electricity":
        return {
          title: "State Electricity Distribution & Grid Board",
          shortName: "Power & Electricity",
          nodalOfficer: "Er. Rameshwar Meena",
          designation: "Sub-Divisional Officer (11kV Grid Operations)",
          contactNumber: "+91 94140 77312",
          fieldSquad: "High-Voltage Emergency Squad E-12",
          icon: Zap,
          badgeColor: "bg-amber-600 text-white",
          lightBg: "bg-amber-50/80 border-amber-200 text-amber-950",
          accentColor: "text-amber-700",
          slaColor: "bg-amber-100 text-amber-900 border-amber-300",
          actionColor: "bg-amber-600 hover:bg-amber-700",
          zone: "Zone 2 (High-Tension Transmission & Distribution)",
        };
      case "Public Health & Sanitation":
        return {
          title: "Public Health, Municipal Sanitation & Waste Mgmt",
          shortName: "Public Health & Sanitation",
          nodalOfficer: "Dr. Ananya Sengupta",
          designation: "Chief Medical & Sanitary Inspector",
          contactNumber: "+91 98290 41556",
          fieldSquad: "Biohazard & Sanitation Hazmat Squad S-08",
          icon: ShieldAlert,
          badgeColor: "bg-emerald-700 text-white",
          lightBg: "bg-emerald-50/80 border-emerald-200 text-emerald-950",
          accentColor: "text-emerald-700",
          slaColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
          actionColor: "bg-emerald-700 hover:bg-emerald-800",
          zone: "Zone 1 (Municipal Public Health & Disease Control)",
        };
      case "Roads & Infrastructure":
      default:
        return {
          title: "Public Works & Urban Roads Infrastructure Dept",
          shortName: "Roads & Infrastructure",
          nodalOfficer: "Er. Digvijay Singh",
          designation: "Assistant Engineer (Civil Bridges & Highway Safety)",
          contactNumber: "+91 97841 83204",
          fieldSquad: "Road Reconstruction & Asphalt Unit R-03",
          icon: Hammer,
          badgeColor: "bg-indigo-700 text-white",
          lightBg: "bg-indigo-50/80 border-indigo-200 text-indigo-950",
          accentColor: "text-indigo-700",
          slaColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
          actionColor: "bg-indigo-700 hover:bg-indigo-800",
          zone: "Zone 3 (Urban Highway & Heavy Pavement Division)",
        };
    }
  };

  const config = getDeptConfig(grievance.assigned_department);
  const IconComponent = config.icon;

  const isDispatched = grievance.status === "DISPATCHED";
  const isResolved = grievance.status === "RESOLVED";

  const allDepts: DepartmentType[] = [
    "Water Resources",
    "Power & Electricity",
    "Public Health & Sanitation",
    "Roads & Infrastructure",
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden font-sans transition-all">
      {/* Top Banner with Vibrant Department Identity */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle Background Lighting Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 space-y-4">
          {/* Header Row: Department Icon & Titles */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
              <IconComponent className="w-6 h-6 text-teal-300" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                <span>ASSIGNED PUBLIC DEPARTMENT</span>
                <span className="text-white/30">&bull;</span>
                <span className="text-slate-300 truncate max-w-full">{config.zone}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug break-words">
                {config.title}
              </h2>

              <p className="text-[11px] text-slate-300 font-sans flex items-center gap-1.5 pt-0.5 break-words">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="line-clamp-2">
                  Jurisdiction: <strong className="text-white">{grievance.location}</strong> ({grievance.ward || "Ward 04"})
                </span>
              </p>
            </div>
          </div>

          {/* Status & SLA Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wide flex items-center gap-1.5 shadow-xs ${
                isResolved
                  ? "bg-emerald-500 text-white"
                  : isDispatched
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-amber-500 text-slate-950"
              }`}
            >
              {isResolved ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>STATUS: RESOLVED</span>
                </>
              ) : isDispatched ? (
                <>
                  <Send className="w-3 h-3 animate-bounce" />
                  <span>RAPID SQUAD ON FIELD</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  <span>STATUS: ROUTED TO DEPT</span>
                </>
              )}
            </span>

            {/* Priority Tier */}
            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold">
              {grievance.urgency_tier === "TIER_1_CRITICAL"
                ? "P1 • CRITICAL"
                : grievance.urgency_tier === "TIER_2_HIGH"
                ? "P2 • HIGH URGENCY"
                : "P3 • ROUTINE"}
            </span>

            {/* Target SLA */}
            <div className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>SLA:</span>
              <strong className="text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800/80">
                {grievance.sla_window}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Body: Key Operational Cards & Rapid Action Controls */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Stash of 3 Cards - Stacking cleanly so badges and texts NEVER overlap */}
        <div className="space-y-3">
          {/* Card 1: Designated Nodal Authority */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>DESIGNATED NODAL OFFICER</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[9px] font-mono font-bold border border-teal-200 shrink-0">
                ON CALL
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-900">{config.nodalOfficer}</div>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5 leading-snug">{config.designation}</div>
            </div>

            <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(config.contactNumber);
                  setCopiedPhone(true);
                  setTimeout(() => setCopiedPhone(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
                title="Click to copy contact number"
              >
                <PhoneCall className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{config.contactNumber}</span>
              </button>
              {copiedPhone && (
                <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied!
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Assigned Action Squad */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>ACTIVE FIELD UNIT</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[9px] font-mono font-bold shrink-0">
                JURISDICTION READY
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-900">{config.fieldSquad}</div>
              <div className="text-[11px] text-slate-600 font-sans mt-0.5 leading-relaxed">
                Equipped with emergency equipment, direct GPS telemetry &amp; dispatch radio.
              </div>
            </div>
          </div>

          {/* Card 3: Citizen Problem Rationale */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>TACTICAL PRIORITY REASON</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[9px] font-mono font-bold border border-rose-200 shrink-0">
                SCORE: {grievance.urgency_score}/100
              </span>
            </div>

            <p className="text-[11px] text-slate-800 font-sans leading-relaxed">
              {grievance.safety_justification || "Severe public hazard requiring prompt municipal containment."}
            </p>
          </div>
        </div>

        {/* Bottom Dispatch & Re-Route Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>DEPARTMENT DIRECT ACTION DISPATCH</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isResolved
                ? "This complaint has been inspected and marked fully resolved by the department."
                : isDispatched
                ? "Field squad is en-route. Officer will submit geo-tagged resolution photo upon completion."
                : "Authorize instant notification and dispatch message to the on-call field engineering squad."}
            </p>
          </div>

          {/* Action Button Controls - Full width stacked for clean, un-truncated layout */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Reassign Dept Dropdown */}
            {onReassignDepartment && !isResolved && (
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setShowReassignMenu(!showReassignMenu)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>RE-ROUTE DEPT</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showReassignMenu && (
                  <div className="absolute left-0 bottom-full mb-2 w-full min-w-[240px] rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl p-2 z-50 space-y-1 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 px-2 py-1 uppercase font-bold">
                      Re-assign to Public Department:
                    </div>
                    {allDepts.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          onReassignDepartment(d);
                          setShowReassignMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between cursor-pointer ${
                          d === grievance.assigned_department
                            ? "bg-teal-50 text-teal-900 font-bold"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="truncate">{d}</span>
                        {d === grievance.assigned_department && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Primary Dispatch / Resolve Buttons */}
            {!isResolved ? (
              <>
                {!isDispatched ? (
                  <button
                    type="button"
                    onClick={onDispatch}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span>DISPATCH FIELD SQUAD</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onResolve}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>MARK RESOLVED</span>
                  </button>
                )}
              </>
            ) : (
              <div className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CASE CLOSED &amp; AUDITED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};