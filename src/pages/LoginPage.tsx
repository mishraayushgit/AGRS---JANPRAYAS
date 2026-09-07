import React, { useState } from "react";
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
  Smartphone,
  Fingerprint,
  RefreshCw,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useGrievance } from "../store/GrievanceContext";
import { UserRole, DepartmentType } from "../types";
import { AuthUserIcon } from "../components/AuthUserIcon";
import { JanPrayasLogo } from "../components/JanPrayasLogo";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const {
    currentUser,
    logout,
    authenticateUser,
    registerUser,
    switchRole,
  } = useGrievance();

  // Mode: "login" vs "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Selected Tab in the Login Card: "citizen" | "officer" | "admin" | "register"
  const [activeTab, setActiveTab] = useState<"citizen" | "officer" | "admin" | "register">("citizen");

  // Login Form States (matching Reference Image 2: Account + Password + Remember Me)
  const [account, setAccount] = useState<string>("ayush");
  const [password, setPassword] = useState<string>("password123");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Register Form States
  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
  const [regRole, setRegRole] = useState<UserRole>("citizen");
  const [regWard, setRegWard] = useState<string>("Ward 07, Sector 18");
  const [regDepartment, setRegDepartment] = useState<DepartmentType>("General Administration");

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Tab Switch
  const handleTabSwitch = (tab: "citizen" | "officer" | "admin" | "register") => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (tab === "register") {
      setAuthMode("register");
    } else {
      setAuthMode("login");
      if (tab === "citizen") {
        setAccount("ayush");
        setPassword("password123");
      } else if (tab === "officer") {
        setAccount("officer");
        setPassword("password123");
      } else if (tab === "admin") {
        setAccount("admin");
        setPassword("password123");
      }
    }
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!account.trim()) {
      setErrorMessage("Please enter your Account username or registered email.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authenticateUser(account, password);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage(`Authenticated successfully as ${res.user.name}`);
        setTimeout(() => {
          onLoginSuccess();
        }, 400);
      } else {
        setErrorMessage(res.message || "Invalid account credentials. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Authentication failed. Please verify credentials and retry.");
    }
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }
    if (!regUsername.trim()) {
      setErrorMessage("Please choose an Account / Username.");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!regPassword) {
      setErrorMessage("Please set a secure password.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Password confirmation does not match.");
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
        ward: regWard,
        department: regRole === "officer" ? regDepartment : undefined,
      });

      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage(`Account created successfully! Welcome, ${res.user.name}`);
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setErrorMessage(res.message || "Failed to register account.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#0C161D] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans">
      
      {/* Grand 2-Column Split Container (Left: Image 1 Brand Panel | Right: Image 2 Member Login) */}
      <div className="w-full max-w-5xl bg-[#11232E] border border-[#1E3B4D] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* =========================================================================
            LEFT COLUMN: SINGLE SIGN-ON (SSO) BRAND & PORTAL GATEWAY (IMAGE 1)
           ========================================================================= */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0B1E28] via-[#0E2431] to-[#0A1A24] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E3B4D]">
          
          <div className="space-y-5">
            {/* SSO Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#133742] border border-[#1FB2A6]/40 text-[#2DD4BF] text-[11px] font-mono font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>SINGLE SIGN-ON (SSO) PORTAL</span>
            </div>

            {/* Jan Prayas Brand Logo with AI Grievance Subtext */}
            <div
              onClick={onNavigateHome}
              className="cursor-pointer bg-white/95 hover:bg-white transition-all p-3 rounded-2xl inline-block shadow-md border border-slate-200"
            >
              <JanPrayasLogo size="sm" />
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-serif leading-snug tracking-tight">
                One Gateway for Citizens & Public Administrators
              </h1>
              <p className="text-xs font-sans text-slate-300 mt-2 leading-relaxed">
                Log in to file multimodal voice petitions, receive real-time SMS & Email status alerts, track field resolution progress, or review municipal dispatch queues.
              </p>
            </div>

            {/* 3 Key Feature Items */}
            <div className="space-y-3.5 pt-1">
              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#14313E] text-cyan-400 border border-cyan-800/60 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-sans">
                    Instant SMS & Email Dispatch
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Automated docket receipts delivered to citizen mobile & inbox.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#14313E] text-cyan-400 border border-cyan-800/60 shrink-0">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-sans">
                    National Citizen Verification
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Integrated with MeriPehchaan & Mobile OTP Authentication.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#14313E] text-cyan-400 border border-cyan-800/60 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-sans">
                    Role-Based Municipal Dispatch
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Dedicated portals for Executive Engineers and Nodal Officers.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Session Card (Ayush) */}
            <div className="p-3.5 rounded-2xl bg-[#0F2834]/90 border border-cyan-900/60 shadow-inner">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase mb-1">
                <span className="text-cyan-300">ACTIVE SESSION</span>
                <span className="px-1.5 py-0.5 rounded bg-teal-900/80 text-teal-300 border border-teal-500/40">
                  {currentUser ? (currentUser.role === "citizen" ? "CITIZEN" : currentUser.role.toUpperCase()) : "GUEST"}
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                {currentUser?.role === "citizen" ? "Ayush" : currentUser?.name || "Ayush"}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {currentUser?.email || "ayushgulshan31@gmail.com"}
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setSuccessMessage("Logged out successfully");
                }}
                className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/50 hover:border-rose-600 text-rose-300 hover:text-white text-[11px] font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Current Session</span>
              </button>
            </div>
          </div>

          {/* Left Footer */}
          <div className="pt-6 border-t border-[#183545] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Ministry of Housing & Urban Affairs</span>
            <span>Govt of India</span>
          </div>

        </div>


        {/* =========================================================================
            RIGHT COLUMN: MEMBER LOGIN & ACCOUNT AUTHENTICATION (IMAGE 2)
           ========================================================================= */}
        <div className="lg:col-span-7 bg-[#10232E] p-6 sm:p-8 flex flex-col justify-between">
          
          <div>
            {/* Top Persona Selection Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#0B1A22] border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => handleTabSwitch("citizen")}
                className={`py-2 px-1 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "citizen" && authMode === "login"
                    ? "bg-[#183647] text-white shadow-xs border border-cyan-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">Citizen Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("officer")}
                className={`py-2 px-1 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "officer" && authMode === "login"
                    ? "bg-[#183647] text-white shadow-xs border border-indigo-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">Officer SSO</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("admin")}
                className={`py-2 px-1 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "admin" && authMode === "login"
                    ? "bg-[#183647] text-white shadow-xs border border-amber-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">Admin IAS</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("register")}
                className={`py-2 px-1 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-cyan-700 text-white shadow-xs"
                    : "text-cyan-400 hover:text-cyan-300"
                }`}
              >
                <span>Register</span>
              </button>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Auth Form Container (Matching Image 2) */}
            {authMode === "login" ? (
              <div className="bg-[#142B38] border border-[#214356] rounded-2xl p-6 sm:p-7 shadow-xl">
                
                {/* Header with Auth User Icon & Title (Image 2) */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="mb-2.5 p-1 rounded-full bg-slate-900/60 border border-cyan-800/40 shadow-inner">
                    <AuthUserIcon size={56} />
                  </div>
                  
                  <h2 className="text-2xl font-black text-white tracking-wide font-sans">
                    Member Login
                  </h2>
                  <p className="text-xs font-sans text-slate-400 mt-1">
                    Enter your credentials to access the Grievance Portal
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Account Input (ayush) */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="login-account-field"
                        type="text"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        placeholder="Account (Username / Email)"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D1D26] border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input (password123) */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password-field"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0D1D26] border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox + Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-[#0D1D26] border-slate-600 text-cyan-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-600"
                      />
                      <span className="text-xs text-slate-300 font-sans">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setAccount("ayush");
                        setPassword("password123");
                        setSuccessMessage("Auto-filled default citizen credentials (ayush)");
                      }}
                      className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* OK & Cancel Buttons (Image 2) */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      id="login-ok-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0B1A22] hover:bg-[#112733] text-white font-mono font-bold text-sm tracking-widest border border-slate-700 hover:border-cyan-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <span>OK</span>
                      )}
                    </button>

                    <button
                      id="login-cancel-btn"
                      type="button"
                      onClick={onNavigateHome}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0B1A22] hover:bg-[#112733] text-slate-300 hover:text-white font-mono font-bold text-sm tracking-widest border border-slate-700 transition-all shadow-md cursor-pointer flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Bottom Register Link */}
                  <div className="pt-4 text-center border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("register");
                        setActiveTab("register");
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 tracking-wider hover:underline cursor-pointer uppercase"
                    >
                      CREATE NEW ACCOUNT
                    </button>
                  </div>

                </form>
              </div>
            ) : (
              /* Mode 2: REGISTRATION FORM */
              <div className="bg-[#142B38] border border-[#214356] rounded-2xl p-6 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">Create New Account</h3>
                  <p className="text-xs text-slate-400">Register new citizen or nodal authority credentials</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Full Name (e.g. Ayush)"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D1D26] border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                      placeholder="Account Username (e.g. ayush)"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D1D26] border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-cyan-500 font-mono"
                    />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D1D26] border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Set Password"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D1D26] border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-cyan-500"
                    />
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0D1D26] border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                      Account Role:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole("citizen")}
                        className={`py-1.5 px-2 rounded-lg text-xs font-sans font-bold border transition-colors cursor-pointer ${
                          regRole === "citizen"
                            ? "bg-cyan-900/80 border-cyan-400 text-white"
                            : "bg-[#0D1D26] border-slate-700 text-slate-400"
                        }`}
                      >
                        Citizen
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole("officer")}
                        className={`py-1.5 px-2 rounded-lg text-xs font-sans font-bold border transition-colors cursor-pointer ${
                          regRole === "officer"
                            ? "bg-indigo-900/80 border-indigo-400 text-white"
                            : "bg-[#0D1D26] border-slate-700 text-slate-400"
                        }`}
                      >
                        Officer
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole("admin")}
                        className={`py-1.5 px-2 rounded-lg text-xs font-sans font-bold border transition-colors cursor-pointer ${
                          regRole === "admin"
                            ? "bg-amber-900/80 border-amber-400 text-white"
                            : "bg-[#0D1D26] border-slate-700 text-slate-400"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0B1A22] hover:bg-[#112733] text-white font-mono font-bold text-xs tracking-wider border border-slate-700 hover:border-cyan-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      ) : (
                        <span>REGISTER (OK)</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setActiveTab("citizen");
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0B1A22] hover:bg-[#112733] text-slate-300 font-mono font-bold text-xs tracking-wider border border-slate-700 transition-all shadow-md cursor-pointer flex items-center justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Footer (Matching Image 1 Right Bottom) */}
          <div className="pt-6 border-t border-[#183545] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 mt-6">
            <span>NIC Certified SSO Node</span>
            <span>Governed under Digital Personal Data Protection Act 2023</span>
          </div>

        </div>

      </div>

    </div>
  );
};
