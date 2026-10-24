import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  AlertCircle,
  ArrowRight,
  LogOut,
  Edit3,
  Save,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import { useGrievance, cleanDisplayName } from "../store/GrievanceContext";
import { AuthUserIcon } from "../components/AuthUserIcon";
import { GrievanceRecord } from "../types";

interface ProfilePageProps {
  onNavigateHome: () => void;
  onNavigateToOps: () => void;
  onLodgeGrievance: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateHome,
  onNavigateToOps,
  onLodgeGrievance,
}) => {
  const { currentUser, updateUserProfile, logout, grievances, setActiveGrievance } = useGrievance();

  const cleanedName = cleanDisplayName(currentUser?.name);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: cleanedName,
    email: currentUser?.email || "ayushgulshan31@gmail.com",
    phone: currentUser?.phone || "+91 98765 43210",
    ward: currentUser?.jurisdiction_ward || "Ward 07, Sector 18 Market",
    username: currentUser?.username || "ayush",
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "RESOLVED">("ALL");

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Please Sign In to Access Your Profile</h2>
        <p className="text-sm text-slate-500">You need an active citizen account session to view personal petitions.</p>
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Filter grievances ACTUALLY submitted by this citizen (by user_id, citizen_email, citizen_phone, or name)
  const userGrievances = grievances.filter((g) => {
    const userEmail = (currentUser.email || "").toLowerCase().trim();
    const userName = (currentUser.name || "").toLowerCase().trim();
    const userClean = cleanedName.toLowerCase().trim();
    const userPhone = (currentUser.phone || "").replace(/\D/g, "");

    const gEmail = (g.citizen_email || "").toLowerCase().trim();
    const gName = (g.citizen_name || "").toLowerCase().trim();
    const gPhone = (g.citizen_phone || "").replace(/\D/g, "");
    const gUserId = (g as any).user_id;

    if (gUserId && gUserId === currentUser.id) return true;
    if (gEmail && userEmail && gEmail === userEmail) return true;
    if (gName && (gName === userName || gName === userClean)) return true;
    if (gPhone && userPhone && gPhone === userPhone) return true;

    return false;
  });

  const resolvedCount = userGrievances.filter((g) => g.status === "RESOLVED").length;
  const activeCount = userGrievances.filter((g) => g.status !== "RESOLVED").length;

  const filteredList = userGrievances.filter((g) => {
    if (filterStatus === "RESOLVED") return g.status === "RESOLVED";
    if (filterStatus === "ACTIVE") return g.status !== "RESOLVED";
    return true;
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      jurisdiction_ward: formData.ward.trim(),
      username: formData.username.trim(),
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleInspectGrievance = (g: GrievanceRecord) => {
    setActiveGrievance(g);
    onNavigateToOps();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Breadcrumb & Return Action */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal Overview</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile details have been successfully saved and synced to your cloud account!</span>
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              {/* User Avatar */}
              <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 shadow-2xs">
                <AuthUserIcon size={64} />
              </div>

              {/* Name & Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                    {cleanedName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold uppercase text-[10px] tracking-wider border border-teal-200">
                    {currentUser.role}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {currentUser.email}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.jurisdiction_ward || "Ward 07, Sector 18 Market"}</span>
                  </span>
                  <span className="font-mono text-slate-400">
                    ID: {currentUser.username || "AYUSHGULSHAN31"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isEditing
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
              </button>

              <button
                type="button"
                onClick={onLodgeGrievance}
                className="px-4 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00657e] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Lodge Grievance</span>
              </button>
            </div>

          </div>
        </div>

        {/* Edit Profile Form (When Active) */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Update Profile Information</h3>
              <p className="text-xs text-slate-500">Edit your official contact details and residential ward jurisdiction.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Ward / Locality</label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Discard
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Filed Petitions</span>
            <div className="text-3xl font-black text-slate-900 font-mono">{userGrievances.length}</div>
            <p className="text-[11px] text-slate-400">Lodged under Jan Prayas portal</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">In-Progress Triage</span>
            <div className="text-3xl font-black text-amber-600 font-mono">{activeCount}</div>
            <p className="text-[11px] text-slate-400">Assigned to field response teams</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved Redressals</span>
            <div className="text-3xl font-black text-emerald-600 font-mono">{resolvedCount}</div>
            <p className="text-[11px] text-slate-400">Closed with completion certificates</p>
          </div>
        </div>

        {/* Citizen Grievance History Module */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                My Grievance &amp; Redressal History
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of statutory SLAs, nodal officer dispatches, and verification milestones.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({userGrievances.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("ACTIVE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === "ACTIVE"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("RESOLVED")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === "RESOLVED"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Grievances List */}
          {userGrievances.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50/70 rounded-3xl border border-dashed border-slate-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-7 h-7 text-slate-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Past Grievance History</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You have not lodged any civic petitions under this account yet. When you file a complaint via Voice, Photo Evidence, or Text, your real-time docket and SLA status will appear here.
                </p>
              </div>
              <button
                type="button"
                onClick={onLodgeGrievance}
                className="px-5 py-2.5 rounded-xl bg-[#007A99] hover:bg-[#00657e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Lodge Your First Grievance</span>
              </button>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-semibold text-slate-600">No grievances found in this filter.</p>
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className="text-xs font-bold text-[#007A99] hover:underline cursor-pointer"
              >
                Show all {userGrievances.length} petitions &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredList.map((g) => {
                const isResolved = g.status === "RESOLVED";
                const isCritical = g.urgency_score >= 85;

                return (
                  <div
                    key={g.id}
                    onClick={() => handleInspectGrievance(g)}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group bg-white"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#007A99]">
                          {g.reference_id || g.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-sans">
                          {g.assigned_department}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isResolved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isCritical
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {g.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium line-clamp-1">
                        {g.title || g.extracted_text || "Civic Incident Report"}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-sans pt-0.5 flex-wrap">
                        <span>📍 {g.ward || g.location}</span>
                        <span>⏱ SLA Target: <strong className="text-slate-600">{g.sla_window}</strong></span>
                        <span>Score: <strong className={isCritical ? "text-rose-600" : "text-slate-700"}>{g.urgency_score}/100</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-indigo-600 shrink-0 self-end sm:self-center">
                      <span>View Case</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
