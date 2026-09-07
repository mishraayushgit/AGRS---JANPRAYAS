import React, { useState } from "react";
import {
  Building2,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  FileText,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useGrievance } from "../store/GrievanceContext";

export interface SectorDetail {
  id: string;
  slideNumber: string;
  category: string;
  department: string;
  ministry: string;
  headline: string;
  description: string;
  imageSrc: string;
  altText: string;
  slaTarget: string;
  complianceRate: string;
  activeWards: string;
  monthlyResolutions: string;
  aiPipeline: {
    name: string;
    model: string;
    description: string;
  };
  keyProvisions: string[];
  escalationMatrix: {
    level1: string;
    level2: string;
    level3: string;
  };
  sampleCase: {
    issue: string;
    location: string;
    resolutionTime: string;
    status: string;
  };
}

export const SECTOR_DETAILS: SectorDetail[] = [
  {
    id: "roads-highways",
    slideNumber: "01",
    category: "Roads & Highways",
    department: "Public Works Department (PWD) / NHAI",
    ministry: "Ministry of Road Transport & Highways",
    headline: "Rapid Pothole Resolution & Resilient Asphalt Corridors",
    description:
      "Citizen-reported road cratering, sinkholes, missing manhole lids, and arterial asphalt wear are ingested via geotagged phone images and dashcam feeds. Computer Vision models classify defect depth and trigger automatic contractor defect-liability notices.",
    imageSrc: "/road.jpeg",
    altText: "Indian Road and Highway Infrastructure Maintenance",
    slaTarget: "< 48 Hours",
    complianceRate: "95.8%",
    activeWards: "248 Municipal Wards",
    monthlyResolutions: "4,280+",
    aiPipeline: {
      name: "YOLOv8-RoadDefect + Geo-Spatial Cluster",
      model: "Spatial Point Cloud & Pothole Volumetric Estimator",
      description:
        "Estimates road crater diameter and depth in millimeters from 2D photos, auto-clusters nearby complaints on the same arterial chainage, and holds contractor escrow payments pending verified patching.",
    },
    keyProvisions: [
      "Sub-48 hour statutory asphalt patch guarantee on Major District Roads (MDR).",
      "Immediate bar-coding and GPS geofence locking for municipal road rollers.",
      "Contractor defect-liability period warranty tracking with automatic penalty notices.",
      "Automated integration with PM Gati Shakti GIS spatial layers.",
    ],
    escalationMatrix: {
      level1: "Assistant Engineer (Sub-Divisional PWD)",
      level2: "Executive Engineer (District Works)",
      level3: "Chief Engineer & Zonal Highway Commissioner",
    },
    sampleCase: {
      issue: "1.4m Deep Crater on Outer Ring Road Flyover Approach",
      location: "Ward 42, Sector 9 Junction, South Corridor",
      resolutionTime: "18.4 Hours (Cold-Mix Patch Completed)",
      status: "Resolved & Citizen Verified",
    },
  },
  {
    id: "sanitation-waste",
    slideNumber: "02",
    category: "Sanitation & Waste",
    department: "Municipal Corporation Solid Waste Dept",
    ministry: "Ministry of Housing & Urban Affairs",
    headline: "Zero Open-Dumping & High-Velocity Sanitation Squads",
    description:
      "AI-verified sanitation complaints detect overflowing community dumpsters, hazardous bio-waste dumping, and open drain blockages to orchestrate immediate sanitary squad dispatches with mandatory before/after photo verification.",
    imageSrc: "/sanitation.jpeg",
    altText: "Municipal Sanitation and Waste Clearance Operations",
    slaTarget: "< 24 Hours",
    complianceRate: "98.2%",
    activeWards: "312 Sanitary Circles",
    monthlyResolutions: "6,940+",
    aiPipeline: {
      name: "WasteVision-SegNet + Route Optimizer",
      model: "Multimodal Biohazard & Volume Estimator",
      description:
        "Differentiates organic waste from construction debris (C&D) and toxic runoff. Dynamically reroutes nearest hydraulic compactor trucks with turn-by-turn navigation.",
    },
    keyProvisions: [
      "Sub-24 hour mandatory clearing of community secondary dumpsters (Dhalaos).",
      "Mandatory dual-photo geostamp (before cleaning vs. sanitized spot) uploaded by sanitary inspector.",
      "Real-time telematics linkage with Swachh Bharat Urban MIS portal.",
      "Automated SMS dispatch to ward citizen committees upon dumpster evacuation.",
    ],
    escalationMatrix: {
      level1: "Sanitary Inspector / Ward Ward Officer",
      level2: "Zonal Health Officer (ZHO)",
      level3: "Municipal Commissioner & District Magistrate",
    },
    sampleCase: {
      issue: "Overflowing Market Garbage Dumpster Blocking Storm Drain",
      location: "Sanitary Circle 18, Central Mandi Ward",
      resolutionTime: "4.2 Hours (Compactor Truck Dispatched)",
      status: "Resolved & Geotag Clean Confirmed",
    },
  },
  {
    id: "electrical-infrastructure",
    slideNumber: "03",
    category: "Electrical Infrastructure",
    department: "State Power Distribution Corporation (DISCOM)",
    ministry: "Ministry of Power",
    headline: "Life-Safety Hazard Routing & Feeder Trip Telemetry",
    description:
      "Citizen reports of sparking transformer coils, low-hanging 11kV conductors, waterlogged junction boxes, and blackout clusters trigger instant Tier-1 safety protocols with automatic circuit isolations and lineman dispatch.",
    imageSrc: "/electricity.webp",
    altText: "Power Grid Electrical Infrastructure and Lineman Maintenance",
    slaTarget: "< 15 Minutes",
    complianceRate: "99.1%",
    activeWards: "180 Feeder Networks",
    monthlyResolutions: "3,110+",
    aiPipeline: {
      name: "Acoustic-Thermal Arc Detector + SCADA Hook",
      model: "High-Voltage Hazard Triage Engine",
      description:
        "Analyzes citizen audio recordings of transformer hums and photos of snapped overhead conductors. Direct webhook to SCADA sub-station to isolate feeder legs within 90 seconds.",
    },
    keyProvisions: [
      "Sub-15 minute emergency dispatch for fallen live conductors and pole sparking.",
      "Automated substation SCADA feeder trip correlation to detect localized blackouts.",
      "Mandatory safety clearance certificate before power feeder re-energization.",
      "Real-time SMS alerts to hospitals and essential utilities on the same feeder branch.",
    ],
    escalationMatrix: {
      level1: "Junior Engineer (Substation Operations)",
      level2: "Assistant Executive Engineer (AEE - DISCOM)",
      level3: "Superintending Engineer & State Energy Secretary",
    },
    sampleCase: {
      issue: "Transformer Sparking with Sparks Falling on Residential Lane",
      location: "Feeder 4B, Substation North-East, Gali No. 3",
      resolutionTime: "11 Minutes (Feeder Isolated & Coil Replaced)",
      status: "Emergency Resolved • Zero Injury",
    },
  },
  {
    id: "education-schools",
    slideNumber: "04",
    category: "Education & Schools",
    department: "Directorate of School Education & Samagra Shiksha",
    ministry: "Ministry of Education",
    headline: "Classroom Dignity, Drinking Water & Sanitation Audits",
    description:
      "Grievances regarding unsafe school ceilings, non-functional girl student toilets, contaminated RO water filters, and midday meal quality are routed directly to Zilla education councils with priority capital repair disbursements.",
    imageSrc: "/schools.jpeg",
    altText: "Public School Infrastructure and Amenities",
    slaTarget: "< 72 Hours",
    complianceRate: "96.3%",
    activeWards: "54 District Divisions",
    monthlyResolutions: "1,450+",
    aiPipeline: {
      name: "DocAudit-OCR + MidDay Meal Vision",
      model: "School Infrastructure & Hygiene Classifier",
      description:
        "Performs OCR parsing of handwritten student petition postcards and audits submitted photographs of kitchen cleanliness and classroom structural cracks.",
    },
    keyProvisions: [
      "Sub-72 hour emergency fund clearance for broken toilet plumbing and water filters.",
      "Direct escalations to District Magistrate (DM) for mid-day meal quality anomalies.",
      "Unannounced third-party verification audits for newly repaired government school blocks.",
      "Zero-retaliation confidential filing channel for teachers and parent associations.",
    ],
    escalationMatrix: {
      level1: "Block Education Officer (BEO)",
      level2: "District Basic Education Officer (BSA / DEO)",
      level3: "District Magistrate & State Education Secretary",
    },
    sampleCase: {
      issue: "Broken Drinking Water RO Filter in Primary School Block C",
      location: "Govt Middle School, Ward 12, Rural Cluster 4",
      resolutionTime: "31.5 Hours (New RO Membrane Installed)",
      status: "Water Quality Lab Certified (TDS: 110)",
    },
  },
  {
    id: "transport-mobility",
    slideNumber: "05",
    category: "Transport & Mobility",
    department: "Regional Transport Office (RTO) & City Transit Corp",
    ministry: "Ministry of Heavy Industries & Transit",
    headline: "Intelligent Fleet Telematics & Pedestrian Corridor Safety",
    description:
      "Multimodal citizen feedback identifies recurring bus headway delays, broken EV charging hubs, unlit bus stops, and rash driving clusters, triggering dynamic fleet reallocation and smart traffic engineering fixes.",
    imageSrc: "/transport.jpeg",
    altText: "Public Bus Transport and Urban Mobility Management",
    slaTarget: "< 36 Hours",
    complianceRate: "94.6%",
    activeWards: "92 Transit Corridors",
    monthlyResolutions: "2,630+",
    aiPipeline: {
      name: "TransitGraph-LLM + Telematics Correlator",
      model: "Urban Transit Ingestion & Corridor Safety Model",
      description:
        "Correlates crowd-sourced voice reports of long bus wait times with real-time GPS bus locators, automatically reassigning spare feeder buses from idle depots.",
    },
    keyProvisions: [
      "Sub-36 hour resolution for unlit bus stops and damaged passenger shelter roofs.",
      "Automatic speed governor checks for city buses reported for rash driving.",
      "Dynamic bus route headway trimming during peak school/office commuter hours.",
      "Accessible ramp repair audits across all operational low-floor transit buses.",
    ],
    escalationMatrix: {
      level1: "Depot Traffic Manager (DTM)",
      level2: "Regional Transport Officer (RTO)",
      level3: "Managing Director (State Transit Corp)",
    },
    sampleCase: {
      issue: "Recurring 45-Min Bus Bunching & Non-Stop Skipping at Depot Stop",
      location: "Corridor Route 412, Outer Ring Transit Stop 7",
      resolutionTime: "14 Hours (2 Additional Electric Buses Deployed)",
      status: "Headway Restored to 8 Mins",
    },
  },
  {
    id: "water-supply",
    slideNumber: "06",
    category: "Water Supply & Jal Nigam",
    department: "Municipal Jal Board / Public Health Engineering (PHED)",
    ministry: "Ministry of Jal Shakti",
    headline: "Pipeline Integrity, Leakage Neutralization & Potable Tankers",
    description:
      "Pipeline bursts, dirty water contamination, low water pressure, and illegal booster pump extractions are cross-referenced with municipal pressure transducers to dispatch valve repair squads and backup water tankers.",
    imageSrc: "/water.jpeg",
    altText: "Potable Water Supply and Municipal Pipeline Infrastructure",
    slaTarget: "< 12 Hours",
    complianceRate: "97.4%",
    activeWards: "164 Jal Zones",
    monthlyResolutions: "3,890+",
    aiPipeline: {
      name: "HydroNet-Sensor + Acoustic Leakage Classifier",
      model: "Pipeline Anomaly & Contamination Urgency Engine",
      description:
        "Analyzes citizen water turbidity reports and cross-checks pressure anomalies across underground main transmission lines for rapid valve isolation.",
    },
    keyProvisions: [
      "Sub-12 hour statutory repair restoral for ruptured underground main supply lines.",
      "Immediate deployment of GPS-tracked municipal potable water tankers to affected zones.",
      "Mandatory bacteriological purity lab tests after pipeline contamination repairs.",
      "Automated pressure regulation at booster pumps to prevent dry run and pipe cavitation.",
    ],
    escalationMatrix: {
      level1: "Junior Engineer (Water Works / Jal Board)",
      level2: "Executive Engineer (Public Health Engineering)",
      level3: "Chief Engineer & Principal Secretary (Jal Shakti)",
    },
    sampleCase: {
      issue: "Main 300mm Cast Iron Pipeline Burst Flooding Residential Lane",
      location: "Jal Zone 8, Shanti Nagar Main Road, Point 14",
      resolutionTime: "7.8 Hours (Clamp Seal Complete, Tankers Dispatched)",
      status: "Resolved • Purity Lab Tested",
    },
  },
];

interface CivicSectorsPageProps {
  onLodgeGrievance: () => void;
  onNavigateToOps: () => void;
}

export const CivicSectorsPage: React.FC<CivicSectorsPageProps> = ({
  onLodgeGrievance,
  onNavigateToOps,
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>("roads-highways");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeSector =
    SECTOR_DETAILS.find((s) => s.id === selectedSectorId) || SECTOR_DETAILS[0];

  const filteredSectors = SECTOR_DETAILS.filter(
    (s) =>
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F7F7F4] py-8 sm:py-12 space-y-10 selection:bg-teal-700 selection:text-white">
      {/* =========================================================================
          PAGE HEADER / BREADCRUMB STRIP
         ========================================================================= */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#007A99] font-mono text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>STATUTORY CIVIC SECTORS &amp; LINE MINISTRIES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              National Departmental Pillars
            </h1>
            <p className="text-base text-slate-600 font-sans leading-relaxed">
              Explore in-depth technical workflows, artificial intelligence inspection models, statutory Service Level Agreements (SLAs), and jurisdictional escalation hierarchies governing Jan Prayas AI across all 6 core civic domains.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLodgeGrievance}
              className="px-6 py-3.5 rounded-xl bg-[#007A99] hover:bg-[#00637c] text-white font-bold font-sans text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Lodge Grievance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNavigateToOps}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold font-sans text-sm shadow-2xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Live Ops Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTOR SELECTION HORIZONTAL CHIPS & SEARCH
         ========================================================================= */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Sector Buttons Grid / Horizontal Scroll */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {SECTOR_DETAILS.map((sector) => {
              const isSelected = sector.id === selectedSectorId;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => setSelectedSectorId(sector.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-left border ${
                    isSelected
                      ? "bg-[#007A99] border-teal-600 text-white shadow-md font-bold scale-102"
                      : "bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700 font-medium"
                  }`}
                >
                  <img
                    src={sector.imageSrc}
                    alt={sector.category}
                    className="w-6 h-6 rounded-md object-cover object-center"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono opacity-80 block leading-none">
                      {sector.slideNumber}
                    </span>
                    <span className="text-xs font-sans">{sector.category}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments, SLAs..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE SECTOR DEEP-DIVE SHOWCASE
         ========================================================================= */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual Photography & Live Stats */}
          <div className="lg:col-span-5 relative bg-slate-950 text-white flex flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-[580px]">
            {/* Background Image with crisp clarity */}
            <img
              src={activeSector.imageSrc}
              alt={activeSector.altText}
              className="absolute inset-0 w-full h-full object-cover object-center brightness-90 contrast-105"
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

            {/* Top Bar on Image */}
            <div className="relative z-10 p-6 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-400/40 text-teal-200 font-mono text-xs font-bold">
                SECTOR {activeSector.slideNumber}
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-rose-200 font-mono text-xs font-bold">
                SLA Guarantee: {activeSector.slaTarget}
              </span>
            </div>

            {/* Bottom Content on Image */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-teal-300 font-bold tracking-wider">
                  {activeSector.ministry}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                  {activeSector.category}
                </h3>
                <div className="text-xs text-slate-300 font-sans">{activeSector.department}</div>
              </div>

              {/* 3 Metric Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/15 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300">Resolutions</div>
                  <div className="text-base font-bold text-white">{activeSector.monthlyResolutions}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300">Coverage</div>
                  <div className="text-base font-bold text-teal-300">{activeSector.activeWards.split(" ")[0]}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="text-[10px] text-slate-300">Compliance</div>
                  <div className="text-base font-bold text-emerald-300">{activeSector.complianceRate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Architecture, SLA Provisions & Escalation Matrix */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#007A99] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CORE MANDATE &amp; CITIZEN CHARTER</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 tracking-tight leading-tight">
                  {activeSector.headline}
                </h2>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  {activeSector.description}
                </p>
              </div>

              {/* AI & Neural Architecture Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#007A99]">
                    <Cpu className="w-4 h-4 text-teal-600" />
                    <span>AI INSPECTION PIPELINE</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 font-mono text-[11px] font-bold">
                    {activeSector.aiPipeline.name}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 font-sans">
                  {activeSector.aiPipeline.model}
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {activeSector.aiPipeline.description}
                </p>
              </div>

              {/* Statutory Provisions List */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KEY STATUTORY SERVICE GUARANTEES</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSector.keyProvisions.map((provision, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2 text-xs font-sans text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{provision}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalation Hierarchy Bar */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>AUTOMATED STATUTORY ESCALATION PATH</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-slate-800">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Level 1 (Field)</span>
                    <span className="font-bold text-slate-900">{activeSector.escalationMatrix.level1}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 text-slate-800">
                    <span className="text-[10px] text-indigo-800 font-bold block uppercase">Level 2 (Division)</span>
                    <span className="font-bold text-slate-900">{activeSector.escalationMatrix.level2}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-slate-800">
                    <span className="text-[10px] text-rose-800 font-bold block uppercase">Level 3 (Secretariat)</span>
                    <span className="font-bold text-slate-900">{activeSector.escalationMatrix.level3}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-500">
                <span>Direct Ingestion Endpoint: </span>
                <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-bold">
                  /api/v1/grievance/{activeSector.id}
                </code>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onLodgeGrievance}
                  className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00637c] text-white font-bold font-sans text-xs transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <span>Lodge Grievance for {activeSector.category}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          ALL 6 SECTORS COMPARATIVE OVERVIEW GRID
         ========================================================================= */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900">
            Comparative Line Ministry Directory
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Select any card to instantly switch the technical inspector view above.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTOR_DETAILS.map((sec) => {
            const isSecSelected = sec.id === selectedSectorId;
            return (
              <div
                key={sec.id}
                onClick={() => {
                  setSelectedSectorId(sec.id);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
                className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md space-y-3.5 ${
                  isSecSelected
                    ? "border-[#007A99] ring-2 ring-teal-500/20 bg-teal-50/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sec.imageSrc}
                      alt={sec.category}
                      className="w-10 h-10 rounded-xl object-cover object-center border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold block">
                        SECTOR {sec.slideNumber}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 font-sans">
                        {sec.category}
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-mono text-[11px] font-bold border border-teal-200">
                    {sec.slaTarget}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">
                  {sec.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{sec.monthlyResolutions} solved</span>
                  <span className="text-[#007A99] font-bold flex items-center gap-1">
                    <span>Inspect Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
