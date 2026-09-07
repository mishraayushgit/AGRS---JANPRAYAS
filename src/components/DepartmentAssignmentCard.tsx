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
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden font-sans transition-all">
      
      {/* Top Banner with Vibrant Department Identity */}
      <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        
        {/* Subtle Background Lighting Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Department Icon & Title */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-md">
              <IconComponent className="w-7 h-7 text-teal-300" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400">
                  ASSIGNED PUBLIC DEPARTMENT
                </span>
                <span className="text-white/40 font-mono text-xs">&bull;</span>
                <span className="text-xs font-mono text-slate-300">
                  {config.zone}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{config.title}</span>
              </h2>

              <p className="text-xs text-slate-300 font-sans flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>
                  Incident Jurisdiction: <strong>{grievance.location}</strong> ({grievance.ward || "Ward 04"})
                </span>
              </p>
            </div>
          </div>

          {/* Right: Urgent SLA Clock & Assignment Badges */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs ${
                  isResolved
                    ? "bg-emerald-500 text-white"
                    : isDispatched
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-amber-500 text-slate-950"
                }`}
              >
                {isResolved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>STATUS: RESOLVED</span>
                  </>
                ) : isDispatched ? (
                  <>
                    <Send className="w-3.5 h-3.5 animate-bounce" />
                    <span>RAPID SQUAD ON FIELD</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>STATUS: ROUTED TO DEPT</span>
                  </>
                )}
              </span>

              {/* Priority Tier */}
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold">
                {grievance.urgency_tier === "TIER_1_CRITICAL"
                  ? "P1 • CRITICAL EMERGENCY"
                  : grievance.urgency_tier === "TIER_2_HIGH"
                  ? "P2 • HIGH URGENCY"
                  : "P3 • ROUTINE ACTION"}
              </span>
            </div>

            {/* SLA Target Window */}
            <div className="text-right font-mono text-xs text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Target Resolution SLA:</span>
              <strong className="text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800/80">
                {grievance.sla_window}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* Body: Key Operational Details & Rapid Action Controls */}
      <div className="p-6 sm:p-7 space-y-6">
        
        {/* Row 1: Essential Municipal Officer & Field Squad Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Designated Nodal Authority */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                DESIGNATED NODAL OFFICER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[9px] font-mono font-bold border border-teal-200">
                ON CALL
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{config.nodalOfficer}</div>
              <div className="text-xs text-slate-600 font-sans mt-0.5 leading-snug">{config.designation}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(config.contactNumber);
                setCopiedPhone(true);
                setTimeout(() => setCopiedPhone(false), 2000);
              }}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{copiedPhone ? "COPIED TO CLIPBOARD!" : config.contactNumber}</span>
            </button>
          </div>

          {/* Assigned Action Squad */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                ACTIVE FIELD UNIT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[9px] font-mono font-bold">
                JURISDICTION READY
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{config.fieldSquad}</div>
              <div className="text-xs text-slate-600 font-sans mt-0.5">
                Equipped with emergency equipment, direct GPS telemetry &amp; dispatch radio
              </div>
            </div>
          </div>

          {/* Citizen Problem Rationale */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                TACTICAL PRIORITY REASON
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[9px] font-mono font-bold border border-rose-200">
                SCORE: {grievance.urgency_score}/100
              </span>
            </div>
            <p className="text-xs text-slate-800 font-sans leading-relaxed">
              {grievance.safety_justification || "Severe public hazard requiring prompt municipal containment."}
            </p>
          </div>

        </div>

        {/* Row 2: Action Dispatch Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEPARTMENT DIRECT ACTION DISPATCH</span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              {isResolved
                ? "This complaint has been inspected and marked fully resolved by the department."
                : isDispatched
                ? "Field team is en-route to the site. Officer will submit geo-tagged resolution photo upon completion."
                : "Authorize instant notification and dispatch message to the on-call field engineering squad."}
            </p>
          </div>

          {/* Action Button Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            
            {/* Reassign Dept Dropdown */}
            {onReassignDepartment && !isResolved && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowReassignMenu(!showReassignMenu)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>RE-ROUTE DEPT</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showReassignMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-64 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl p-2 z-50 space-y-1 font-mono text-xs">
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
                        <span>{d}</span>
                        {d === grievance.assigned_department && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
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
                    className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>DISPATCH FIELD SQUAD NOW</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onResolve}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK CASE RESOLVED</span>
                  </button>
                )}
              </>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>CASE CLOSED &amp; AUDITED</span>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
