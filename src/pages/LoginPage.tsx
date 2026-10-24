import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  LogOut,
  RefreshCw,
  Home,
  Check,
  Shield,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { useGrievance } from "../store/GrievanceContext";
import { UserRole, DepartmentType } from "../types";
import { JanPrayasLogo } from "../components/JanPrayasLogo";
import { AuthUserIcon } from "../components/AuthUserIcon";
import { loginSchema, registerSchema } from "../utils/validation";

// Assets available in /public
const civicMeshHero = "/civic-mesh-hero.jpg";
const aiCivicHub = "/ai-civic-hub.jpg";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

interface SlideItem {
  id: string;
  tag: string;
  category: string;
  headline: string;
  subtext: string;
  image: string;
  stats: { label: string; value: string };
}

const SLIDES: SlideItem[] = [
  {
    id: "smart-city",
    tag: "CIVIC AI PLATFORM",
    category: "Smart Governance",
    headline: "Get access to your central hub for civic clarity & swift resolution",
    subtext: "You can easily file, track, and verify municipal petitions powered by multimodal AI intelligence.",
    image: civicMeshHero,
    stats: { label: "Average Triage Speed", value: "0.84s" },
  },
  {
    id: "ai-audio",
    tag: "VOICE & VISION INTELLIGENCE",
    category: "Mission BHASHINI & Whisper",
    headline: "Speak in any Indic language or snap photo evidence instantly",
    subtext: "Automatic speech recognition and zero-shot NLP parse dialect nuances into structured field dockets.",
    image: aiCivicHub,
    stats: { label: "Dialects Supported", value: "22+" },
  },
  {
    id: "roads",
    tag: "ROAD INFRASTRUCTURE",
    category: "Public Works Department",
    headline: "Real-time pothole mapping & rapid asphalt remediation squads",
    subtext: "Geo-tagged evidence automatically alerts executive engineers with exact street coordinates.",
    image: "/road.jpeg",
    stats: { label: "Pothole Resolution", value: "94.2%" },
  },
  {
    id: "water",
    tag: "WATER SUPPLY & HYDRAULICS",
    category: "Jal Jeevan Mission",
    headline: "Detect pipeline leaks and monitor clean municipal water supply",
    subtext: "Civic pressure alerts trigger automated dispatch for valve replacements and quality sampling.",
    image: "/water.jpeg",
    stats: { label: "Daily Water Monitored", value: "4.2M L" },
  },
  {
    id: "electricity",
    tag: "POWER TRANSMISSION & GRIDS",
    category: "Discom & Street Lighting",
    headline: "Automated transformer repairs and smart streetlight tracking",
    subtext: "High-voltage outage dockets are routed directly to emergency lineman dispatch in under 2 minutes.",
    image: "/electricity.webp",
    stats: { label: "Grid Uptime", value: "99.8%" },
  },
  {
    id: "sanitation",
    tag: "URBAN SANITATION & WASTE",
    category: "Swachh Bharat Urban",
    headline: "Smart waste segregation & rapid community cleanup drives",
    subtext: "Automated route optimization for waste collection vehicles keeping neighborhoods pristine.",
    image: "/sanitation.jpeg",
    stats: { label: "Cleanliness Index", value: "96.4%" },
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const {
    currentUser,
    logout,
    authenticateUser,
    registerUser,
    loginWithOAuth,
  } = useGrievance();

  // Mode: "login" vs "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Rotating Image Slideshow States
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Form States (Login)
  const [emailOrUsername, setEmailOrUsername] = useState<string>("ayush");
  const [password, setPassword] = useState<string>("password123");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form States (Register)
  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
  const [regRole, setRegRole] = useState<UserRole>("citizen");
  const [regDepartment, setRegDepartment] = useState<DepartmentType>("General Administration");

  // Zod Field Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Automatic slide rotation every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    slideIntervalRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Quick 1-click Demo Persona Autofill
  const handleQuickPersona = (role: "citizen" | "officer" | "admin") => {
    setAuthMode("login");
    setErrorMessage(null);
    setFieldErrors({});
    if (role === "citizen") {
      setEmailOrUsername("ayush");
      setPassword("password123");
      setSuccessMessage("Auto-filled Citizen credentials (ayush)");
    } else if (role === "officer") {
      setEmailOrUsername("officer");
      setPassword("password123");
      setSuccessMessage("Auto-filled Municipal Nodal Officer credentials");
    } else {
      setEmailOrUsername("admin");
      setPassword("password123");
      setSuccessMessage("Auto-filled Municipal Admin IAS credentials");
    }
  };

  // Handle Login Submit with Zod + Firestore
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // 1. Zod Validation
    const zodResult = loginSchema.safeParse({
      identifier: emailOrUsername,
      password: password,
      rememberMe: rememberMe,
    });

    if (!zodResult.success) {
      const errMap: Record<string, string> = {};
      zodResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) errMap[path] = issue.message;
      });
      setFieldErrors(errMap);
      setErrorMessage(zodResult.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authenticateUser(emailOrUsername, password);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage(`Authenticated successfully! Welcome, ${res.user.name}`);
        setTimeout(() => {
          onLoginSuccess();
        }, 400);
      } else {
        setErrorMessage(res.message || "Invalid account credentials. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Authentication failed. Please check credentials and retry.");
    }
  };

  // Handle Register Submit with Zod + Firestore
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // 1. Zod Validation
    const zodResult = registerSchema.safeParse({
      name: regName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      role: regRole,
      ward: "Ward 07, Sector 18",
      department: regDepartment,
    });

    if (!zodResult.success) {
      const errMap: Record<string, string> = {};
      zodResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) errMap[path] = issue.message;
      });
      setFieldErrors(errMap);
      setErrorMessage(zodResult.error.issues[0]?.message || "Validation failed.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: regRole,
        ward: "Ward 07, Sector 18",
        department: regRole === "officer" ? regDepartment : undefined,
      });

      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage(`Account created & saved in Firestore! Welcome, ${res.user.name}`);
        setTimeout(() => {
          onLoginSuccess();
        }, 450);
      } else {
        setErrorMessage(res.message || "Failed to create account.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  // Handle OAuth Providers (Google, Microsoft, Apple / iOS)
  const handleOAuthSignIn = async (provider: "google" | "microsoft" | "apple") => {
    setOauthLoading(provider);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await loginWithOAuth(provider);
      setOauthLoading(null);

      if (res.success && res.user) {
        setSuccessMessage(`Authenticated with ${provider.toUpperCase()} via Firebase & Firestore!`);
        setTimeout(() => {
          onLoginSuccess();
        }, 400);
      } else {
        setErrorMessage(res.message || `Failed to sign in with ${provider}.`);
      }
    } catch (err: any) {
      setOauthLoading(null);
      setErrorMessage(`Authentication error: ${err.message || "Unable to complete OAuth login."}`);
    }
  };

  const activeSlide = SLIDES[currentSlideIndex];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F3F4F9] text-slate-800 flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Floating Card (Matching User's Reference Layout) */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.12)] border border-slate-100 p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 relative z-10">
        
        {/* =========================================================================
            LEFT COLUMN: ROTATING IMAGE SLIDESHOW SHOWCASE (CHANGES CONTINUOUSLY)
           ========================================================================= */}
        <div
          className="lg:col-span-6 relative rounded-[28px] overflow-hidden min-h-[440px] sm:min-h-[560px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-8 text-white select-none group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Animated Slides with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeSlide.image}
                alt={activeSlide.category}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Color Wash Overlays (Deep Indigo / Violet Aura from screenshot) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D22] via-[#0E1338]/70 to-[#181E54]/40" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-transparent" />
              <div className="absolute inset-0 bg-radial-[at_top_left] from-indigo-500/25 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Top Row: Official Actual Jan Prayas Logo & Interactive Carousel Controls */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Actual Logo clickable */}
            <div
              onClick={onNavigateHome}
              className="cursor-pointer group/logo flex items-center gap-2 bg-white/95 hover:bg-white transition-all px-3 py-1.5 rounded-2xl shadow-md border border-white/40"
              title="Return to Home"
            >
              <JanPrayasLogo size="sm" showSubtitle={false} />
            </div>

            {/* Slide Navigation Controls & Auto-play Indicator */}
            <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                title="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                title={isPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                title="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Middle Badge / Metric Ribbon */}
          <div className="relative z-10 my-auto py-6">
            <motion.div
              key={`badge-${activeSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wide text-white/90 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeSlide.tag}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-mono text-[11px]">{activeSlide.category}</span>
            </motion.div>
          </div>

          {/* Bottom Card Content (Exact Typography & Feel from Reference Image) */}
          <div className="relative z-10 space-y-4">
            <motion.div
              key={`text-${activeSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-indigo-200/90 tracking-wide">
                You can easily
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight font-sans drop-shadow-md">
                {activeSlide.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md pt-1">
                {activeSlide.subtext}
              </p>
            </motion.div>

            {/* Slide Pagination Dash Bars */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {SLIDES.map((slide, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "w-8 bg-white shadow-xs"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Active Metric Badge */}
              <div className="text-right">
                <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  {activeSlide.stats.label}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  {activeSlide.stats.value}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: ACTUAL AUTHORIZATION (ZOD + FIRESTORE + OAUTH: GOOGLE / MS / APPLE)
           ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-between p-4 sm:p-8 lg:p-10">
          
          <div>
            {/* Top Brand Header with Actual Logo & Home Return */}
            <div className="flex items-center justify-between mb-5">
              <div className="cursor-pointer" onClick={onNavigateHome}>
                <JanPrayasLogo size="sm" />
              </div>

              {/* Home Navigation button */}
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#007A99] shrink-0 shadow-xs">
                  <AuthUserIcon size={24} strokeWidth={5} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {authMode === "login" ? "Sign in to Jan Prayas" : "Create an account"}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {authMode === "login"
                  ? "Access your petitions, telemetry, and municipal dispatch anytime, anywhere — keeping civic accountability moving."
                  : "Register as citizen petitioner or municipal duty officer. All accounts protected with Firestore security."}
              </p>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM CONTAINER */}
            {authMode === "login" ? (
              /* ================= LOGIN FORM (ZOD VALIDATED) ================= */
              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Email / Username Field */}
                <div>
                  <label
                    htmlFor="login-account"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Your email or username
                  </label>
                  <input
                    id="login-account"
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => {
                      setEmailOrUsername(e.target.value);
                      if (fieldErrors.identifier) {
                        setFieldErrors((prev) => ({ ...prev, identifier: "" }));
                      }
                    }}
                    placeholder="e.g. ayush or ayushgulshan31@gmail.com"
                    className={`w-full px-4 py-2.5 rounded-2xl bg-slate-50 border ${
                      fieldErrors.identifier ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    } text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/10 transition-all font-sans`}
                  />
                  {fieldErrors.identifier && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{fieldErrors.identifier}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailOrUsername("ayush");
                        setPassword("password123");
                        setSuccessMessage("Auto-filled default citizen credentials!");
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                    >
                      Fill default demo?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                      placeholder="••••••••••••"
                      className={`w-full pl-4 pr-11 py-2.5 rounded-2xl bg-slate-50 border ${
                        fieldErrors.password ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                      } text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-3 focus:ring-indigo-500/10 transition-all font-sans`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs text-slate-600 font-sans">
                      Remember me
                    </span>
                  </label>

                  <span className="text-[11px] text-emerald-600 font-mono font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span>Firestore Secured</span>
                  </span>
                </div>

                {/* Primary CTA Button (Matching Reference Image Violet-Indigo Glow) */}
                <button
                  id="get-started-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating in Firestore...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ================= REGISTER FORM (ZOD VALIDATED + FIRESTORE) ================= */
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ayush Gulshan"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-600 transition-all"
                  />
                  {fieldErrors.name && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) =>
                        setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                      }
                      placeholder="e.g. ayush_civic"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-mono focus:bg-white focus:outline-hidden focus:border-indigo-600 transition-all"
                    />
                    {fieldErrors.username && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{fieldErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="citizen@domain.in"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-600 transition-all"
                    />
                    {fieldErrors.email && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Set Password"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-600 transition-all"
                    />
                    {fieldErrors.password && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{fieldErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:outline-hidden focus:border-indigo-600 transition-all"
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    System Account Role:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole("citizen")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        regRole === "citizen"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole("officer")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        regRole === "officer"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Officer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole("admin")}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        regRole === "admin"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Register to Firestore</span>
                  )}
                </button>
              </form>
            )}

            {/* "or continue with" Divider (From Reference Image) */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2.5 text-slate-400 font-medium">
                  or sign in with
                </span>
              </div>
            </div>

            {/* =========================================================================
                ACTUAL OAUTH PROVIDERS: GOOGLE, MICROSOFT, APPLE (iOS)
               ========================================================================= */}
            <div className="grid grid-cols-3 gap-2.5 mb-3.5">
              {/* 1. Google OAuth */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={!!oauthLoading}
                className="py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
                title="Continue with Google Account"
              >
                {oauthLoading === "google" ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Google</span>
              </button>

              {/* 2. Microsoft OAuth */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn("microsoft")}
                disabled={!!oauthLoading}
                className="py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
                title="Continue with Microsoft Account"
              >
                {oauthLoading === "microsoft" ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                )}
                <span>Microsoft</span>
              </button>

              {/* 3. Apple (iOS) OAuth */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn("apple")}
                disabled={!!oauthLoading}
                className="py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
                title="Continue with Apple ID / iOS"
              >
                {oauthLoading === "apple" ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.79-11.89-14.24-7.23-11.03-12.73-23.77-16.51-38.22-3.77-14.44-5.66-27.91-5.66-40.4 0-16.73 4.29-30.82 12.87-42.27 8.58-11.45 19.34-17.29 32.27-17.52 4.91 0 10.38 1.25 16.42 3.75 6.04 2.5 10.02 3.82 11.94 3.96 1.71-.14 5.92-1.53 12.63-4.18 6.71-2.65 12.35-3.84 16.92-3.56 12.87.65 23.36 5.48 31.47 14.5-11.2 6.85-16.71 16.29-16.53 28.32.18 9.57 3.84 17.58 10.98 24.03 7.14 6.45 15.68 10.15 25.62 11.1-2.17 6.74-4.89 13.52-8.16 20.34zM119.22 31.81c0-7.39 2.65-14.44 7.95-21.15 5.3-6.71 11.85-10.66 19.65-11.85.22 1.3.33 2.45.33 3.45 0 7.39-2.78 14.54-8.33 21.46-5.55 6.92-12.29 10.87-20.22 11.85-.22-1.09-.38-2.34-.38-3.76z" />
                  </svg>
                )}
                <span>Apple iOS</span>
              </button>
            </div>

            {/* 1-Click Demo Personas */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1 mb-2">
              <span>Quick Test Roles:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPersona("citizen")}
                  className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer transition-colors"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersona("officer")}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold cursor-pointer transition-colors"
                >
                  Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersona("admin")}
                  className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold cursor-pointer transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Switch between Login & Register (From Reference Image) */}
          <div className="pt-4 text-center border-t border-slate-100">
            {authMode === "login" ? (
              <p className="text-xs text-slate-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setFieldErrors({});
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer ml-1"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setFieldErrors({});
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Floating Active User Toast if logged in */}
      {currentUser && (
        <div className="fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-3 max-w-sm flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
              {currentUser.name[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {currentUser.role.toUpperCase()} · Logged in
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              setSuccessMessage("Logged out of active session.");
            }}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      )}

    </div>
  );
};
