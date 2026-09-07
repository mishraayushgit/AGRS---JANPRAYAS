import React, { useState } from "react";
import {
  ShieldCheck,
  Activity,
  Globe2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Radio,
  Cpu,
  Layers,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  X,
  Lock,
  Database,
  Key,
  FileCheck,
  AlertTriangle,
  Server,
  Zap,
  Info,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { NavTab } from "./Header";

interface FooterProps {
  onSelectTab?: (tab: NavTab) => void;
  onSubmitGrievanceClick?: () => void;
}

type ModalType =
  | "dpdp"
  | "sha256"
  | "bhashini"
  | "sla"
  | "airgap"
  | "pcm16k"
  | "version"
  | "department"
  | null;

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSubmitGrievanceClick,
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedDeptInfo, setSelectedDeptInfo] = useState<{
    name: string;
    sla: string;
    officer: string;
    contact: string;
    jurisdiction: string;
  } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabNavigation = (tab: NavTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      scrollToTop();
    }
  };

  const handleModalityClick = (modality: "voice" | "document" | "text") => {
    if (onSubmitGrievanceClick) {
      onSubmitGrievanceClick();
    } else if (onSelectTab) {
      onSelectTab("operations");
    }
  };

  const handleDepartmentClick = (deptName: string, sla: string, officer: string, contact: string, jurisdiction: string) => {
    setSelectedDeptInfo({ name: deptName, sla, officer, contact, jurisdiction });
    setActiveModal("department");
  };

  return (
    <>
      <footer className="mt-auto relative z-10 bg-white border-t border-slate-200/90 pt-12 pb-10 text-slate-600 font-sans">
        
        {/* =========================================================================
            TOP BANNER: 24x7 EMERGENCY REDRESSAL & RAPID RESPONSE STRIP
           ========================================================================= */}
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 mb-12">
          <div className="bg-[#007A99] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-200 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-teal-300 animate-ping" />
                <span>24x7 NATIONAL RAPID GRIEVANCE HOTLINE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Emergency Life-Safety Hazard? Call 1800-11-4000
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 font-sans">
                Instant automated voice ASR triage and dispatch for live 11kV cables, major pipeline ruptures, and biohazards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-sans self-stretch sm:self-auto">
              <a
                href="tel:1800114000"
                className="px-5 py-2.5 rounded-lg bg-white text-[#007A99] font-bold text-xs hover:bg-sky-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Helpline</span>
              </a>
              <button
                type="button"
                onClick={scrollToTop}
                className="px-4 py-2.5 rounded-lg bg-[#005f77] text-white font-bold text-xs hover:bg-[#004f63] transition-colors border border-sky-400/30 cursor-pointer"
              >
                Back to Top ↑
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            MAIN MULTI-COLUMN NAVIGATION LINKS
           ========================================================================= */}
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">
            
            {/* Col 1: Brand & Sovereign Identity */}
            <div className="lg:col-span-2 space-y-4">
              <div
                onClick={() => handleTabNavigation("overview")}
                className="flex flex-col items-start cursor-pointer group inline-block"
                title="Go to Overview"
              >
                <img
                  src="/janprayas-logo.png"
                  alt="Jan Prayas - AGRS"
                  className="h-10 sm:h-11 w-auto object-contain max-w-[210px] group-hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.src = "/jansamadhan-logo.png";
                  }}
                />
                <div className="pl-6 sm:pl-7 -mt-0.5">
                  <span className="text-[10px] font-mono font-black tracking-[0.14em] text-black uppercase select-none block leading-tight">
                    AI GRIEVANCE REDRESSAL SYSTEM
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-sans pr-4">
                Jan Prayas is a high-throughput multimodal intelligence system (AGRS) built to ingest vernacular voice notes, handwritten postcard petitions, and geotagged civic hazard reports into automated municipal dispatch orders.
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => handleTabNavigation("health")}
                  className="flex items-center gap-1.5 text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Cluster Healthy
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => handleTabNavigation("health")}
                  className="text-slate-600 hover:text-[#007A99] transition-colors cursor-pointer"
                >
                  748 Wards Active
                </button>
              </div>
            </div>

            {/* Col 2: Ingestion Modalities */}
            <div className="space-y-3 font-sans text-xs">
              <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider">
                Ingestion Modalities
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => handleModalityClick("voice")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>Telephony Vernacular ASR</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleModalityClick("document")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>Handwritten Postcard OCR (TrOCR)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleModalityClick("document")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>Municipal Circulars (PaddleOCR)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleModalityClick("text")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp &amp; SMS Gateway</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTab) onSelectTab("operations");
                    }}
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>Geotagged Photo Hazard Triage</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Municipal Departments */}
            <div className="space-y-3 font-sans text-xs">
              <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider">
                Municipal Departments
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleDepartmentClick(
                        "Electricity Board (DISCOM / 11kV Grid)",
                        "< 15 Minutes for High-Voltage Life Safety",
                        "Er. R. Sharma (Executive Engineer)",
                        "1912 / 1800-11-4000",
                        "Zone 1 - Substation North, Wards 01-14"
                      )
                    }
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1"
                  >
                    <span>Electricity Board (11kV Grid)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleDepartmentClick(
                        "Municipal Jal Board / Water Supply Dept",
                        "< 2 Hours for Main Pipeline Rupture",
                        "Smt. Sunita Rao (Chief Hydraulic Engineer)",
                        "1916 / 011-23548900",
                        "Central Reservoir & Pumping Network"
                      )
                    }
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1"
                  >
                    <span>Jal Board &amp; Water Supply</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleDepartmentClick(
                        "Public Works Department (PWD Roads & Bridges)",
                        "< 48 Hours for Potholes & Cave-ins",
                        "Er. Anil Verma (Superintending Engineer)",
                        "1800-11-0055",
                        "PWD City Circle, Highway Division"
                      )
                    }
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1"
                  >
                    <span>Public Works (PWD Roads)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleDepartmentClick(
                        "Municipal Solid Waste & Sanitation Dept",
                        "< 4 Hours for Biohazardous / Toxic Waste",
                        "Dr. M. K. Gupta (Sanitation Superintendent)",
                        "155304 (Toll Free)",
                        "Sanitation Zones East & West"
                      )
                    }
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1"
                  >
                    <span>Solid Waste &amp; Sanitation</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      handleDepartmentClick(
                        "Public Health & Vector-Borne Disease Control",
                        "< 6 Hours for Epidemic Vector Hotspots",
                        "Dr. Priya Deshmukh (Chief Medical Officer)",
                        "104 (Health Helpline)",
                        "Primary Health Centers & Ward Clinics"
                      )
                    }
                    className="hover:text-[#007A99] hover:underline cursor-pointer text-left transition-colors flex items-center gap-1"
                  >
                    <span>Public Health &amp; Vector Control</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Statutory & Developer */}
            <div className="space-y-3 font-sans text-xs">
              <h4 className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider">
                Statutory &amp; API
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("dpdp")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer flex items-center gap-1 text-left transition-colors w-full"
                  >
                    <span>DPDP Act 2023 Protocol</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("sha256")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer flex items-center gap-1 text-left transition-colors w-full"
                  >
                    <span>SHA-256 Ledger Audit</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleTabNavigation("documentation")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer flex items-center gap-1 text-left transition-colors w-full"
                  >
                    <span>FastAPI REST Reference</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleTabNavigation("health")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer flex items-center gap-1 text-left transition-colors w-full"
                  >
                    <span>Redis / Celery Queues</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("airgap")}
                    className="hover:text-[#007A99] hover:underline cursor-pointer flex items-center gap-1 text-left transition-colors w-full"
                  >
                    <span>Sovereign Air-Gap Specs</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* =========================================================================
            CIVIC INFRASTRUCTURE SCHEMATIC (Linear Architectural Art)
           ========================================================================= */}
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 mb-8">
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-[#F8FAFC] relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/80 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#007A99]" />
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  CIVIC INFRASTRUCTURE TELEMETRY &bull; AIR-GAPPED DISPATCH NETWORK
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("pcm16k")}
                className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-[#007A99] cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 transition-colors"
              >
                <span>Ingestion Clock:</span>
                <span className="text-[#007A99] font-bold">16 kHz PCM Mono</span>
                <Info className="w-3 h-3 text-[#007A99]" />
              </button>
            </div>

            {/* Architectural Line-Art Civic Schematic */}
            <div className="relative w-full h-14 sm:h-16">
              <svg className="w-full h-full" viewBox="0 0 1000 80" fill="none" preserveAspectRatio="none">
                <line x1="20" y1="70" x2="980" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
                
                {/* Power Grid */}
                <g stroke="#64748b" strokeWidth="1.2" strokeLinecap="round">
                  <line x1="80" y1="70" x2="80" y2="25" />
                  <circle cx="80" cy="25" r="2.5" fill="#ffffff" stroke="#64748b" />
                  <line x1="80" y1="25" x2="60" y2="10" />
                  <line x1="80" y1="25" x2="100" y2="18" />
                  <line x1="160" y1="70" x2="160" y2="35" />
                  <circle cx="160" cy="35" r="2.5" fill="#ffffff" stroke="#64748b" />
                  <line x1="160" y1="35" x2="145" y2="22" />
                  <line x1="160" y1="35" x2="175" y2="28" />
                </g>

                {/* Substation & Transformers */}
                <g stroke="#64748b" strokeWidth="1.2">
                  <rect x="250" y="45" width="45" height="25" fill="#f8fafc" />
                  <line x1="260" y1="45" x2="260" y2="35" />
                  <line x1="280" y1="45" x2="280" y2="35" />
                  <path d="M 315 35 L 325 35 L 320 48 L 330 48 L 315 65" stroke="#d97706" strokeWidth="1.5" fill="none" />
                </g>

                {/* Water Main & Filtration Tower */}
                <g stroke="#0284c7" strokeWidth="1.2">
                  <path d="M 420 70 C 420 40, 435 30, 445 30 L 465 30 C 475 30, 490 40, 490 70" fill="#f0f9ff" />
                  <ellipse cx="455" cy="30" rx="10" ry="2.5" />
                </g>

                {/* Municipal Civil Structure / Roads */}
                <g stroke="#64748b" strokeWidth="1.2">
                  <rect x="570" y="38" width="90" height="32" fill="#f8fafc" />
                  <rect x="585" y="48" width="15" height="22" fill="#ffffff" />
                  <line x1="570" y1="50" x2="660" y2="50" />
                  <path d="M 720 42 L 720 56 M 713 49 L 727 49" stroke="#16a34a" strokeWidth="2" />
                </g>

                {/* Telemetry Wave Signal */}
                <path
                  d="M 780 35 L 830 35 Q 840 35 845 20 Q 850 8 855 35 Q 860 60 865 35 L 960 35"
                  stroke="#007A99"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="960" cy="35" r="3" fill="#007A99" />
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-[10px] text-slate-500 font-mono pt-1 gap-1">
              <button
                type="button"
                onClick={() =>
                  handleDepartmentClick(
                    "Electricity Board (DISCOM / 11kV Grid)",
                    "< 15 Minutes for High-Voltage Life Safety",
                    "Er. R. Sharma (Executive Engineer)",
                    "1912 / 1800-11-4000",
                    "Zone 1 - Substation North, Wards 01-14"
                  )
                }
                className="hover:text-[#007A99] hover:underline cursor-pointer p-1 rounded transition-colors"
              >
                POWER &amp; 11kV UTILITIES
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDepartmentClick(
                    "Electrical Substations & Transformers",
                    "< 30 Minutes for Substation Sparking",
                    "Er. K. S. Tyagi (Grid Incharge)",
                    "011-23214589",
                    "State Grid Transmission Hub"
                  )
                }
                className="hover:text-[#007A99] hover:underline cursor-pointer p-1 rounded transition-colors"
              >
                ELECTRICAL SUBSTATIONS
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDepartmentClick(
                    "Municipal Jal Board & Water Supply",
                    "< 2 Hours for Main Pipeline Rupture",
                    "Smt. Sunita Rao (Chief Hydraulic Engineer)",
                    "1916 / 011-23548900",
                    "Central Reservoir & Pumping Network"
                  )
                }
                className="hover:text-[#007A99] hover:underline cursor-pointer p-1 rounded transition-colors"
              >
                JAL BOARD &amp; WATER SUPPLY
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDepartmentClick(
                    "Municipal PWD Roads & Public Health",
                    "< 4 Hours for Biohazardous Waste",
                    "Dr. M. K. Gupta & Er. Anil Verma",
                    "155304 / 1800-11-0055",
                    "Civic Engineering Works"
                  )
                }
                className="hover:text-[#007A99] hover:underline cursor-pointer p-1 rounded transition-colors"
              >
                MUNICIPAL PWD &amp; HEALTH
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            BOTTOM LEGAL & SOVEREIGN FOOTER ROW
           ========================================================================= */}
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveModal("bhashini")}
              className="font-semibold text-slate-800 hover:text-[#007A99] hover:underline cursor-pointer transition-colors"
            >
              &copy; 2026 Jan Prayas (AGRS) &bull; Mission Bhashini
            </button>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <button
              type="button"
              onClick={() => setActiveModal("airgap")}
              className="hover:text-[#007A99] hover:underline cursor-pointer transition-colors"
            >
              Zero Data Egress Sovereign Architecture
            </button>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <button
              type="button"
              onClick={() => setActiveModal("dpdp")}
              className="hover:text-[#007A99] hover:underline cursor-pointer transition-colors"
            >
              DPDP Act 2023 Compliant
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveModal("sla")}
              className="text-[#007A99] font-bold hover:underline cursor-pointer transition-colors"
            >
              &lt; 15 min Emergency SLA
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("version")}
              className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
            >
              v3.6.4-prod
            </button>
          </div>

        </div>

      </footer>

      {/* =========================================================================
          INTERACTIVE FOOTER MODALS FOR STATUTORY & SECURITY LINKS
         ========================================================================= */}

      {/* 1. DPDP Act 2023 Compliance Modal */}
      {activeModal === "dpdp" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Digital Personal Data Protection (DPDP) Act 2023</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <p>
                Jan Prayas (Automated Grievance Redressal System) operates under strict compliance with the <strong>DPDP Act 2023</strong> statutory framework for sovereign citizen data processing:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Lock className="w-3.5 h-3.5 text-teal-700" />
                  <span>Key Statutory Safeguards:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Purpose Limitation:</strong> Voice and text petitions are strictly used for municipal dispatch.</li>
                  <li><strong>Data Minimization:</strong> Automatic PII masking of Aadhaar/PAN before nodal officer review.</li>
                  <li><strong>Zero Cross-Border Egress:</strong> 100% on-premises Indian sovereign data residency.</li>
                  <li><strong>Citizen Consent &amp; Audit Trail:</strong> Immutable cryptographic hash for every redressal lifecycle event.</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-500">
                Data Protection Officer (DPO): <code>dpo@janprayas.gov.in</code> &bull; Ministry of Electronics and Information Technology (MeitY).
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE PROTOCOL VIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SHA-256 Cryptographic Ledger Audit Modal */}
      {activeModal === "sha256" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Key className="w-5 h-5 text-indigo-600" />
                <span>SHA-256 Immutable Grievance Ledger Audit</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <p>
                Every grievance ingested via Telephony ASR, OCR, or WhatsApp generates a cryptographic SHA-256 fingerprint verified by the Municipal Comptroller:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2">
                <div className="text-teal-400 font-bold">Latest Genesis Block Hash:</div>
                <div className="text-slate-400 break-all text-[10px] bg-slate-950 p-2 rounded border border-slate-800">
                  9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
                </div>
                <div className="flex items-center justify-between text-slate-300 pt-1 text-[10px]">
                  <span>Merkle Tree Depth: 18</span>
                  <span className="text-emerald-400">✓ 100% Chain Veracity Verified</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Audited continuously across 748 Ward Nodes &bull; Zero tampering or backdating possible.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE AUDIT INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Mission Bhashini National AI Modal */}
      {activeModal === "bhashini" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Globe2 className="w-5 h-5 text-[#007A99]" />
                <span>Mission Bhashini &bull; National AI Language Platform</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <p>
                Jan Prayas is powered by <strong>Mission Bhashini (National Language Translation Mission)</strong>, enabling seamless citizen grievance redressal across 22 constitutional Indian languages and regional dialects.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px]">ASR ENGINE:</div>
                  <div className="font-bold text-slate-900">WhisperX-Indic (16kHz)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px]">TRANSLATION:</div>
                  <div className="font-bold text-slate-900">IndicTrans2 (IIT Madras)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px]">OCR ENGINE:</div>
                  <div className="font-bold text-slate-900">TrOCR Indic + PaddleOCR</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 text-[10px]">TTS SYNTHESIS:</div>
                  <div className="font-bold text-slate-900">Indic-TTS Sovereign Wave</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE MISSION OVERVIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SLA Escalation Matrix Modal */}
      {activeModal === "sla" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Clock className="w-5 h-5 text-rose-600" />
                <span>Life-Safety SLA &amp; Automatic Escalation Matrix</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between">
                  <div>
                    <div className="font-bold">TIER 1 &bull; LIFE SAFETY EMERGENCY</div>
                    <div className="text-[10px] text-rose-700">11kV Wire Snaps, Gas Leaks, Chlorine Ruptures</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-xs">
                    &lt; 15 MIN
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
                  <div>
                    <div className="font-bold">TIER 2 &bull; PUBLIC UTILITY FAILURE</div>
                    <div className="text-[10px] text-amber-700">Main Water Pipeline Burst, Biohazard Waste Dump</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-600 text-white font-bold text-xs">
                    &lt; 2 HOURS
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold">TIER 3 &bull; MUNICIPAL CIVIL REPAIRS</div>
                    <div className="text-[10px] text-slate-500">Potholes, Non-functional Streetlights, Garbage</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold text-xs">
                    &lt; 48 HOURS
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Breach of SLA triggers direct automated escalation SMS &amp; alert to District Magistrate / Municipal Commissioner.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE SLA MATRIX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Sovereign Air-Gap Hardware Architecture Modal */}
      {activeModal === "airgap" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Server className="w-5 h-5 text-teal-700" />
                <span>Zero Data Egress Sovereign Air-Gap Infrastructure</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <p>
                Jan Prayas features an air-gapped inference runtime running on dedicated on-premise GPU clusters located inside National Data Centers (NIC / MeitY).
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">Hardware Specification:</div>
                <div className="text-slate-700">• 8x NVIDIA H100 80GB SXM5 Sovereign AI Nodes</div>
                <div className="text-slate-700">• 100% Isolated Intranet &bull; No Public Internet Outbound Calls</div>
                <div className="text-slate-700">• Local Weight Sharding: IndicTrans2, WhisperX, TrOCR, PaddleOCR</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE SPECIFICATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 16 kHz Audio Ingestion Specification Modal */}
      {activeModal === "pcm16k" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Radio className="w-5 h-5 text-[#007A99]" />
                <span>16 kHz PCM Mono Telephony Ingestion Clock</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <p>
                Citizen IVR lines and microphone streams are sampled at <strong>16,000 Hz, 16-bit Linear PCM (Mono)</strong>, ensuring optimum acoustic clarity for Indic regional dialects, low network jitter, and sub-100ms Whisper CTC phonetic alignment.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px] text-slate-700">
                <div>• Codec: G.711 / AMR-WB / Opus &rarr; 16kHz PCM</div>
                <div>• Noise Filter: Spectral Subtraction + DeepFilterNet3</div>
                <div>• Dynamic Range Compression: -18 dBFS Target RMS</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE AUDIO CLOCK SPEC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Production Version & Release Changelog Modal */}
      {activeModal === "version" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <FileCheck className="w-5 h-5 text-teal-700" />
                <span>Production Release &bull; v3.6.4-prod</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">What's New in v3.6.4:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Added real-time Acoustic Telemetry charts (Recharts SNR &amp; Intelligibility).</li>
                  <li>Enhanced full-bleed cinematic hero carousel with civic infrastructure imagery.</li>
                  <li>Multi-lingual TrOCR Devanagari handwritten postcard extraction.</li>
                  <li>Dynamic GPS leaflet mapping with ward auto-clustering.</li>
                </ul>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Build ID: <code>prod-2026-bhashini-rel-3.6.4</code> &bull; All 748 Ward nodes synced.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE CHANGELOG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Department Information & Nodal Officer Modal */}
      {activeModal === "department" && selectedDeptInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Layers className="w-5 h-5 text-[#007A99]" />
                <span>{selectedDeptInfo.name}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setSelectedDeptInfo(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-sans leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">MUNICIPAL SLA WINDOW:</span>
                  <span className="font-bold text-rose-700 text-xs">{selectedDeptInfo.sla}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">NODAL EXECUTIVE OFFICER:</span>
                  <span className="font-bold text-slate-900">{selectedDeptInfo.officer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CONTROL ROOM / HELPLINE:</span>
                  <span className="font-bold text-teal-800">{selectedDeptInfo.contact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TERRITORIAL JURISDICTION:</span>
                  <span className="font-medium text-slate-700">{selectedDeptInfo.jurisdiction}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  handleTabNavigation("operations");
                }}
                className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#007A99] font-mono font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>OPEN DISPATCH QUEUE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setSelectedDeptInfo(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637d] text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
