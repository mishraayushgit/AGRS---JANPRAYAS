import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  X,
  Smartphone,
  Mail,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Copy,
  Clock,
  Sparkles,
  Send,
  Building2,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import { GrievanceNotification } from "../types";
import { useGrievance } from "../store/GrievanceContext";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    setActiveNotificationModal,
    setActiveGrievance,
    grievances,
  } = useGrievance();

  const [channelFilter, setChannelFilter] = useState<"ALL" | "SMS" | "EMAIL">("ALL");

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (channelFilter === "ALL") return true;
    return n.channel === channelFilter;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleOpenGrievance = (grievanceId: string) => {
    const match = grievances.find((g) => g.id === grievanceId);
    if (match) {
      setActiveGrievance(match);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-2xs">
        {/* Backdrop click to close */}
        <div className="flex-1 cursor-pointer" onClick={onClose} />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 z-10"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-teal-950 text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300">
                  CITIZEN NOTIFICATION CENTER
                </div>
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <span>SMS &amp; Email Dispatch Logs</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                      {unreadCount} NEW
                    </span>
                  )}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Quick Actions */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setChannelFilter("ALL")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  channelFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setChannelFilter("SMS")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  channelFilter === "SMS"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setChannelFilter("EMAIL")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  channelFilter === "EMAIL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
                >
                  Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                  title="Clear notification list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-700 text-sm">No Notifications Dispatched Yet</div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  When a citizen grievance is registered or updated, simulated SMS and Email alerts will appear here in real time.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    setActiveNotificationModal(notif);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-xs space-y-2 group ${
                    notif.is_read
                      ? "bg-white border-slate-200"
                      : "bg-teal-50/40 border-teal-200/90 shadow-2xs"
                  }`}
                >
                  {/* Top line: Channel icon, docket ID, timestamp */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-lg flex items-center justify-center ${
                          notif.channel === "SMS"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {notif.channel === "SMS" ? (
                          <Smartphone className="w-3.5 h-3.5" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="font-bold text-slate-900">{notif.grievance_id}</span>
                      <span className="text-[10px] text-slate-400">({notif.channel})</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{notif.sent_at}</span>
                    </div>
                  </div>

                  {/* Recipient & Summary */}
                  <div className="font-sans text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 group-hover:text-[#007A99] transition-colors">
                        {notif.title}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                      {notif.message_body}
                    </p>
                  </div>

                  {/* Bottom Meta Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div>To: <span className="text-slate-800 font-bold">{notif.recipient}</span></div>
                    <div className="flex items-center gap-1 text-[#007A99] font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>View Receipt</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center font-mono text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-teal-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MoHUA National SMS &amp; e-Gov Gateway Simulated</span>
            </div>
            <div>Simulates instant citizen delivery on grievance registration</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
