# Jan Prayas (AGRS) — AI Multimodal Grievance Redressal System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38b2ac)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

**Jan Prayas (जनप्रयास)** is an enterprise-grade, asynchronous multimodal grievance intake and automated civic redressal dispatch platform developed for public governance, municipal corporations, and Mission BHASHINI initiatives.

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

## 🚀 Deployment on Vercel

This repository is pre-configured with `vercel.json` and a serverless API handler (`api/index.ts`) for zero-configuration deployment to [Vercel](https://vercel.com).

### Step-by-Step Vercel Deployment:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - Jan Prayas AGRS"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/janprayas.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your `janprayas` repository.
   - Framework Preset: **Vite** (auto-detected).
   - Build Command: `vite build` (or default `npm run build`).
   - Output Directory: `dist`.

3. **Configure Environment Variables in Vercel**:
   In your Vercel Project Settings (`Settings` > `Environment Variables`), add:
   | Variable Name | Description | Required |
   | ------------- | ----------- | -------- |
   | `GEMINI_API_KEY` | Your Google Gemini API Key for multimodal ASR & triage | Yes |
   | `APP_URL` | Your production Vercel URL (e.g. `https://janprayas.vercel.app`) | Optional |

4. **Click Deploy**:
   Vercel will build the frontend and deploy the serverless functions within seconds.

---

## 💻 Local Development

### Prerequisites:
- Node.js 20+
- npm or bun

### 1. Install Dependencies:
```bash
npm install
```

### 2. Configure Environment:
Copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Start Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production:
```bash
npm run build
```

---

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
