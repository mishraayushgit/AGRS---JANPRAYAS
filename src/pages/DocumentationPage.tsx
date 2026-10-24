import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Cpu,
  Mic,
  FileText,
  Scan,
  Type,
  Send,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Copy,
  Layers,
  Zap,
  Building2,
  Clock,
  Terminal,
  MapPin,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isClickScrollingRef = useRef<boolean>(false);

  const sections = [
    { id: "overview", num: "01", title: "Overview & Objectives", short: "Overview" },
    { id: "architecture", num: "02", title: "Core Architecture", short: "Architecture" },
    { id: "voice", num: "03", title: "Voice Pipeline (ASR & VAD)", short: "Voice ASR" },
    { id: "handwriting", num: "04", title: "Handwriting OCR (TrOCR)", short: "Handwritten OCR" },
    { id: "printed", num: "05", title: "Printed OCR (PaddleOCR)", short: "Printed OCR" },
    { id: "nlp", num: "06", title: "Zero-Shot Indic NLP & Triage", short: "NLP Triage" },
    { id: "routing", num: "07", title: "Department Routing & SLAs", short: "Routing & SLAs" },
    { id: "api", num: "08", title: "FastAPI Reference & cURL", short: "API & cURL" },
    { id: "governance", num: "09", title: "DPDP Act 2023 Compliance", short: "Governance" },
  ];

  // Set up live sync with IntersectionObserver to track visible documentation cards
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isClickScrollingRef.current) return;

      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Find the entry closest to the top of the viewport
        visibleEntries.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const currentId = visibleEntries[0].target.getAttribute("id");
        if (currentId) {
          setActiveSection(currentId);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-10% 0px -40% 0px", // Trigger when top 10% - 60% of card enters viewport
      threshold: [0.1, 0.25, 0.5, 0.75],
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    isClickScrollingRef.current = true;

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 800);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const curlExample = `curl -X POST "https://grievance-intelligence.gov.in/api/v1/async-dispatch" \\
  -H "Authorization: Bearer <OFFICER_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "modality": "voice",
    "audio_pcm16_base64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
    "language_hint": "hi-IN",
    "location": "Sector 18 Market, Main Junction",
    "ward": "Ward 07"
  }'`;

  const fastApiEndpointExample = `@app.post("/api/v1/async-dispatch", response_model=TaskDispatchResponse)
async def dispatch_grievance_async(
    payload: GrievanceIngestPayload,
    background_tasks: BackgroundTasks
):
    """
    Ingests multimodal civic payload into Redis Celery broker.
    Dispatches to dedicated GPU/CPU worker queues.
    """
    task = celery_app.send_task(
        "tasks.multimodal_triage_pipeline",
        args=[payload.dict()],
        queue="gpu_multimodal_intake" if payload.modality != "text" else "cpu_fast_nlp_intake"
    )
    return {
        "task_id": task.id,
        "status": "PROCESSING",
        "queue": "gpu_multimodal_intake",
        "estimated_sla_ms": 350
    }`;

  const pythonSdkExample = `from janprayas_sdk import AGRSClient

client = AGRSClient(api_key="sk_gov_secure_live_key")

# Ingest and classify citizen grievance petition
response = client.triage_grievance(
    audio_path="./complaint_audio_16k.wav",
    modality="voice",
    language="hi-IN",
    gps_coordinates=(28.6139, 77.2090),
    ward="Ward 07"
)

print(f"Case ID: {response.case_id} | Routing: {response.assigned_dept} | Urgency: {response.urgency_score}/100")`;

  return (
    <div className="w-full space-y-10 sm:space-y-14 py-6 sm:py-10">
      
      {/* =========================================================================
          PAGE HEADER
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>TECHNICAL SPECIFICATION &bull; ARCHITECTURAL BLUEPRINT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            SYSTEM DOCUMENTATION &amp; API SPECIFICATION
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-sans max-w-4xl leading-relaxed">
            Exhaustive reference for the Jan Prayas (AGRS) sovereign intelligence engine: ASR acoustics, TrOCR vision transformers, zero-shot Indic hazard taxonomies, Celery job queues, and statutory compliance.
          </p>
        </div>
      </div>

      {/* Mobile Sticky Quick-Jump Navigation */}
      <div className="lg:hidden sticky top-20 z-40 bg-white/95 backdrop-blur-md border-y border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 uppercase">INDEX:</span>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleScrollToSection(sec.id)}
              className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeSection === sec.id
                  ? "bg-[#007A99] text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {sec.num}. {sec.short}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MAIN DOCUMENTATION LAYOUT (Sticky Sidebar + Content)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar (Live Synced with Active Section) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28 space-y-3 bg-white rounded-2xl border border-slate-200 p-4 font-mono text-xs shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                DOCUMENTATION INDEX
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                LIVE SYNC
              </span>
            </div>

            <nav className="space-y-1.5 pt-1">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                      isActive
                        ? "bg-slate-900 text-white font-bold shadow-xs pl-3.5 border-l-4 border-teal-400"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          isActive ? "text-teal-300" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {sec.num}
                      </span>
                      <span className="truncate text-xs">{sec.title}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-700 uppercase">Engine Status</div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Bhashini v3.6 Cluster Online</span>
              </div>
            </div>
          </div>

          {/* Right Content Area: All 9 Deep-Dive Cards */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* 1. Overview */}
            <section
              id="overview"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-teal-800 uppercase">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <span>01 &bull; OVERVIEW &amp; OBJECTIVES</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800">
                  CORE SPEC
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Civic Multimodal Intelligence Layer
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                Jan Prayas (AGRS) addresses the fundamental bottleneck of public grievance redressal: <strong>citizen communication asymmetry</strong>. In real-world civic environments, citizens report emergency and routine issues through disparate vernacular voice recordings, handwritten paper petitions on postcards, printed municipal circulars, and unstructured multilingual digital text.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-teal-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    <span>22+ LANGUAGES</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Full coverage of Eighth Schedule Indian vernaculars and Hinglish phonetic blends.
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-amber-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>&lt; 350MS LATENCY</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Asynchronous Celery + Redis stream queuing for instant dispatch without blocking.
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>HUMAN IN THE LOOP</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    Mandatory digital sign-off and verification gateway for Tier-1 critical dispatches.
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Core Architecture */}
            <section
              id="architecture"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-indigo-800 uppercase">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  <span>02 &bull; CORE ARCHITECTURE</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800">
                  TOPOLOGY
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Dual-Tier Ingestion &amp; Asynchronous Broker
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                The platform is designed around a micro-service queue topology. Ingress traffic is handled by a high-throughput FastAPI gateway that validates token authentication and pushes payloads into isolated Redis streams:
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-mono font-bold text-teal-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <span>gpu_multimodal_intake (NVIDIA A100/T4 Cluster)</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Dedicated GPU cluster for WhisperX audio ASR, PyAnnote voice activity detection, and TrOCR / PaddleOCR vision transformers with high batch concurrency.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <span>cpu_fast_nlp_intake (High-Memory CPU Nodes)</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Dedicated low-latency CPU nodes for zero-shot text classification, PII sanitization (Aadhaar/Mobile masking), entity extraction, and routing computation.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Voice Pipeline */}
            <section
              id="voice"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-teal-800 uppercase">
                  <Mic className="w-4 h-4 text-teal-700" />
                  <span>03 &bull; VOICE PROCESSING PIPELINE</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800">
                  WHISPERX + VAD
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                WhisperX &bull; PyAnnote VAD &bull; Wav2Vec2 Forced Alignment
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                Speech input is first normalized to 16 kHz mono PCM. Voice Activity Detection (VAD) isolates active speech regions from background ambient street and traffic noise. Batched CTranslate2 Whisper inference transcribes vernacular speech with word-level phonetic alignment.
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-teal-300 font-mono text-xs space-y-2">
                <div className="text-white font-bold pb-1 border-b border-slate-800">PIPELINE EXECUTION FLOW:</div>
                <div>[01] Ingest 16kHz PCM &rarr; PyAnnote VAD Segmentation (SNR &gt; 18dB)</div>
                <div>[02] CTranslate2 WhisperX Large v3 Batched Beam Search</div>
                <div>[03] Wav2Vec2 Indic CTC Phoneme Alignment (&lt; 10ms boundary precision)</div>
                <div>[04] Output: Standardized UTF-8 JSON transcript + speaker timestamp array</div>
              </div>
            </section>

            {/* 4. Handwriting OCR */}
            <section
              id="handwriting"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-sky-800 uppercase">
                  <FileText className="w-4 h-4 text-sky-700" />
                  <span>04 &bull; HANDWRITTEN PETITION OCR</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800">
                  TrOCR VISION
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                TrOCR Vision Transformer for Devanagari &amp; Indic Scripts
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                Handwritten citizen letters and panchayat notices present irregular stroke angles, varied ink intensities, and baseline curvature. The TrOCR encoder-decoder architecture tokenizes segmented visual text lines directly into Unicode representations, achieving a Character Error Rate (CER) under 0.015 on Devanagari petitions.
              </p>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs font-mono text-sky-950 space-y-1.5">
                <div className="font-bold text-sky-900 uppercase">TrOCR Vision Specs:</div>
                <div>&bull; Patch Resolution: 384x384 &bull; Encoder: RoBERTa-Indic-Base &bull; Decoder: IndicGPT-Small</div>
                <div>&bull; Stroke Invariant Normalization &bull; Pre-segmentation DBNet contour extraction</div>
              </div>
            </section>

            {/* 5. Printed OCR (PaddleOCR) */}
            <section
              id="printed"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-blue-800 uppercase">
                  <Scan className="w-4 h-4 text-blue-700" />
                  <span>05 &bull; PRINTED MUNICIPAL NOTICE OCR</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800">
                  PADDLEOCR v4
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                PaddleOCR v4 DBNet &amp; Multi-Lingual Layout Analysis
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                For printed municipal notifications, ward pamphlets, circulars, and newspaper clippings, the PaddleOCR v4 lightweight detection pipeline identifies bounding boxes in less than 45ms per page. It supports rotated text, multi-column municipal tables, and bilingual Hindi-English typography.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Text Detection (DBNet)</div>
                  <div className="text-[11px] text-slate-500 font-sans">Differentiable Binarization with polygon contour tracking.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Direction Classifier</div>
                  <div className="text-[11px] text-slate-500 font-sans">Automatic 0°, 90°, 180°, 270° angle detection and rectifying.</div>
                </div>
              </div>
            </section>

            {/* 6. Zero-Shot NLP & Urgency Scoring */}
            <section
              id="nlp"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-amber-800 uppercase">
                  <Zap className="w-4 h-4 text-amber-700" />
                  <span>06 &bull; ZERO-SHOT INDIC NLP &amp; DETERMINISTIC RISK TRIAGE</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                  RISK MATRIX
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Mathematical Risk Calibration (0–100 Scale)
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                Extracted verbatim transcripts are processed by a zero-shot Indic classification head that maps civic hazards against a standardized municipal taxonomy. Risk scores determine SLA enforcement:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">TIER</th>
                      <th className="p-3">SCORE RANGE</th>
                      <th className="p-3">SLA TIMEFRAME</th>
                      <th className="p-3">TYPICAL HAZARDS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="p-3 font-mono font-bold text-rose-700">TIER 1 CRITICAL</td>
                      <td className="p-3 font-mono">90 – 100</td>
                      <td className="p-3 font-mono font-bold">&lt; 15 MINUTES</td>
                      <td className="p-3 text-slate-600">Live 11kV wires, drinking water contamination, biohazard</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-amber-700">TIER 2 HIGH</td>
                      <td className="p-3 font-mono">50 – 89</td>
                      <td className="p-3 font-mono font-bold">&lt; 2 HOURS</td>
                      <td className="p-3 text-slate-600">Flyover sinkholes, major water supply failure, street blackout</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-emerald-700">TIER 3 ROUTINE</td>
                      <td className="p-3 font-mono">0 – 49</td>
                      <td className="p-3 font-mono font-bold">&lt; 24 HOURS</td>
                      <td className="p-3 text-slate-600">Garbage collection schedule, ward queries, routine feedback</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Department Routing & SLAs */}
            <section
              id="routing"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-teal-800 uppercase">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span>07 &bull; DEPARTMENT ROUTING &amp; DISPATCH ESCALATION</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800">
                  DISPATCH ENGINE
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Geo-Fenced Ward Routing &amp; Automated Escalation
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                Cases are assigned to municipal nodal officers based on geographic coordinates (lat/lng polygon lookup) and semantic domain classification. If a Tier-1 critical grievance exceeds 50% of its SLA without officer confirmation, the system triggers automated SMS and phone escalation to the Municipal Commissioner.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">1. Geo-Polygon Match</div>
                  <div className="text-[11px] text-slate-500 font-sans">Matches GIS coordinates to ward boundaries.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">2. Officer Push Alert</div>
                  <div className="text-[11px] text-slate-500 font-sans">Instant WhatsApp and Push notification dispatch.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">3. Auto-Escalation</div>
                  <div className="text-[11px] text-slate-500 font-sans">Hierarchical escalation to zonal directors upon timeout.</div>
                </div>
              </div>
            </section>

            {/* 8. FastAPI Reference & cURL */}
            <section
              id="api"
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-800 uppercase">
                  <Code2 className="w-4 h-4 text-slate-700" />
                  <span>08 &bull; FASTAPI DISPATCH ENDPOINTS &amp; cURL</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800">
                  REST API
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                RESTful Asynchronous Ingest API
              </h2>

              {/* cURL Code block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>cURL INGEST EXAMPLE:</span>
                  <button
                    onClick={() => handleCopy(curlExample, "curl")}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-bold transition-colors"
                  >
                    {copiedSnippet === "curl" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === "curl" ? "COPIED" : "COPY CURL"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {curlExample}
                </pre>
              </div>

              {/* Python FastAPI Code block */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>FASTAPI ENDPOINT SPECIFICATION:</span>
                  <button
                    onClick={() => handleCopy(fastApiEndpointExample, "fastapi")}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-bold transition-colors"
                  >
                    {copiedSnippet === "fastapi" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === "fastapi" ? "COPIED" : "COPY CODE"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {fastApiEndpointExample}
                </pre>
              </div>

              {/* Python SDK Example */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>PYTHON SDK EXAMPLE (janprayas-sdk):</span>
                  <button
                    onClick={() => handleCopy(pythonSdkExample, "sdk")}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-bold transition-colors"
                  >
                    {copiedSnippet === "sdk" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === "sdk" ? "COPIED" : "COPY SDK"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-sky-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {pythonSdkExample}
                </pre>
              </div>
            </section>

            {/* 9. DPDP Act 2023 Compliance */}
            <section
              id="governance"
              className="scroll-mt-28 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-teal-400 uppercase">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>09 &bull; DPDP ACT 2023 STATUTORY &amp; ETHICAL COMPLIANCE</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 border border-teal-500/30 text-teal-300">
                  SOVEREIGN DATA
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Zero Data Egress &bull; Sovereign Air-Gapped Ingestion
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                In compliance with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, all raw biometric audio streams and citizen handwritten scans are processed strictly within national sovereign boundary infrastructure. Raw media files in ephemeral storage are purged automatically following cryptographic SHA-256 case ledger indexing.
              </p>

              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 font-mono text-xs text-amber-300 space-y-1.5">
                <div className="font-bold uppercase text-amber-200">STATUTORY AUDIT CLAUSE:</div>
                <p className="text-xs text-amber-300 leading-relaxed font-sans">
                  AI assessments serve as triage indicators only. Final municipal dispatch orders preserve human officer audit signatures and cannot be automated without an authorized nodal engineer's credentials.
                </p>
              </div>
            </section>

          </div>

        </div>
      </div>

    </div>
  );
};
