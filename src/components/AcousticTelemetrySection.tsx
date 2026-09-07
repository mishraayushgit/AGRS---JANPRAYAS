import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Volume2,
  Activity,
  Radio,
  Sliders,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart2,
  Mic,
  VolumeX,
  Clock,
  Sparkles,
  Info,
  RefreshCw,
  Headphones,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// ============================================================================
// ACOUSTIC TELEMETRY DATASETS
// ============================================================================

// 1. Hourly Acoustic Telemetry Data for Voice Ingestion (Sound Level, SNR, Clarity & PESQ)
export interface AcousticHourlyData {
  time: string;
  hour: number;
  soundLevelDb: number; // Decibels SPL (45 - 88 dB)
  snrDb: number; // Signal-to-Noise Ratio (dB) (12 - 36 dB)
  ambientNoiseDb: number; // Background Noise floor (dB) (30 - 62 dB)
  clarityScore: number; // Audio Clarity Index % (60 - 99%)
  phoneticConfidence: number; // Whisper CTC alignment % (70 - 99%)
  voiceCallVolume: number; // Incoming voice grievances count in that hour
  clippingRate: number; // Distortion % (0 - 4%)
}

const HOURLY_ACOUSTIC_DATA: AcousticHourlyData[] = [
  { time: "06:00", hour: 6, soundLevelDb: 54, snrDb: 28, ambientNoiseDb: 34, clarityScore: 92, phoneticConfidence: 95, voiceCallVolume: 18, clippingRate: 0.2 },
  { time: "07:00", hour: 7, soundLevelDb: 58, snrDb: 26, ambientNoiseDb: 38, clarityScore: 89, phoneticConfidence: 93, voiceCallVolume: 34, clippingRate: 0.4 },
  { time: "08:00", hour: 8, soundLevelDb: 67, snrDb: 22, ambientNoiseDb: 48, clarityScore: 84, phoneticConfidence: 88, voiceCallVolume: 82, clippingRate: 1.1 },
  { time: "09:00", hour: 9, soundLevelDb: 74, snrDb: 19, ambientNoiseDb: 56, clarityScore: 78, phoneticConfidence: 84, voiceCallVolume: 142, clippingRate: 2.3 },
  { time: "10:00", hour: 10, soundLevelDb: 79, snrDb: 18, ambientNoiseDb: 61, clarityScore: 76, phoneticConfidence: 82, voiceCallVolume: 195, clippingRate: 2.8 },
  { time: "11:00", hour: 11, soundLevelDb: 82, snrDb: 17, ambientNoiseDb: 64, clarityScore: 74, phoneticConfidence: 80, voiceCallVolume: 220, clippingRate: 3.1 },
  { time: "12:00", hour: 12, soundLevelDb: 77, snrDb: 20, ambientNoiseDb: 58, clarityScore: 79, phoneticConfidence: 85, voiceCallVolume: 174, clippingRate: 1.9 },
  { time: "13:00", hour: 13, soundLevelDb: 72, snrDb: 23, ambientNoiseDb: 52, clarityScore: 83, phoneticConfidence: 87, voiceCallVolume: 118, clippingRate: 1.4 },
  { time: "14:00", hour: 14, soundLevelDb: 75, snrDb: 21, ambientNoiseDb: 55, clarityScore: 81, phoneticConfidence: 86, voiceCallVolume: 135, clippingRate: 1.6 },
  { time: "15:00", hour: 15, soundLevelDb: 78, snrDb: 19, ambientNoiseDb: 59, clarityScore: 77, phoneticConfidence: 83, voiceCallVolume: 168, clippingRate: 2.4 },
  { time: "16:00", hour: 16, soundLevelDb: 81, snrDb: 18, ambientNoiseDb: 63, clarityScore: 75, phoneticConfidence: 81, voiceCallVolume: 204, clippingRate: 2.9 },
  { time: "17:00", hour: 17, soundLevelDb: 84, snrDb: 16, ambientNoiseDb: 67, clarityScore: 72, phoneticConfidence: 79, voiceCallVolume: 238, clippingRate: 3.4 },
  { time: "18:00", hour: 18, soundLevelDb: 80, snrDb: 19, ambientNoiseDb: 62, clarityScore: 76, phoneticConfidence: 83, voiceCallVolume: 189, clippingRate: 2.5 },
  { time: "19:00", hour: 19, soundLevelDb: 71, snrDb: 24, ambientNoiseDb: 51, clarityScore: 85, phoneticConfidence: 89, voiceCallVolume: 110, clippingRate: 1.2 },
  { time: "20:00", hour: 20, soundLevelDb: 63, snrDb: 27, ambientNoiseDb: 42, clarityScore: 90, phoneticConfidence: 94, voiceCallVolume: 65, clippingRate: 0.5 },
  { time: "21:00", hour: 21, soundLevelDb: 56, snrDb: 29, ambientNoiseDb: 35, clarityScore: 94, phoneticConfidence: 96, voiceCallVolume: 32, clippingRate: 0.3 },
];

// 2. Regional Dialect Audio Clarity & STOI/PESQ Intelligibility
export interface DialectClarityData {
  language: string;
  clarityIndex: number; // 0 - 100
  snrAverage: number; // dB
  asrConfidence: number; // %
  sampleRate: string; // e.g. "16 kHz"
  meanDuration: number; // seconds
  backgroundNoiseDampening: number; // dB attenuation
}

const REGIONAL_DIALECT_DATA: DialectClarityData[] = [
  { language: "Hindi (Standard)", clarityIndex: 94, snrAverage: 25.4, asrConfidence: 96.2, sampleRate: "16 kHz", meanDuration: 8.2, backgroundNoiseDampening: 24.1 },
  { language: "Hinglish / Slang", clarityIndex: 88, snrAverage: 22.8, asrConfidence: 91.8, sampleRate: "16 kHz", meanDuration: 7.6, backgroundNoiseDampening: 21.5 },
  { language: "Bhojpuri (Rural)", clarityIndex: 82, snrAverage: 18.5, asrConfidence: 87.4, sampleRate: "8 kHz Telephony", meanDuration: 11.4, backgroundNoiseDampening: 17.8 },
  { language: "Marathi (Urban/Rural)", clarityIndex: 91, snrAverage: 24.1, asrConfidence: 94.6, sampleRate: "16 kHz", meanDuration: 8.9, backgroundNoiseDampening: 22.9 },
  { language: "Bengali (Kolkata/Rarh)", clarityIndex: 93, snrAverage: 26.0, asrConfidence: 95.8, sampleRate: "16 kHz", meanDuration: 9.1, backgroundNoiseDampening: 23.4 },
  { language: "Tamil (Chennai/Coimbatore)", clarityIndex: 89, snrAverage: 23.2, asrConfidence: 92.5, sampleRate: "16 kHz", meanDuration: 8.4, backgroundNoiseDampening: 20.8 },
  { language: "Telugu (Hyderabad/Rayalaseema)", clarityIndex: 90, snrAverage: 23.7, asrConfidence: 93.1, sampleRate: "16 kHz", meanDuration: 8.7, backgroundNoiseDampening: 21.2 },
  { language: "Punjabi (Majha/Malwa)", clarityIndex: 87, snrAverage: 21.4, asrConfidence: 90.9, sampleRate: "16 kHz", meanDuration: 9.8, backgroundNoiseDampening: 19.6 },
  { language: "Gujarati", clarityIndex: 92, snrAverage: 24.8, asrConfidence: 94.1, sampleRate: "16 kHz", meanDuration: 7.9, backgroundNoiseDampening: 23.0 },
];

// 3. Audio Ingestion Quality Breakdown by Source Pipeline
const PIPELINE_BANDWIDTH_DATA = [
  { source: "PSTN Telephony (1800 IVR)", count: 842, avgClarity: 78, avgSnr: 17.4, latencyMs: 180, pcmBand: "8 kHz G.711" },
  { source: "Mobile WebRTC Audio (App/Portal)", count: 615, avgClarity: 94, avgSnr: 28.2, latencyMs: 95, pcmBand: "16/48 kHz Opus" },
  { source: "WhatsApp Voice Notes (AAC/OGG)", count: 489, avgClarity: 86, avgSnr: 22.1, latencyMs: 240, pcmBand: "16 kHz Opus" },
  { source: "Gram Panchayat Kiosk Mic", count: 210, avgClarity: 91, avgSnr: 26.5, latencyMs: 140, pcmBand: "16 kHz PCM" },
];

// Radar Data for Multi-Dimensional Audio Processing Benchmark
const RADAR_METRICS_DATA = [
  { metric: "Speech Clarity", rawTelephony: 72, aiDenoised: 94, threshold: 80 },
  { metric: "SNR Ratio", rawTelephony: 60, aiDenoised: 91, threshold: 75 },
  { metric: "Dialect CTC Align", rawTelephony: 68, aiDenoised: 89, threshold: 75 },
  { metric: "Noise Attenuation", rawTelephony: 45, aiDenoised: 96, threshold: 70 },
  { metric: "Clipping Tolerance", rawTelephony: 74, aiDenoised: 92, threshold: 80 },
  { metric: "Acoustic Intelligibility", rawTelephony: 65, aiDenoised: 95, threshold: 80 },
];

// Custom Tooltip for Recharts
const CustomAcousticTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs font-mono space-y-1.5 z-50">
        <div className="text-teal-400 font-bold border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
          <span>TIME WINDOW: {label} IST</span>
          <span className="text-[10px] text-slate-400">16 kHz PCM</span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-100">
              {entry.value} {entry.unit || ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const AcousticTelemetrySection: React.FC = () => {
  const [activeMetricTab, setActiveMetricTab] = useState<"sound_snr" | "clarity_trend" | "dialect_comparison" | "pipeline_distribution">("sound_snr");
  const [timeRange, setTimeRange] = useState<"last6h" | "today24h" | "all">("today24h");
  const [isSimulatingLiveFeed, setIsSimulatingLiveFeed] = useState<boolean>(false);
  const [liveJitterDelta, setLiveJitterDelta] = useState<number>(0);

  // Filter hourly data based on timeRange
  const displayHourlyData = useMemo(() => {
    if (timeRange === "last6h") {
      return HOURLY_ACOUSTIC_DATA.slice(-7);
    }
    return HOURLY_ACOUSTIC_DATA;
  }, [timeRange]);

  // Aggregate Key Telemetry Metrics
  const summaryMetrics = useMemo(() => {
    const totalCalls = HOURLY_ACOUSTIC_DATA.reduce((acc, curr) => acc + curr.voiceCallVolume, 0);
    const avgSoundLevel = Math.round(HOURLY_ACOUSTIC_DATA.reduce((acc, curr) => acc + curr.soundLevelDb, 0) / HOURLY_ACOUSTIC_DATA.length);
    const avgSnr = (HOURLY_ACOUSTIC_DATA.reduce((acc, curr) => acc + curr.snrDb, 0) / HOURLY_ACOUSTIC_DATA.length).toFixed(1);
    const avgClarity = (HOURLY_ACOUSTIC_DATA.reduce((acc, curr) => acc + curr.clarityScore, 0) / HOURLY_ACOUSTIC_DATA.length).toFixed(1);
    const avgPhonetic = (HOURLY_ACOUSTIC_DATA.reduce((acc, curr) => acc + curr.phoneticConfidence, 0) / HOURLY_ACOUSTIC_DATA.length).toFixed(1);
    return { totalCalls, avgSoundLevel, avgSnr, avgClarity, avgPhonetic };
  }, []);

  const triggerLiveTelemetryPulse = () => {
    setIsSimulatingLiveFeed(true);
    setLiveJitterDelta(Math.floor(Math.random() * 8) - 4);
    setTimeout(() => {
      setIsSimulatingLiveFeed(false);
    }, 1600);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* =========================================================================
          SECTION HEADER WITH LIVE METRIC BADGES
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-[#007A99] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007A99] animate-pulse" />
            <span>VOICE GRIEVANCE ACOUSTIC TELEMETRY &amp; AUDIO CLARITY ANALYTICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Acoustic Signal, SNR &amp; Voice Intelligibility Trends
          </h2>
          <p className="text-xs text-slate-500 font-sans max-w-2xl">
            Real-time spectral analysis, decibel levels, background ambient noise floors, and phonetic CTC clarity metrics across all incoming citizen telephony and voice channels.
          </p>
        </div>

        {/* Live Status & Quick Action */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <button
            type="button"
            onClick={triggerLiveTelemetryPulse}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            title="Poll real-time acoustic sensors and IVR audio buffers"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#007A99] ${isSimulatingLiveFeed ? "animate-spin" : ""}`} />
            <span>{isSimulatingLiveFeed ? "SYNCING TELEMETRY..." : "REFRESH ACOUSTIC FEED"}</span>
          </button>

          <div className="px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#007A99] animate-pulse" />
            <span>IVR INGESTION: 16 kHz MONO</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY TELEMETRY SUMMARY KPI CARDS
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Sound Level (dB) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>SOUND LEVEL (RMS)</span>
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">
            {summaryMetrics.avgSoundLevel + liveJitterDelta} <span className="text-xs font-mono text-slate-500 font-normal">dB SPL</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Optimal Voice Band</span>
          </div>
        </div>

        {/* Card 2: Signal-to-Noise Ratio (SNR) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>SIGNAL-TO-NOISE (SNR)</span>
            <Activity className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-teal-700">
            +{summaryMetrics.avgSnr} <span className="text-xs font-mono text-slate-500 font-normal">dB</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <span>Min Target: &gt; 15 dB</span>
          </div>
        </div>

        {/* Card 3: Clarity Index Score */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>AUDIO CLARITY INDEX</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">
            {summaryMetrics.avgClarity}%
          </div>
          <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+2.4% vs Yesterday</span>
          </div>
        </div>

        {/* Card 4: Phonetic CTC Alignment */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>PHONETIC CONFIDENCE</span>
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-indigo-900">
            {summaryMetrics.avgPhonetic}%
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            WhisperX Fine-Tuned
          </div>
        </div>

        {/* Card 5: Total Voice Ingestion Calls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>VOICE GRIEVANCES</span>
            <Headphones className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-slate-900">
            {summaryMetrics.totalCalls.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-teal-800">
            100% Vernacular Triage
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN CHART CONTAINER WITH INTERACTIVE TAB CONTROLS
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Navigation & Metric View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          {/* Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveMetricTab("sound_snr")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMetricTab === "sound_snr"
                  ? "bg-[#007A99] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>SOUND LEVEL &amp; SNR (dB)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricTab("clarity_trend")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMetricTab === "clarity_trend"
                  ? "bg-[#007A99] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>CLARITY &amp; CTC CONFIDENCE (%)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricTab("dialect_comparison")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMetricTab === "dialect_comparison"
                  ? "bg-[#007A99] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>REGIONAL DIALECT CLARITY</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricTab("pipeline_distribution")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMetricTab === "pipeline_distribution"
                  ? "bg-[#007A99] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SOURCE PIPELINES &amp; RADAR</span>
            </button>
          </div>

          {/* Time Window Switcher */}
          <div className="flex items-center gap-1.5 font-mono text-xs bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setTimeRange("last6h")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                timeRange === "last6h" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Last 6h
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("today24h")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                timeRange === "today24h" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Full Day (24h)
            </button>
          </div>

        </div>

        {/* =========================================================================
            TAB 1: SOUND LEVEL (dB SPL) & SIGNAL-TO-NOISE RATIO (SNR dB)
           ========================================================================= */}
        {activeMetricTab === "sound_snr" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span>ACOUSTIC ENERGY &amp; SNR DEVIATION TIMELINE</span>
                <span className="text-[10px] text-slate-400 font-normal">(Filtered through Bhashini DeepFilterNet3)</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#007A99] rounded" /> Sound Level (dB SPL)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#10b981] rounded" /> Signal-to-Noise Ratio (SNR dB)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#94a3b8] rounded" /> Ambient Noise Floor (dB)
                </span>
              </div>
            </div>

            {/* Recharts Composed Area/Line Chart */}
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={displayHourlyData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="soundLevelGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007A99" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#007A99" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="ambientNoiseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  
                  {/* Left Axis: Decibels (dB) */}
                  <YAxis
                    yAxisId="left"
                    domain={[0, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="monospace"
                    tickFormatter={(val) => `${val} dB`}
                    tickLine={false}
                  />

                  {/* Right Axis: Call Volume */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 300]}
                    stroke="#cbd5e1"
                    fontSize={10}
                    fontFamily="monospace"
                    tickFormatter={(val) => `${val} calls`}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomAcousticTooltip />} />
                  
                  {/* Reference Line for Max Acceptable Ambient Noise (65 dB) */}
                  <ReferenceLine
                    yAxisId="left"
                    y={65}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{ value: "Max Ambient Noise Threshold (65 dB)", fill: "#e11d48", fontSize: 10, position: "top" }}
                  />

                  {/* Background Ambient Noise Area */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="ambientNoiseDb"
                    name="Ambient Noise Floor"
                    unit="dB"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#ambientNoiseGradient)"
                  />

                  {/* Incoming Sound Level Area */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="soundLevelDb"
                    name="Sound Level (RMS)"
                    unit="dB SPL"
                    stroke="#007A99"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#soundLevelGradient)"
                  />

                  {/* Signal-to-Noise Ratio (SNR) Line */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="snrDb"
                    name="Signal-to-Noise (SNR)"
                    unit="dB"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#10b981" }}
                    activeDot={{ r: 6 }}
                  />

                  {/* Bar for Call Volume */}
                  <Bar
                    yAxisId="right"
                    dataKey="voiceCallVolume"
                    name="Voice Ingestion Volume"
                    unit="calls"
                    fill="#cbd5e1"
                    opacity={0.35}
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Acoustic Interpretation Footer Note */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 font-mono text-[11px] block mb-1">
                  🔊 Peak Ambient Hours (10:00 - 12:00 &amp; 16:00 - 18:00)
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Marketplace traffic and industrial zones elevate ambient noise up to 67 dB. Automatic dynamic compression boosts citizen speech gain by +14 dB.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 font-mono text-[11px] block mb-1">
                  ⚡ Minimum SNR Clearance (+16 dB)
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Sovereign WhisperX achieves &gt;99.1% word accuracy whenever SNR exceeds +14 dB across all 12 Indic regional linguistic models.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 font-mono text-[11px] block mb-1">
                  🛡️ Distortion Clipping Control (&lt; 3.5%)
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Soft-knee limiting prevents microphone overload when distressed citizens shout near handset microphones during emergency reports.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CLARITY SCORE (%) & PHONETIC CTC CONFIDENCE
           ========================================================================= */}
        {activeMetricTab === "clarity_trend" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span>SPEECH CLARITY INDEX &amp; CTC CONFIDENCE HOURLY CORRELATION</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#0284c7] rounded" /> Clarity Score (%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#6366f1] rounded" /> CTC Phonetic Confidence (%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 bg-[#f43f5e] rounded" /> Audio Clipping Rate (%)
                </span>
              </div>
            </div>

            {/* Recharts Area / Line for Intelligibility */}
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={displayHourlyData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="clarityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  
                  <YAxis
                    domain={[50, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="monospace"
                    tickFormatter={(val) => `${val}%`}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomAcousticTooltip />} />
                  
                  <ReferenceLine
                    y={80}
                    stroke="#059669"
                    strokeDasharray="3 3"
                    label={{ value: "STOI Target Benchmark (80%)", fill: "#059669", fontSize: 10, position: "insideBottomRight" }}
                  />

                  {/* Clarity Score Area */}
                  <Area
                    type="monotone"
                    dataKey="clarityScore"
                    name="Audio Clarity Index"
                    unit="%"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#clarityGradient)"
                  />

                  {/* CTC Phonetic Confidence Line */}
                  <Line
                    type="monotone"
                    dataKey="phoneticConfidence"
                    name="Phonetic CTC Alignment"
                    unit="%"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#6366f1" }}
                  />

                  {/* Clipping Rate */}
                  <Line
                    type="monotone"
                    dataKey="clippingRate"
                    name="Audio Clipping / Distortion"
                    unit="%"
                    stroke="#f43f5e"
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: REGIONAL DIALECT AUDIO CLARITY & SNR COMPARISON
           ========================================================================= */}
        {activeMetricTab === "dialect_comparison" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span>INDIC REGIONAL VERNACULAR AUDIO CLARITY &amp; ASR CONFIDENCE</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Benchmarked on 10,000+ Field Calls (Mission Bhashini Corpus)
              </div>
            </div>

            {/* Recharts BarChart */}
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGIONAL_DIALECT_DATA}
                  margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="language"
                    stroke="#64748b"
                    fontSize={10}
                    fontFamily="monospace"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="monospace"
                    tickFormatter={(val) => `${val}%`}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomAcousticTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", paddingTop: 10 }} />
                  
                  <Bar
                    dataKey="clarityIndex"
                    name="Audio Clarity Index"
                    unit="%"
                    fill="#007A99"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="asrConfidence"
                    name="ASR Word Accuracy"
                    unit="%"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="backgroundNoiseDampening"
                    name="Noise Dampening Delta"
                    unit="dB"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INGESTION PIPELINES & MULTI-DIMENSIONAL RADAR
           ========================================================================= */}
        {activeMetricTab === "pipeline_distribution" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Radar Chart (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#007A99]" />
                <span>ACOUSTIC RECOVERY: RAW TELEPHONY VS AI-DENOISED</span>
              </div>

              <div className="w-full h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_METRICS_DATA}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                    <Radar
                      name="Raw IVR Telephony"
                      dataKey="rawTelephony"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.25}
                    />
                    <Radar
                      name="AI Denoised &amp; Enhanced"
                      dataKey="aiDenoised"
                      stroke="#007A99"
                      fill="#007A99"
                      fillOpacity={0.4}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Pipelines Breakdown List (6 cols) */}
            <div className="lg:col-span-6 space-y-3 font-mono text-xs">
              <div className="text-xs font-mono font-bold text-slate-800 flex items-center justify-between">
                <span>INGESTION PIPELINE ACOUSTIC PROFILES</span>
                <span className="text-[10px] text-slate-400">Total: 2,156 calls today</span>
              </div>

              <div className="space-y-2.5">
                {PIPELINE_BANDWIDTH_DATA.map((pipe, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs font-sans">
                        {pipe.source}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-[#007A99] font-bold text-[10px]">
                        {pipe.pcmBand}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[9px]">CALL COUNT:</span>
                        <span className="font-bold text-slate-800">{pipe.count}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">CLARITY SCORE:</span>
                        <span className="font-bold text-emerald-700">{pipe.avgClarity}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">AVG SNR:</span>
                        <span className="font-bold text-teal-800">+{pipe.avgSnr} dB</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </section>
  );
};
