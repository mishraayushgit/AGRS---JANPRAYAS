import React from "react";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Mic,
  FileText,
  Scan,
  Type,
  Building2,
  Clock,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  Radio,
  FileCode2,
  Compass,
  Lock,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Flame,
  Droplets,
  Layers,
} from "lucide-react";
import { useGrievance } from "../store/GrievanceContext";
import { CinematicIndianHero } from "../components/CinematicIndianHero";
import { ModalityCard, MODALITY_DATA } from "../components/ModalityCard";
import { MultimodalPipelineDiagram } from "../components/MultimodalPipelineDiagram";
import {
  ProcessFlowDiagram,
  UrgencyScaleDiagram,
  DepartmentRoutingDiagram,
} from "../components/CivicDiagrams";

interface OverviewPageProps {
  onNavigateToOperations: () => void;
  onNavigateToDocs: () => void;
  onNavigateToSectors?: () => void;
  onRequestSubmitGrievance: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToOperations,
  onNavigateToDocs,
  onNavigateToSectors,
  onRequestSubmitGrievance,
}) => {
  const {
    grievances,
    todayGrievancesCount,
    criticalCasesCount,
    inProcessCount,
    slaComplianceRate,
    resolvedTodayCount,
    setActiveGrievance,
    requestModalityIntake,
  } = useGrievance();

  const criticalGrievances = grievances
    .filter((g) => g.urgency_score >= 85 && g.status !== "RESOLVED")
    .slice(0, 3);

  const handleOpenCase = (grievance: any) => {
    setActiveGrievance(grievance);
    onNavigateToOperations();
  };

  const handleOpenModality = (modality: "voice" | "handwritten" | "document" | "text") => {
    requestModalityIntake(modality);
    onNavigateToOperations();
  };

  const scrollToPipeline = () => {
    document.getElementById("interactive-pipeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">
      
      {/* =========================================================================
          HERO SECTION (Full Viewport Screen-Fit Background Cinematic Carousel)
         ========================================================================= */}
      <CinematicIndianHero
        onRequestSubmitGrievance={onRequestSubmitGrievance}
        onNavigateToOperations={onNavigateToOperations}
      />

      {/* =========================================================================
          "OUR SERVICES / CORE MODALITIES" (Expanded Width & Fully Clickable Interactive Cards)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Section Header with "View All Services" Button on Top Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-2 max-w-4xl">
            <div className="text-xs font-mono font-bold text-[#007A99] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MULTIMODAL CIVIC INGESTION CHANNELS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-slate-900 tracking-tight">
              Our Core Modalities
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
              We deploy an array of sovereign AI extraction pipelines to support citizens across urban and rural India. Whether a grievance arrives as a vernacular voice call, a handwritten postcard petition, or a municipal circular, our platform triages every signal with speed and transparency. Click any modality to launch the live intake pipeline.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToOperations}
            className="px-5 py-2.5 rounded-lg bg-[#007A99] hover:bg-[#00657e] text-white font-sans font-bold text-xs tracking-wider shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap self-start md:self-auto flex items-center gap-2"
          >
            <span>View All Modalities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Featured Modality Cards with Interactive Hover State (Revealing Architectural Tech Stack) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODALITY_DATA.map((item) => (
            <ModalityCard
              key={item.id}
              item={item}
              onSelect={handleOpenModality}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE PROCESSING PIPELINE COMPONENT (SVG-Based Workflow with Transitions)
         ========================================================================= */}
      <section id="interactive-pipeline" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 scroll-mt-24">
        <MultimodalPipelineDiagram />
      </section>

      {/* =========================================================================
          LIVE OPERATIONAL TRIAGE STREAM (Recent Cases & Critical Dispatch)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>FIELD RAPID RESPONSE STREAM</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              Active Critical Redressals
            </h3>
          </div>

          <button
            type="button"
            onClick={onNavigateToOperations}
            className="text-xs font-mono font-bold text-[#007A99] hover:text-[#005a72] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>OPEN DISPATCH CONSOLE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {criticalGrievances.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenCase(c)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-900">
                  {c.reference_id || c.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono font-bold">
                  {c.urgency_score}/100 TIER-1
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 font-sans">
                  {c.assigned_department}
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-1 line-clamp-2">
                  {c.extracted_text || c.title}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>{c.ward || c.location}</span>
                <span className="text-rose-600 font-bold">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          NATIONAL CITIZEN CHARTER & STATUTORY SLA BENCHMARKS (Expanded Content)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-mono font-bold text-[#007A99] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>STATUTORY SERVICE LEVEL AGREEMENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-slate-900 tracking-tight">
              National Citizen Redressal Charter
            </h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Every complaint ingested by Jan Prayas AI is legally mapped to guaranteed departmental resolution windows under the Right to Public Services Act. Automated escalation alerts are issued to Divisional Commissioners if any SLA is breached.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={onNavigateToSectors || onNavigateToDocs}
              className="px-4 py-2 rounded-xl bg-[#007A99] hover:bg-[#00637c] text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Explore 6 Departmental Pillars &rarr;
            </button>
            <button
              type="button"
              onClick={onNavigateToDocs}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Gazette SLA Rules
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Item 1: Power Emergency */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-mono text-[11px] font-bold border border-rose-200">
                DISCOM Power
              </span>
              <span className="font-mono text-xs font-bold text-rose-600">&lt; 15 Minutes</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sans">
              Live Wire &amp; Transformer Sparks
            </h4>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Life-safety hazards trigger instant feeder shutdown and simultaneous GPS dispatch to the nearest zonal electrical lineman team.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Escalation: Superintending Engineer</span>
              <span className="text-emerald-600 font-bold">99.1% Met</span>
            </div>
          </div>

          {/* Item 2: Jal Nigam Outages */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-mono text-[11px] font-bold border border-teal-200">
                Jal Nigam Board
              </span>
              <span className="font-mono text-xs font-bold text-teal-700">&lt; 12 Hours</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sans">
              Main Pipeline Burst &amp; Contamination
            </h4>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Flow meter anomalies and water color reports initiate valve isolation and immediate deployment of potable water tankers to ward stands.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Escalation: Executive Engineer (Jal)</span>
              <span className="text-emerald-600 font-bold">97.4% Met</span>
            </div>
          </div>

          {/* Item 3: Municipal Solid Waste */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
                Solid Waste (SWM)
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">&lt; 24 Hours</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sans">
              Garbage Dumpster &amp; Drain Clog
            </h4>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Sanitation truck routes are dynamically updated using computer-vision geo-tags. Cleanups require verified geotagged after-photos.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Escalation: Chief Health Officer</span>
              <span className="text-emerald-600 font-bold">98.2% Met</span>
            </div>
          </div>

          {/* Item 4: PWD Potholes */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-[11px] font-bold border border-blue-200">
                PWD Roads
              </span>
              <span className="font-mono text-xs font-bold text-blue-700">&lt; 48 Hours</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sans">
              Arterial Road Potholes &amp; Sinkholes
            </h4>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Automated contractor defect notification. Road maintenance grants are held in escrow until road patch verification is accepted.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Escalation: Zonal Chief Engineer</span>
              <span className="text-emerald-600 font-bold">95.8% Met</span>
            </div>
          </div>

          {/* Item 5: Education Infrastructure */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-mono text-[11px] font-bold border border-purple-200">
                Education Dept
              </span>
              <span className="font-mono text-xs font-bold text-purple-700">&lt; 72 Hours</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sans">
              School Drinking Water &amp; Sanitation
            </h4>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Direct emergency fund release for school toilet repairs, RO filter replacements, and dangerous ceiling plaster plastering.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Escalation: District Magistrate (DM)</span>
              <span className="text-emerald-600 font-bold">96.3% Met</span>
            </div>
          </div>

          {/* Item 6: Public Transit */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 font-mono text-[11px] font-bold border border-cyan-200">
                RTO &amp; City Bus
              </span>
              <span className="font-mono text-xs font-bold text-cyan-700">&lt; 36 Hours</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sans">
              Bus Frequency &amp; Shelter Safety
            </h4>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Fleet telematics reroutes spare electric buses to high-congestion corridors and schedules immediate streetlight repairs at rural stops.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Escalation: Managing Director (Transit)</span>
              <span className="text-emerald-600 font-bold">94.6% Met</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATUTORY & CIVIC TRUST ASSURANCE (DPDP Act 2023 & Zero Data Egress)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>SOVEREIGN ARCHITECTURAL GUARANTEE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Zero Data Egress &bull; DPDP Act 2023 Compliant
              </h3>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                All citizen biometric speech recordings, handwritten letters, and municipal identity tokens are processed strictly inside air-gapped sovereign compute environments. PII is redacted at the edge, and every dispatch is recorded on an immutable SHA-256 audit ledger.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={onNavigateToDocs}
                className="px-5 py-3 rounded-xl bg-[#007A99] hover:bg-[#00637c] text-white font-bold transition-colors cursor-pointer text-center"
              >
                Read DPDP Technical Blueprint
              </button>
              <button
                type="button"
                onClick={onNavigateToOperations}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-colors cursor-pointer text-center"
              >
                Inspect Ledger Audit Trail
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
