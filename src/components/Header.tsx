import React, { useState } from "react";
import {
  Globe2,
  ArrowRight,
  Compass,
  Activity,
  FileCode2,
  BookOpen,
  Search,
  Calendar,
  MapPin,
  Phone,
  Layers,
  ChevronDown,
  ShieldCheck,
  Zap,
  Bell,
  User,
  LogIn,
  LogOut,
  UserCheck,
  Smartphone,
  Building2,
} from "lucide-react";
import { useGrievance } from "../store/GrievanceContext";

import { JanPrayasLogo } from "./JanPrayasLogo";
import { AuthUserIcon } from "./AuthUserIcon";

export type NavTab = "overview" | "sectors" | "operations" | "health" | "documentation" | "login";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onSubmitGrievanceClick: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onSubmitGrievanceClick,
  onOpenNotifications,
}) => {
  const {
    grievances,
    setActiveGrievance,
    globalSearchQuery,
    setGlobalSearchQuery,
    currentUser,
    logout,
    switchRole,
    notifications,
  } = useGrievance();

  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* =========================================================================
          MAIN COMPACT NAVIGATION BAR (Logo, Navigation Menu, Login/SSO, Alerts)
         ========================================================================= */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Exact Brand Logo matching user specification */}
        <div
          onClick={() => onSelectTab("overview")}
          className="cursor-pointer select-none group py-0.5 shrink-0 flex items-center hover:opacity-90 transition-opacity"
        >
          <JanPrayasLogo size="sm" />
        </div>

        {/* Right Section: Navigation Links grouped next to Action CTA */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 font-sans text-[13px] font-bold text-slate-700">
            <button
              onClick={() => onSelectTab("overview")}
              className={`py-1 transition-colors cursor-pointer relative ${
                currentTab === "overview"
                  ? "text-[#007A99]"
                  : "text-slate-700 hover:text-[#007A99]"
              }`}
            >
              <span>Overview</span>
              {currentTab === "overview" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#007A99] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onSelectTab("sectors")}
              className={`py-1 transition-colors cursor-pointer relative ${
                currentTab === "sectors"
                  ? "text-[#007A99]"
                  : "text-slate-700 hover:text-[#007A99]"
              }`}
            >
              <span>Civic Sectors</span>
              {currentTab === "sectors" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#007A99] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onSelectTab("operations")}
              className={`py-1 transition-colors cursor-pointer relative ${
                currentTab === "operations"
                  ? "text-[#007A99]"
                  : "text-slate-700 hover:text-[#007A99]"
              }`}
            >
              <span>Live Triage &amp; Ops</span>
              {currentTab === "operations" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#007A99] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onSelectTab("health")}
              className={`py-1 transition-colors cursor-pointer relative ${
                currentTab === "health"
                  ? "text-[#007A99]"
                  : "text-slate-700 hover:text-[#007A99]"
              }`}
            >
              <span>System Health</span>
              {currentTab === "health" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#007A99] rounded-full" />
              )}
            </button>

            <button
              onClick={() => onSelectTab("documentation")}
              className={`py-1 transition-colors cursor-pointer relative ${
                currentTab === "documentation"
                  ? "text-[#007A99]"
                  : "text-slate-700 hover:text-[#007A99]"
              }`}
            >
              <span>Docs &amp; API</span>
              {currentTab === "documentation" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#007A99] rounded-full" />
              )}
            </button>
          </nav>

          {/* Citizen Notifications Bell Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-700 hover:text-[#007A99] hover:bg-slate-100/80 transition-colors cursor-pointer border border-slate-200/80"
            title="Citizen Notifications & SMS Dispatch Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Auth / Profile Button */}
          <div className="relative">
            {currentUser ? (
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors cursor-pointer text-left shadow-2xs"
              >
                {/* Profile Icon with Reference Image 2 style */}
                <AuthUserIcon size={24} />

                <div className="text-xs">
                  <div className="font-bold text-white leading-tight truncate max-w-[110px]">
                    {currentUser.role === "citizen" ? "Ayush" : currentUser.name.split(" ")[0]}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-teal-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{currentUser.role === "citizen" ? "Citizen" : currentUser.role}</span>
                  </div>
                </div>

                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectTab("login")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#007A99] hover:bg-[#00657e] text-white text-xs font-mono font-bold shadow-2xs transition-all cursor-pointer"
              >
                <AuthUserIcon size={20} />
                <span>LOGIN / REGISTER</span>
              </button>
            )}

            {/* Quick Switch Dropdown */}
            {userDropdownOpen && currentUser && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 text-xs font-sans z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="p-2.5 border-b border-slate-100 font-mono bg-slate-50 rounded-xl mb-1 flex items-center gap-3">
                  <AuthUserIcon size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-xs">
                      {currentUser.role === "citizen" ? "Ayush" : currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center justify-between text-[9px] uppercase">
                      <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-bold border border-teal-200">
                        {currentUser.role}
                      </span>
                      <span className="text-slate-400 font-mono">ID: {currentUser.username || "ayush"}</span>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Switch Test Persona:
                  </div>
                  <button
                    type="button"
                    onClick={() => switchRole("citizen")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                      currentUser.role === "citizen"
                        ? "bg-teal-50 font-bold text-teal-900"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <AuthUserIcon size={18} />
                    <span>Ayush (Citizen)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchRole("officer")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                      currentUser.role === "officer"
                        ? "bg-indigo-50 font-bold text-indigo-900"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Er. R. Sharma (Officer)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchRole("admin")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                      currentUser.role === "admin"
                        ? "bg-amber-50 font-bold text-amber-900"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dr. Srinivasan (IAS Admin)</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab("login");
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#007A99]" />
                    <span>Member Login / Register Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Log Out Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Tab Quick Toggle Bar */}
      <div className="flex lg:hidden items-center justify-around bg-slate-50 border-t border-slate-200 px-2 py-1.5 text-xs font-semibold">
        <button
          onClick={() => onSelectTab("overview")}
          className={`px-2 py-1 rounded ${
            currentTab === "overview" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab("sectors")}
          className={`px-2 py-1 rounded ${
            currentTab === "sectors" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600"
          }`}
        >
          Sectors
        </button>
        <button
          onClick={() => onSelectTab("operations")}
          className={`px-2 py-1 rounded ${
            currentTab === "operations" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600"
          }`}
        >
          Ops
        </button>
        <button
          onClick={() => onSelectTab("health")}
          className={`px-2 py-1 rounded ${
            currentTab === "health" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600"
          }`}
        >
          Health
        </button>
        <button
          onClick={() => onSelectTab("documentation")}
          className={`px-2 py-1 rounded ${
            currentTab === "documentation" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600"
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => onSelectTab("login")}
          className={`px-2 py-1 rounded ${
            currentTab === "login" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600"
          }`}
        >
          Login
        </button>
      </div>
    </header>
  );
};

