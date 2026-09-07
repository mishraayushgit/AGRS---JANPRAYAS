# Jan Prayas (AMGRS) — AI Multimodal Grievance Redressal System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38b2ac)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

**Jan Prayas (जनप्रयास)** is an enterprise-grade, asynchronous multimodal grievance intake and automated civic redressal dispatch platform developed for public governance, municipal corporations, and Mission BHASHINI initiatives.

Link to acess - https://amgrs-janprayas.vercel.app/

It allows citizens across India to file complaints in text, speech (in 22 official languages and regional dialects), or document photographs. Submissions are transcribed via WhisperX ASR, analyzed for public safety urgency, and automatically routed to municipal departments with real-time tracking and SMS/Email dispatch.

---

## 🏛️ Key Features

- **Tri-Modal Ingestion Suite**:
  - 🎙️ **Voice Grievance (WhisperX ASR)**: Word-level timestamp alignment, VAD speech ratio, and speaker diarization.
  - 📷 **Photo / Document OCR**: Visual extraction of notices, handwritten petitions, and infrastructure damage evidence.
  - ✍️ **Multilingual Text Intake**: Zero-shot Indic NLP across 22 scheduled Indian languages.
- **Automated Civic Routing Engine**: Deterministic classification across:
  - *Public Health & Sanitation*
  - *Roads & Infrastructure*
  - *Power & Electricity*
  - *Water Resources & Supply*
- **Live Docket Tracking & SLA Monitor**: 6-digit docket ID lookup, timeline milestones, and auto-generated PDF receipts.
- **Field Operations & Dispatch Queue**: Dedicated portal for Zonal Officers, rapid escalation protocols, and municipal workload balancing.
- **Administrative Intelligence Dashboard**: Geo-density spatial clustering, SLA resolution analytics, and ward-level urgency scoring.
- **Offline-First & Graceful Fallback**: Client-side heuristic triage when network or API limits are encountered.

---


Link to acess - https://amgrs-janprayas.vercel.app/

## 📂 Project Structure

```
├── api/                   # Vercel Serverless Function entrypoint (/api/*)
├── fastapi-backend/       # Optional Python FastAPI service (Mission BHASHINI)
├── public/                # Static assets, branding emblems, sector imagery
├── src/
│   ├── components/        # Reusable UI components (Header, Logo, Cards, Dossiers)
│   ├── pages/             # Route views (Home, Tri-Modal Intake, Tracking, Operations, Analytics)
│   ├── store/             # Global Grievance Context & State Management
│   ├── utils/             # PDF generation, audio processing, telemetry
│   ├── types.ts           # Shared TypeScript interfaces & types
│   ├── App.tsx            # Main application layout & route controller
│   └── main.tsx           # React DOM mount point
├── vercel.json            # Vercel SPA rewrites & serverless configuration
├── vite.config.ts         # Vite build configuration with Tailwind CSS v4
├── server.ts              # Full-stack Node.js Express server for container runtimes
└── package.json           # Dependencies and scripts
```

---

## 🛡️ Data Protection & Privacy

Governed under the **Digital Personal Data Protection Act (DPDPA) 2023** and **Mission BHASHINI** guidelines. Citizen voice recordings and identity documents are processed ephemerally in memory without unauthorized third-party persistence.
