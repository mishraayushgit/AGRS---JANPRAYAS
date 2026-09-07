import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Mail,
  CheckCircle2,
  X,
  Copy,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  MapPin,
  QrCode,
  Share2,
  Printer,
  Download,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";
import { GrievanceNotification } from "../types";
import { generateAndDownloadComplaintPdf } from "../utils/pdfGenerator";

interface NotificationModalProps {
  notification: GrievanceNotification | null;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
}) => {
  const [activeView, setActiveView] = useState<"phone" | "email">("phone");
  const [copied, setCopied] = useState<boolean>(false);

  if (!notification) return null;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    generateAndDownloadComplaintPdf({
      id: notification.grievance_id,
      reference_id: notification.reference_id,
      assigned_department: notification.meta.department,
      urgency_tier: notification.meta.urgency_tier,
      urgency_score: notification.meta.urgency_score,
      sla_window: notification.meta.sla_window,
      location: notification.meta.location,
      extracted_text: notification.message_body,
      timestamp: notification.sent_at,
      recipient_name: notification.recipient_name,
      recipient_email: notification.recipient,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MOCK USER NOTIFICATION SIMULATOR &bull; LIVE RECEIPT</span>
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                  Grievance Submission Confirmation
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

          {/* Tab Switcher: SMS vs Email simulation */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView("phone")}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeView === "phone"
                    ? "bg-[#007A99] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulated SMS ({notification.sender_id || "VM-JANPRY"})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("email")}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeView === "email"
                    ? "bg-[#007A99] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Official e-Gov Email Receipt</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>DELIVERED (0.12s)</span>
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {activeView === "phone" ? (
              /* PHONE SMS MOCKUP */
              <div className="max-w-md mx-auto bg-slate-950 rounded-3xl p-3 sm:p-4 border-4 border-slate-800 shadow-xl">
                {/* Phone Top Speaker & Camera Notch */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* SMS Header */}
                <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 text-center space-y-0.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-800/60 text-teal-300 font-bold font-mono text-xs flex items-center justify-center mx-auto mb-1">
                    JP
                  </div>
                  <div className="font-mono font-bold text-xs text-white">
                    {notification.sender_id || "VM-JANPRY"}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Government of India &bull; National Grievance Portal
                  </div>
                </div>

                {/* SMS Message Bubble */}
                <div className="space-y-3">
                  <div className="text-center text-[10px] font-mono text-slate-500">
                    Today &bull; {notification.sent_at}
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-2xl rounded-tl-sm p-4 border border-slate-800 space-y-2.5 font-mono text-xs text-left shadow-sm">
                    <div className="font-bold text-teal-300 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>JAN PRAYAS &bull; GRIEVANCE REGISTRATION</span>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed font-sans">
                      Dear <strong>{notification.recipient_name || "Citizen"}</strong>, your civic petition has been successfully registered on Jan Prayas Portal.
                    </p>

                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                      <div><strong>Docket ID:</strong> <span className="text-teal-300 font-bold">{notification.grievance_id}</span></div>
                      <div><strong>Reference:</strong> {notification.reference_id}</div>
                      <div><strong>Assigned Dept:</strong> {notification.meta.department}</div>
                      <div><strong>Priority:</strong> <span className="text-amber-300">{notification.meta.urgency_tier} ({notification.meta.urgency_score}/100)</span></div>
                      <div><strong>Response SLA:</strong> <span className="text-emerald-300 font-bold">{notification.meta.sla_window}</span></div>
                      <div><strong>Location:</strong> {notification.meta.location}</div>
                    </div>

                    <p className="text-slate-300 text-xs font-sans">
                      Track live field team dispatch &amp; status:
                    </p>

                    <div className="bg-teal-950/60 border border-teal-800/70 p-2 rounded-lg text-teal-300 text-[11px] break-all flex items-center justify-between gap-2">
                      <span className="font-bold">{notification.tracking_url}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(notification.tracking_url)}
                        className="shrink-0 p-1 hover:text-white cursor-pointer"
                        title="Copy tracking link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Letterhead PDF Copy</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Ref: NIC-DL-AGRS &bull; MoHUA</span>
                      <span className="text-teal-400 font-bold">Delivered ✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Recipient Info */}
                <div className="mt-3 pt-2 text-center text-[10px] font-mono text-slate-500 border-t border-slate-900">
                  Simulated SMS sent to: <span className="text-slate-300 font-bold">{notification.recipient}</span>
                </div>
              </div>
            ) : (
              /* EMAIL MOCKUP */
              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden text-slate-800 font-sans text-xs">
                {/* Email Client Top Bar */}
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono">
                  <div className="space-y-0.5">
                    <div><strong>From:</strong> Jan Prayas National Portal &lt;{notification.sender_id || "alerts@janprayas.gov.in"}&gt;</div>
                    <div><strong>To:</strong> {notification.recipient_name} &lt;{notification.recipient}&gt;</div>
                    <div><strong>Subject:</strong> <span className="text-slate-900 font-bold">{notification.subject || `[OFFICIAL CONFIRMATION] Grievance Ingest #${notification.grievance_id} - ${notification.meta.department}`}</span></div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>{notification.sent_at}</div>
                    <div className="text-emerald-700 font-bold">Digitally Signed &bull; 256-bit TLS</div>
                  </div>
                </div>

                {/* Email Content Body */}
                <div className="p-6 space-y-5 bg-[#FBFBFA]">
                  {/* Official Emblem Banner */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-teal-800">
                    <div className="flex items-center gap-3">
                      <img
                        src="/janprayas-logo.png"
                        alt="Jan Prayas"
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/jansamadhan-logo.png";
                        }}
                      />
                      <div>
                        <div className="text-[10px] font-mono font-bold text-black uppercase tracking-wider">
                          AI GRIEVANCE REDRESSAL SYSTEM
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Government of India &bull; Ministry of Housing &amp; Urban Affairs
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] text-slate-500">
                      <div>CASE DOCKET NO.</div>
                      <div className="text-sm font-bold text-slate-900">{notification.grievance_id}</div>
                    </div>
                  </div>

                  {/* Main Notice Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-serif font-bold text-slate-900">
                        Formal Grievance Acknowledgment &amp; Department Routing Slip
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800">
                        {notification.meta.urgency_tier} ({notification.meta.urgency_score}/100)
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs">
                      Dear <strong>{notification.recipient_name}</strong>,
                    </p>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Your civic complaint has been registered and verified by the automated Multimodal Indic Triage Engine. An active field dispatch ticket has been routed to the respective municipal executive team:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg font-mono text-[11px] border border-slate-200">
                      <div>
                        <span className="text-slate-500">Case Docket Number:</span>
                        <div className="font-bold text-slate-900">{notification.grievance_id}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Official Reference ID:</span>
                        <div className="font-bold text-slate-900">{notification.reference_id}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Responsible Department:</span>
                        <div className="font-bold text-teal-800">{notification.meta.department}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Statutory SLA Window:</span>
                        <div className="font-bold text-emerald-800">{notification.meta.sla_window}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">Incident Location / Ward:</span>
                        <div className="font-bold text-slate-900">{notification.meta.location}</div>
                      </div>
                    </div>

                    {/* PDF Letterhead Download Attachment Box */}
                    <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-blue-950 text-xs">
                            Official_Grievance_Letterhead_{notification.grievance_id}.pdf
                          </div>
                          <div className="text-[11px] text-blue-700 font-mono">
                            Digital Seal &bull; QR Stamp &bull; Ministry Watermark (A4)
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Letterhead PDF</span>
                      </button>
                    </div>

                    <div className="p-3 bg-teal-50/80 rounded-lg border border-teal-200 flex items-center justify-between gap-3 font-sans">
                      <div className="space-y-0.5">
                        <div className="font-bold text-teal-900 text-xs">Direct Live Tracking Portal:</div>
                        <div className="text-[11px] text-teal-700 font-mono break-all">{notification.tracking_url}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(notification.tracking_url)}
                        className="px-3 py-1.5 rounded-lg bg-[#007A99] hover:bg-[#00657e] text-white font-mono text-[10px] font-bold shrink-0 cursor-pointer"
                      >
                        Copy URL
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      Note: You will receive automated status updates as the municipal quick response field team updates their work log or closes the case docket.
                    </p>
                  </div>

                  {/* Footer Seal */}
                  <div className="text-[10px] font-mono text-slate-400 text-center border-t border-slate-200 pt-3">
                    National Informatics Centre (NIC) &bull; Jan Prayas AGRS &bull; Governed under DPDP Act 2023
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              {copied ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Copied tracking details to clipboard!
                </span>
              ) : (
                <span>Tracking Link: {notification.tracking_url}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" />
                <span>Download Letterhead PDF</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    `Jan Prayas Grievance Receipt: ${notification.grievance_id} (Ref: ${notification.reference_id})\nDept: ${notification.meta.department}\nSLA: ${notification.meta.sla_window}\nTrack: ${notification.tracking_url}`
                  )
                }
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#007A99] hover:bg-[#00657e] text-white font-mono text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
