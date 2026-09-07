import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface CivicSlide {
  id: number;
  slideNumber: string;
  category: string;
  department: string;
  ministry: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  description: string;
  imageSrc: string;
  altText: string;
  civicTags: string[];
  statNumber: string;
  statLabel: string;
  slaTarget: string;
  activeWards: string;
  iconName: string;
}

export const CIVIC_SLIDES: CivicSlide[] = [
  {
    id: 1,
    slideNumber: "01",
    category: "Roads & Highways",
    department: "Public Works Department (PWD)",
    ministry: "Ministry of Road Transport & Highways",
    headingPrefix: "Rapid ",
    headingHighlight: "pothole resolution",
    headingSuffix: " & safer roads across India.",
    description:
      "Citizen-reported road damage, cratering, and bridge structural defects are verified via Computer Vision, automatically clustered by ward GPS, and assigned for rapid asphalt patching.",
    imageSrc: "/road.jpeg",
    altText: "Rapid pothole resolution and Indian road infrastructure",
    civicTags: [
      "Computer Vision Pothole Verification",
      "Automated Ward GPS Clustering",
      "SLA Target < 48 Hrs",
      "Contractor Penalty Escalation",
    ],
    statNumber: "4,280+",
    statLabel: "Potholes Patched this Month",
    slaTarget: "< 48 Hours",
    activeWards: "248 Municipal Wards",
    iconName: "road",
  },
  {
    id: 2,
    slideNumber: "02",
    category: "Sanitation & Waste",
    department: "Municipal Corporation Solid Waste Dept",
    ministry: "Ministry of Housing & Urban Affairs",
    headingPrefix: "Cleaner streets & ",
    headingHighlight: "better sanitation",
    headingSuffix: " for healthy communities.",
    description:
      "AI-verified sanitation complaints detect overflowing dumpsters, black spots, and toxic drain blockages to orchestrate immediate sanitary squad dispatches with before/after photo verification.",
    imageSrc: "/sanitation.jpeg",
    altText: "Cleaner streets and municipal sanitation management",
    civicTags: [
      "Vision AI Waste Hotspot Mapping",
      "Sanitation Crew Rapid Dispatch",
      "Recurring Point Analytics",
      "Zero Open-Dumping Mandate",
    ],
    statNumber: "98.2%",
    statLabel: "Sanitation Clearance SLA",
    slaTarget: "< 24 Hours",
    activeWards: "312 Sanitary Circles",
    iconName: "sanitation",
  },
  {
    id: 3,
    slideNumber: "03",
    category: "Electrical Infrastructure",
    department: "State Power Distribution Corp (DISCOM)",
    ministry: "Ministry of Power",
    headingPrefix: "Safer electrical infrastructure & ",
    headingHighlight: "faster emergency response",
    headingSuffix: ".",
    description:
      "Citizen reports of sparking transformers, sagging high-voltage wires, and blackout zones trigger immediate Tier-1 emergency safety protocol with live lineman GPS dispatch.",
    imageSrc: "/electricity.webp",
    altText: "Electrical grid safety and rapid response lineman work",
    civicTags: [
      "High-Risk Voltage Safety Triage",
      "Lineman Task Escalation",
      "Zero-Latency Emergency Routing",
      "Substation Load Telemetry",
    ],
    statNumber: "< 15 min",
    statLabel: "Life-Safety Hazard Response",
    slaTarget: "< 15 Mins",
    activeWards: "180 Feeder Networks",
    iconName: "electricity",
  },
  {
    id: 4,
    slideNumber: "04",
    category: "Education & Schools",
    department: "Directorate of Public Education",
    ministry: "Ministry of Education",
    headingPrefix: "Better schools, safe classrooms & ",
    headingHighlight: "dignified public services",
    headingSuffix: ".",
    description:
      "Grievances regarding broken classroom infrastructure, RO drinking water scarcity, midday meal quality, and pupil sanitation are routed directly to Zilla education officers for transparent grant allocation.",
    imageSrc: "/schools.jpeg",
    altText: "Public school classroom infrastructure and services",
    civicTags: [
      "Facility & Classroom Audit",
      "Priority Infrastructure Grant",
      "Direct Zilla Authority Link",
      "Mid-Day Meal Quality Monitor",
    ],
    statNumber: "1,450+",
    statLabel: "Schools Upgraded & Repaired",
    slaTarget: "< 72 Hours",
    activeWards: "54 District Divisions",
    iconName: "schools",
  },
  {
    id: 5,
    slideNumber: "05",
    category: "Transport & Mobility",
    department: "Regional Transport & City Bus Undertaking",
    ministry: "Ministry of Heavy Industries",
    headingPrefix: "Reliable public transit & ",
    headingHighlight: "safer urban mobility",
    headingSuffix: " for all citizens.",
    description:
      "Multimodal citizen feedback identifies recurring bus route delays, EV charging station breakdowns, and unsafe pedestrian corridors, triggering fleet reallocation and traffic engineering repairs.",
    imageSrc: "/transport.jpeg",
    altText: "Public bus transport and citizen urban mobility",
    civicTags: [
      "Corridor Safety Diagnostics",
      "Transit Depots Integration",
      "Direct Fleet Escalation",
      "Smart Traffic Light Sync",
    ],
    statNumber: "94.6%",
    statLabel: "Transit Issue Redressal",
    slaTarget: "< 36 Hours",
    activeWards: "92 Transit Corridors",
    iconName: "transport",
  },
  {
    id: 6,
    slideNumber: "06",
    category: "Water Supply & Jal Nigam",
    department: "Municipal Jal Board / Water Supply",
    ministry: "Ministry of Jal Shakti",
    headingPrefix: "Potable, reliable water supply for ",
    headingHighlight: "every neighborhood",
    headingSuffix: ".",
    description:
      "Pipeline bursts, water contamination, and supply shortages are instantly cross-referenced with municipal flow meters to dispatch repair teams and deploy backup water tankers to affected residential zones.",
    imageSrc: "/water.jpeg",
    altText: "Clean water supply and municipal pipeline utilities",
    civicTags: [
      "Pipeline Rupture Auto-Clustering",
      "Contamination Urgency Scoring",
      "Ward Supply Restoral SLA",
      "Tanker GPS Fleet Tracking",
    ],
    statNumber: "3,890+",
    statLabel: "Water Outages Restored",
    slaTarget: "< 12 Hours",
    activeWards: "164 Jal Zones",
    iconName: "water",
  },
];

interface CinematicIndianHeroProps {
  onRequestSubmitGrievance: () => void;
  onNavigateToOperations: () => void;
}

export const CinematicIndianHero: React.FC<CinematicIndianHeroProps> = ({
  onRequestSubmitGrievance,
  onNavigateToOperations,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic slide rotation every 5 seconds (paused on hover)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CIVIC_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = CIVIC_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CIVIC_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CIVIC_SLIDES.length) % CIVIC_SLIDES.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden select-none bg-slate-950 text-white border-b border-slate-800"
    >
      {/* =========================================================================
          FULL BACKGROUND IMAGE CAROUSEL IN EXACT NATURAL VIBRANT COLORS
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {CIVIC_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.04,
              }}
              transition={{
                opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 6, ease: "easeOut" },
              }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: isActive ? 2 : 1 }}
            >
              <img
                src={slide.imageSrc}
                alt={slide.altText}
                className="w-full h-full object-cover object-center filter brightness-100 contrast-100"
              />
            </motion.div>
          );
        })}

        {/* Light & Subtle Text-Contrast Scrim Only - Leaving Image in Exact True Colors */}
        <div className="absolute inset-0 z-3 bg-gradient-to-r from-slate-950/75 via-slate-950/45 via-50% to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-3 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />
      </div>

      {/* Spacer to push content to middle */}
      <div className="relative z-10 pt-6" />

      {/* =========================================================================
          MAIN HERO CONTENT (CLEAN HEADLINE, EDITORIAL COPY, & ACTION CTAS)
         ========================================================================= */}
      <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-16 my-auto">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-white tracking-tight leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {currentSlide.headingPrefix}
                <span className="font-serif italic font-normal text-rose-300 underline decoration-rose-400/60 decoration-wavy decoration-1 underline-offset-8">
                  {currentSlide.headingHighlight}
                </span>
                {currentSlide.headingSuffix}
              </h1>

              {/* Clean Narrative Description */}
              <p className="text-base sm:text-xl font-sans text-slate-100 leading-relaxed font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onRequestSubmitGrievance}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#007A99] to-teal-600 hover:from-[#006b86] hover:to-teal-500 text-white font-sans font-bold text-sm sm:text-base tracking-wide shadow-xl hover:shadow-teal-500/30 transition-all cursor-pointer flex items-center justify-center gap-3 group border border-teal-400/50"
            >
              <span>Submit Citizen Grievance</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onNavigateToOperations}
              className="px-7 py-4 rounded-xl bg-slate-900/85 hover:bg-slate-800/90 border border-white/30 hover:border-white/50 text-white font-sans font-bold text-sm sm:text-base tracking-wide shadow-lg backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>Live Operations Room &amp; AI Triage</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

