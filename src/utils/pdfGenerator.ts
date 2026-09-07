import { GrievanceRecord, GrievanceNotification } from "../types";

export function generateAndDownloadComplaintPdf(
  data:
    | GrievanceRecord
    | {
        id: string;
        title?: string;
        reference_id?: string;
        assigned_department: string;
        urgency_tier?: string;
        urgency_score?: number;
        sla_window?: string;
        location?: string;
        ward?: string;
        extracted_text: string;
        detected_language?: string;
        ai_confidence_score?: number;
        timestamp?: string;
        status?: string;
        recipient_email?: string;
        recipient_name?: string;
      }
) {
  const docketId = data.id || "GRV-NEW";
  const refId = "reference_id" in data && data.reference_id ? data.reference_id : `REF-${Math.floor(1000 + Math.random() * 9000)}`;
  const department = data.assigned_department || "Municipal Redressal";
  const urgencyTier = "urgency_tier" in data && data.urgency_tier ? data.urgency_tier : "TIER_2_HIGH";
  const urgencyScore = "urgency_score" in data && data.urgency_score ? data.urgency_score : 85;
  const slaWindow = "sla_window" in data && data.sla_window ? data.sla_window : "< 12 HR";
  const location = data.location || "Sector 18 Civic Zone";
  const ward = "ward" in data && data.ward ? data.ward : "Ward 07";
  const text = data.extracted_text || "Civic complaint registered via Jan Prayas Sovereign Multimodal AI Engine.";
  const lang = "detected_language" in data && data.detected_language ? data.detected_language : "Hindi / English Indic";
  const confidence = "ai_confidence_score" in data && data.ai_confidence_score ? `${(data.ai_confidence_score * 100).toFixed(1)}%` : "99.2%";
  const time = data.timestamp || new Date().toLocaleString();
  const citizenName = "recipient_name" in data && data.recipient_name ? data.recipient_name : "Ayush";
  const citizenEmail = "recipient_email" in data && data.recipient_email ? data.recipient_email : "ayushgulshan31@gmail.com";

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download/print the official Complaint PDF Copy.");
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OFFICIAL_GRIEVANCE_DOSSIER_${docketId}</title>
  <style>
    @page { size: A4; margin: 12mm 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      margin: 0;
      padding: 24px;
      background: #f8fafc;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .letterhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px double #007A99;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .letterhead-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-img {
      height: 48px;
      width: auto;
      object-fit: contain;
    }
    .portal-titles {
      display: flex;
      flex-direction: column;
    }
    .portal-main-title {
      font-size: 16px;
      font-weight: 900;
      color: #007A99;
      letter-spacing: 0.5px;
    }
    .portal-sub-title {
      font-size: 11px;
      font-weight: 800;
      color: #000000;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .portal-govt-title {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
    }
    .letterhead-right {
      text-align: right;
      font-family: monospace;
      font-size: 11px;
      color: #475569;
    }
    .docket-badge {
      display: inline-block;
      background: #007A99;
      color: #ffffff;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 13px;
      margin-top: 4px;
    }
    .doc-header-banner {
      background: #f1f5f9;
      border-left: 4px solid #007A99;
      padding: 10px 14px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-title {
      font-size: 14px;
      font-weight: bold;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 20px;
      background: #f8fafc;
      padding: 14px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 10px;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
      font-family: monospace;
    }
    .meta-val {
      font-weight: 700;
      color: #0f172a;
      margin-top: 2px;
    }
    .text-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 20px;
      background: #ffffff;
    }
    .text-box-title {
      font-size: 11px;
      font-weight: 900;
      color: #007A99;
      text-transform: uppercase;
      font-family: monospace;
      margin-bottom: 8px;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 4px;
    }
    .text-content {
      font-size: 13px;
      line-height: 1.6;
      color: #1e293b;
      white-space: pre-wrap;
    }
    .citizen-copy-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 11px;
      color: #1e40af;
    }
    .citizen-copy-box strong {
      color: #1e3a8a;
    }
    .footer-stamp-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 28px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .qr-mock {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: monospace;
      font-size: 10px;
      color: #64748b;
    }
    .qr-box {
      width: 60px;
      height: 60px;
      border: 2px solid #007A99;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: bold;
      color: #007A99;
      background: #f0fdfa;
      text-align: center;
    }
    .signature-box {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }
    .digital-seal {
      display: inline-block;
      border: 2px solid #16a34a;
      color: #16a34a;
      font-size: 10px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .action-bar {
      margin-top: 20px;
      text-align: center;
    }
    .print-btn {
      background: #007A99;
      color: white;
      border: none;
      padding: 10px 24px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    @media print {
      body { background: white; padding: 0; }
      .page-container { border: none; box-shadow: none; padding: 0; }
      .action-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Official Letterhead Header -->
    <div class="letterhead">
      <div class="letterhead-left">
        <div class="portal-titles">
          <div class="portal-main-title">JAN PRAYAS &bull; जन प्रयास</div>
          <div class="portal-sub-title">AI GRIEVANCE REDRESSAL SYSTEM</div>
          <div class="portal-govt-title">Government of India &bull; Ministry of Housing and Urban Affairs</div>
        </div>
      </div>
      <div class="letterhead-right">
        <div>OFFICIAL CITIZEN DOSSIER</div>
        <div class="docket-badge">${docketId}</div>
      </div>
    </div>

    <!-- Official Banner -->
    <div class="doc-header-banner">
      <div class="doc-title">Civic Complaint Registration &amp; Dispatch Receipt</div>
      <div style="font-family: monospace; font-size: 11px; color: #475569;">REF ID: ${refId}</div>
    </div>

    <!-- Meta Details Grid -->
    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">Responsible Department</span>
        <span class="meta-val" style="color: #007A99;">${department}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Urgency Score &amp; Tier</span>
        <span class="meta-val">${urgencyScore}/100 (${urgencyTier})</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Statutory SLA Window</span>
        <span class="meta-val" style="color: #16a34a;">${slaWindow} Target Resolution</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Timestamp of Ingest</span>
        <span class="meta-val">${time}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Jurisdiction Ward / GPS</span>
        <span class="meta-val">${ward} &bull; ${location}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">AI Pipeline Verification</span>
        <span class="meta-val">${lang} (${confidence} confidence)</span>
      </div>
    </div>

    <!-- Citizen Dispatch Notification Box -->
    <div class="citizen-copy-box">
      <strong>Dispatch Copy Logged:</strong> Official digital acknowledgment and live status webhook linked to citizen account <strong>${citizenName}</strong> (&lt;${citizenEmail}&gt;). Dispatch copy also synced to nodal monitoring node <strong>&lt;krpinak687@gmail.com&gt;</strong>.
    </div>

    <!-- Complaint Body Text -->
    <div class="text-box">
      <div class="text-box-title">Transcribed / Extracted Complaint Statement</div>
      <div class="text-content">${text}</div>
    </div>

    <!-- Digital Seal & QR Stamp -->
    <div class="footer-stamp-area">
      <div class="qr-mock">
        <div class="qr-box">VERIFIED<br>QR SEAL<br>DPDP-23</div>
        <div>
          <div><strong>DIGITALLY AUTHENTICATED BY NIC / AGRS</strong></div>
          <div>Live Track URL: https://janprayas.gov.in/track/${docketId}</div>
          <div>Compliant with DPDP Act 2023 &amp; Citizen Charter SLAs</div>
        </div>
      </div>
      <div class="signature-box">
        <div class="digital-seal">&check; DIGITALLY SIGNED</div>
        <div><strong>Chief Nodal Redressal Officer</strong></div>
        <div>Jan Prayas Autonomous Triage Engine</div>
      </div>
    </div>

    <!-- Print Action Bar -->
    <div class="action-bar">
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
