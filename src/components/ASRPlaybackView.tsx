import React from "react";
import { Activity, Clock, Play, Pause, Volume2, Mic, Radio } from "lucide-react";
import { ASRMetadata } from "../types";

interface ASRPlaybackViewProps {
  asrMetadata: ASRMetadata;
  activePlaybackSec: number;
  isPlayingAudio: boolean;
  onTogglePlayback: () => void;
}

export const ASRPlaybackView: React.FC<ASRPlaybackViewProps> = ({
  asrMetadata,
  activePlaybackSec,
  isPlayingAudio,
  onTogglePlayback,
}) => {
  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white border border-indigo-200/80 shadow-2xs font-sans">
      
      {/* Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold block">
              WHISPERX PHONETIC CTC &amp; VAD TELEMETRY
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Zero-egress Wav2Vec2 force-alignment
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full font-bold uppercase">
          {asrMetadata.engine || "WhisperX-Large-v3 INT8"}
        </span>
      </div>

      {/* 4 Metric KPI Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">VAD Ratio</div>
          <div className="text-emerald-700 font-black text-sm mt-0.5">
            {(((asrMetadata.vad_speech_ratio ?? 0.94)) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">SNR (dB)</div>
          <div className="text-indigo-700 font-black text-sm mt-0.5">
            {asrMetadata.snr_db ?? 26.4} dB
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">Lang Conf</div>
          <div className="text-sky-700 font-black text-sm mt-0.5">
            {(((asrMetadata.language_confidence ?? 0.99)) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-[9px] text-slate-400 uppercase font-bold">Speakers</div>
          <div className="text-amber-700 font-black text-sm mt-0.5">
            {asrMetadata.speaker_count ?? 1} Tracked
          </div>
        </div>
      </div>

      {/* Forced Phoneme Word-by-Word Timeline Controls */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Duration: <strong className="text-slate-800">{asrMetadata.duration_seconds || 6.2}s</strong></span>
          </div>
          
          <button
            type="button"
            onClick={onTogglePlayback}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1120] hover:bg-[#15233e] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3 h-3 text-teal-400" />
                <span>Pause Karaoke</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-teal-400" />
                <span>Play Phoneme Sync ({(activePlaybackSec ?? 0).toFixed(1)}s)</span>
              </>
            )}
          </button>
        </div>

        {/* Word Chips with Active Time Highlighting */}
        {asrMetadata.word_segments && asrMetadata.word_segments.length > 0 && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap gap-1.5">
            {asrMetadata.word_segments.map((w, idx) => {
              const isWordActive =
                activePlaybackSec >= w.start && activePlaybackSec <= w.end;
              const isPassed = activePlaybackSec > w.end;

              return (
                <span
                  key={idx}
                  className={`text-xs px-2 py-0.5 rounded transition-all font-mono ${
                    isWordActive
                      ? "bg-indigo-600 text-white font-bold shadow-xs scale-105"
                      : isPassed
                      ? "text-slate-700 bg-indigo-50 border border-indigo-100"
                      : "text-slate-400 bg-white border border-slate-200"
                  }`}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
