import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Clock,
  Server,
  Zap,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Database,
  Radio,
} from "lucide-react";
import { useGrievance } from "../store/GrievanceContext";

export const SystemHealthPage: React.FC = () => {
  const {
    systemServices,
    aiServices,
    workerStats,
    queueStats,
    systemEvents,
  } = useGrievance();

  return (
    <div className="w-full space-y-12 sm:space-y-16 py-6 sm:py-10">
      
      {/* =========================================================================
          PAGE HEADER & GLOBAL STATUS BANNER
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="space-y-1 border-b border-slate-200 pb-5">
          <div className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">
            INFRASTRUCTURE TELEMETRY &bull; AIR-GAPPED WORKER POOL
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            SYSTEM HEALTH
          </h1>
          <p className="text-sm text-slate-600 font-sans">
            Current status of multimodal processing infrastructure and distributed inference nodes.
          </p>
        </div>

        {/* Overall System Banner */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-black text-slate-900 uppercase">
                  ALL SYSTEMS OPERATIONAL
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-xs text-slate-500 font-sans">
                Acoustic VAD, Vision OCR, and Zero-Shot Classification nodes reporting healthy heartbeats.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-auto">
            <div>
              <div className="text-[10px] text-slate-400">UPTIME (30D)</div>
              <div className="font-bold text-slate-900">99.98%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">AVG INGEST LATENCY</div>
              <div className="font-bold text-teal-700">184ms</div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 1: CORE INFRASTRUCTURE SERVICES
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
              CORE INFRASTRUCTURE SERVICES
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            5 / 5 CLUSTER NODES ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemServices.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-slate-900">
                  {srv.name}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                  {srv.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 font-sans">
                {srv.details}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Latency: <strong className="text-slate-900">{srv.latency_ms}ms</strong></span>
                <span>Uptime: <strong className="text-slate-900">{srv.uptime}</strong></span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: AI SERVICE METRICS (WhisperX, TrOCR, PaddleOCR, Zero-Shot)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-700" />
            <h2 className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
              AI MODEL INFERENCE &amp; EXTRACTION SERVICES
            </h2>
          </div>
          <span className="text-[10px] font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded">
            GPU/CPU HYBRID ACCELERATION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiServices.map((ai) => (
            <div
              key={ai.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                    {ai.modality}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700">
                    ONLINE
                  </span>
                </div>
                <h3 className="text-xs font-mono font-black text-slate-900 uppercase">
                  {ai.name}
                </h3>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-bold text-slate-900">{ai.latency_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-bold text-teal-700">{(((ai.confidence ?? 0.95)) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span className="font-bold text-slate-900">{ai.error_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker:</span>
                  <span className="text-slate-500 truncate max-w-[100px]">{ai.worker_pool}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          SECTION 3: WORKER POOL & CELERY QUEUE STATUS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Worker Pool Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
                  DISTRIBUTED WORKER POOL
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                12 ACTIVE CELERY INSTANCES
              </span>
            </div>

            {/* GPU Pool */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>GPU ACCELERATOR POOL (T4 / A10G)</span>
                <span className="text-teal-700">6 NODES</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded bg-white border border-slate-200 text-center">
                  <div className="text-emerald-700 font-bold">{workerStats.gpu_active}</div>
                  <div className="text-[9px] text-slate-500">ACTIVE</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-center">
                  <div className="text-slate-700 font-bold">{workerStats.gpu_idle}</div>
                  <div className="text-[9px] text-slate-500">IDLE / STANDBY</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-center">
                  <div className="text-slate-400 font-bold">{workerStats.gpu_failed}</div>
                  <div className="text-[9px] text-slate-500">FAILED</div>
                </div>
              </div>
            </div>

            {/* CPU Pool */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>CPU GENERAL INGEST POOL (x86_64)</span>
                <span className="text-teal-700">8 NODES</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded bg-white border border-slate-200 text-center">
                  <div className="text-emerald-700 font-bold">{workerStats.cpu_active}</div>
                  <div className="text-[9px] text-slate-500">ACTIVE</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-center">
                  <div className="text-slate-700 font-bold">{workerStats.cpu_idle}</div>
                  <div className="text-[9px] text-slate-500">IDLE / STANDBY</div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 text-center">
                  <div className="text-slate-400 font-bold">{workerStats.cpu_failed}</div>
                  <div className="text-[9px] text-slate-500">FAILED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Celery Task Queues */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-700" />
                <span className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider">
                  REDIS TASK QUEUES &bull; BUFFER DEPTH
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                0 DROPPED PACKETS
              </span>
            </div>

            <div className="space-y-3">
              {queueStats.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{q.name}</span>
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                      {q.completed.toLocaleString()} COMPLETED
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[10px] text-center pt-1">
                    <div className="p-1.5 rounded bg-white border border-slate-200">
                      <div className="font-bold text-amber-700">{q.waiting}</div>
                      <div className="text-slate-400">WAITING</div>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200">
                      <div className="font-bold text-indigo-700">{q.processing}</div>
                      <div className="text-slate-400">PROCESSING</div>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200">
                      <div className="font-bold text-emerald-700">{q.completed}</div>
                      <div className="text-slate-400">RESOLVED</div>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200">
                      <div className="font-bold text-slate-400">{q.failed}</div>
                      <div className="text-slate-400">ERRORS</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SYSTEM EVENTS CHRONOLOGICAL AUDIT LOG
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
              REAL-TIME SYSTEM EVENTS STREAM
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            CHRONOLOGICAL AUDIT
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden font-mono text-xs shadow-2xs">
          {systemEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">
                  [{evt.timestamp}]
                </span>
                <div>
                  <div className="text-slate-900 font-medium font-sans">
                    {evt.message}
                  </div>
                  {evt.details && (
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {evt.details}
                    </div>
                  )}
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto uppercase whitespace-nowrap ${
                  evt.status === "warning"
                    ? "bg-rose-50 border border-rose-200 text-rose-800"
                    : evt.status === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-slate-100 border border-slate-200 text-slate-700"
                }`}
              >
                {evt.type}
              </span>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
