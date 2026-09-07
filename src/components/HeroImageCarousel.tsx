import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Zap,
  Radio,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

export interface HeroSlide {
  id: number;
  imageUrl: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  sla: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
    badge: "SMART CITY COMMAND CENTER",
    badgeColor: "bg-teal-500 text-white",
    title: "Integrated Municipal Command & Control (ICCC)",
    subtitle:
      "Real-time GIS ward geospatial mapping, automated triage engine & multi-agency emergency coordination.",
    category: "Smart Operations Room",
    location: "Central Municipal Control Hub",
    sla: "< 15 Mins Response",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
    badge: "RAPID RESPONSE FIELD SQUADS",
    badgeColor: "bg-rose-600 text-white",
    title: "On-Ground Civic Infrastructure Redressal",
    subtitle:
      "Live power line restoration, pipeline repair & waterlogging mitigation dispatched via GPS telemetry.",
    category: "Disaster & Civic Field Units",
    location: "Ward 07 & Zone Perimeter",
    sla: "Immediate Dispatch",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1400&q=80",
    badge: "MULTIMODAL CITIZEN INTAKE",
    badgeColor: "bg-sky-600 text-white",
    title: "Voice, Handwritten & Dialect Redressal",
    subtitle:
      "WhisperX speech recognition & Gemini vision OCR processing 22+ Indic regional languages seamlessly.",
    category: "Multimodal Citizen Portal",
    location: "748 Municipal Wards Online",
    sla: "Zero Linguistic Barrier",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1400&q=80",
    badge: "URBAN PUBLIC SAFETY & TRANSIT",
    badgeColor: "bg-amber-600 text-white",
    title: "Spatial Hazard Detection & Road Safety",
    subtitle:
      "Deterministic urgency scoring prioritizing high-risk civic hazards before public disruption escalates.",
    category: "Urban Safety Monitoring",
    location: "Municipal Corridors & Highways",
    sla: "Tier-1 Auto Routing",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80",
    badge: "HUMAN-IN-THE-LOOP SIGN-OFF",
    badgeColor: "bg-emerald-600 text-white",
    title: "Nodal Officer Verification & DPDP Audit Trail",
    subtitle:
      "Tamper-proof cryptographic audit ledger ensuring sovereign privacy, accountability, and citizen trust.",
    category: "Civil Services Administration",
    location: "Executive Grievance Cell",
    sla: "100% DPDP Compliant",
  },
];

export const HeroImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 3-second auto-cycle interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div
      className="relative z-10 w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media Container with Height Fitting */}
      <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] overflow-hidden">
        
        {/* Animated Image Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Multi-layered Vignette Gradients for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top Floating Glass Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
          
          {/* Live Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase shadow-sm ${currentSlide.badgeColor}`}
            >
              {currentSlide.badge}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono">
              <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
              <span>LIVE SYSTEM STREAM</span>
            </span>
          </div>

          {/* 3s Interval Auto-cycle Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-teal-300 font-mono text-[10px] font-bold">
            <Clock className="w-3 h-3" />
            <span>3s INTERVAL</span>
          </div>

        </div>

        {/* Navigation Arrows (Reveal on Hover) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Content Card & Civic Intelligence Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 text-white"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-teal-300">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {currentSlide.location}
                </span>
                <span>&bull;</span>
                <span className="text-slate-300">{currentSlide.category}</span>
                <span>&bull;</span>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-400/40 text-teal-200 font-bold">
                  {currentSlide.sla}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-sans line-clamp-2 leading-relaxed max-w-xl">
                {currentSlide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Slide Dots & 3s Progress Indicator */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 gap-3">
            
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-teal-400 shadow-xs"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Slide Index & Live Counter */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span>
                CASE STREAM <span className="text-white font-bold">{currentIndex + 1}</span> / {HERO_SLIDES.length}
              </span>
              <span className="text-teal-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                VERIFIED
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Dynamic 3-second animated countdown progress bar at bottom edge */}
      <div className="w-full h-1 bg-white/10 overflow-hidden">
        <motion.div
          key={`${currentIndex}-${isPaused}`}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "0%" : "100%" }}
          transition={{ duration: 3, ease: "linear" }}
          className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-teal-300"
        />
      </div>

    </div>
  );
};
