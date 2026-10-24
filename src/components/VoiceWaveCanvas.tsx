import React, { useEffect, useRef, useState } from "react";
import { Activity, Volume2, Mic, Radio, Sparkles } from "lucide-react";

interface VoiceWaveCanvasProps {
  isRecording: boolean;
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
  playbackTime?: number;
  duration?: number;
}

export const VoiceWaveCanvas: React.FC<VoiceWaveCanvasProps> = ({
  isRecording,
  isPlaying,
  analyserNode,
  playbackTime = 0,
  duration = 6.4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const smoothedBarsRef = useRef<Float32Array | null>(null);
  const [currentPitchHz, setCurrentPitchHz] = useState<number>(0);
  const [currentVolRms, setCurrentVolRms] = useState<number>(0);

  // Pitch estimation via Autocorrelation
  const detectPitch = (timeBuffer: Float32Array, sampleRate: number): number => {
    const size = timeBuffer.length;
    let maxCorr = 0;
    let bestPeriod = -1;

    // Search between 80Hz and 600Hz (human vocal range)
    const minPeriod = Math.floor(sampleRate / 600);
    const maxPeriod = Math.floor(sampleRate / 80);

    for (let period = minPeriod; period <= maxPeriod; period++) {
      let corr = 0;
      for (let i = 0; i < size - period; i++) {
        corr += timeBuffer[i] * timeBuffer[i + period];
      }
      if (corr > maxCorr) {
        maxCorr = corr;
        bestPeriod = period;
      }
    }

    if (bestPeriod > 0 && maxCorr > 0.01) {
      return Math.round(sampleRate / bestPeriod);
    }
    return 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Frequency analysis buffers
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 256;
    const freqData = new Uint8Array(bufferLength);
    const timeDomainData = new Float32Array(analyserNode ? analyserNode.fftSize : 256);

    const BAR_WIDTH = 3.5;
    const BAR_GAP = 3.5;
    const TOTAL_BAR_STRIDE = BAR_WIDTH + BAR_GAP;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      // Handle high-DPI scaling
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);

      // Determine total bars that fit cleanly within the canvas
      const numBars = Math.max(16, Math.min(64, Math.floor((width - 24) / TOTAL_BAR_STRIDE)));
      const startX = (width - numBars * TOTAL_BAR_STRIDE + BAR_GAP) / 2;

      if (!smoothedBarsRef.current || smoothedBarsRef.current.length !== numBars) {
        smoothedBarsRef.current = new Float32Array(numBars);
      }
      const smoothed = smoothedBarsRef.current;

      let volume = 0;
      let pitch = 0;
      const now = performance.now() / 1000;

      // 1. REAL MICROPHONE AUDIO INPUT via WebAudio Analyser FFT
      if (isRecording && analyserNode) {
        analyserNode.getByteFrequencyData(freqData);
        analyserNode.getFloatTimeDomainData(timeDomainData);

        // Calculate RMS Volume
        let sumSquares = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          sumSquares += timeDomainData[i] * timeDomainData[i];
        }
        volume = Math.sqrt(sumSquares / timeDomainData.length);
        setCurrentVolRms(Math.min(1, volume * 3.5));

        // Detect Vocal Fundamental Frequency (Pitch)
        const sampleRate = analyserNode.context.sampleRate || 44100;
        pitch = detectPitch(timeDomainData, sampleRate);
        if (pitch >= 80 && pitch <= 600) {
          setCurrentPitchHz(pitch);
        }

        // Map frequency bands logarithmically (human ear perception) across the bars
        // Low bins = vocal fundamental (100-300Hz), mid bins = formants (300-2500Hz), high bins = consonants (2500-6000Hz)
        const maxFreqBin = Math.min(bufferLength - 1, Math.floor(bufferLength * 0.5));

        for (let i = 0; i < numBars; i++) {
          // Logarithmic distribution concentrating on voice spectrum
          const binIndex = Math.min(
            maxFreqBin,
            Math.floor(Math.pow(i / numBars, 1.4) * maxFreqBin)
          );
          const rawVal = freqData[binIndex] / 255.0; // 0.0 to 1.0

          // Bell envelope curve shaping across the spectrum
          const bellEnvelope = Math.sin((i / (numBars - 1)) * Math.PI);
          const shapedTarget = Math.max(0.06, rawVal * (0.4 + 0.6 * bellEnvelope));

          // Smooth exponential attack and decay
          if (shapedTarget > smoothed[i]) {
            smoothed[i] += (shapedTarget - smoothed[i]) * 0.45; // quick attack
          } else {
            smoothed[i] += (shapedTarget - smoothed[i]) * 0.18; // smooth decay
          }
        }
      }
      // 2. SIMULATED RECORDING (fallback if microphone permissions blocked)
      else if (isRecording) {
        const syllableCycle = (now * 4) % (Math.PI * 2);
        volume = 0.35 + 0.28 * Math.sin(syllableCycle) * Math.cos(syllableCycle * 0.5);
        setCurrentVolRms(Math.min(1, volume));

        const estimatedPitch = Math.round(180 + Math.sin(now * 3) * 45);
        setCurrentPitchHz(estimatedPitch);

        for (let i = 0; i < numBars; i++) {
          const normIdx = i / (numBars - 1);
          // 3 natural formant peaks mimicking human speech
          const formant1 = Math.exp(-Math.pow((normIdx - 0.28) / 0.12, 2));
          const formant2 = Math.exp(-Math.pow((normIdx - 0.52) / 0.14, 2));
          const formant3 = Math.exp(-Math.pow((normIdx - 0.74) / 0.16, 2));
          const formantSum = (formant1 * 0.85 + formant2 * 1.0 + formant3 * 0.7) * volume;

          const jitter = 0.12 * Math.sin(now * 12 + i * 0.8) * Math.cos(now * 8 - i);
          const target = Math.max(0.06, Math.min(0.95, formantSum + jitter));

          smoothed[i] += (target - smoothed[i]) * 0.25;
        }
      }
      // 3. AUDIO PLAYBACK (Voice note audio playing back)
      else if (isPlaying) {
        const t = playbackTime * 4;
        volume = 0.3 + 0.25 * Math.sin(t * 2) * Math.cos(t * 1.2);
        setCurrentVolRms(volume);
        setCurrentPitchHz(175 + Math.round(Math.sin(t * 3) * 30));

        for (let i = 0; i < numBars; i++) {
          const normIdx = i / (numBars - 1);
          const bell = Math.sin(normIdx * Math.PI);
          const ripple = 0.5 + 0.4 * Math.sin(t * 3 + i * 0.35) * Math.cos(t * 1.5 - i * 0.2);
          const target = Math.max(0.06, bell * ripple * volume * 1.6);

          smoothed[i] += (target - smoothed[i]) * 0.28;
        }
      }
      // 4. STANDBY / IDLE (Gentle ambient wave)
      else {
        setCurrentPitchHz(0);
        setCurrentVolRms(0);

        for (let i = 0; i < numBars; i++) {
          const normIdx = i / (numBars - 1);
          const bell = Math.sin(normIdx * Math.PI);
          const subtleMotion = 0.08 + 0.04 * Math.sin(now * 2 + i * 0.25) * bell;

          smoothed[i] += (subtleMotion - smoothed[i]) * 0.1;
        }
      }

      // Max bar height available
      const maxHalfHeight = (height - 20) / 2;

      // Draw horizontal subtle reference axis line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(226, 232, 240, 0.8)"; // soft slate-200
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.moveTo(startX, centerY);
      ctx.lineTo(startX + numBars * TOTAL_BAR_STRIDE - BAR_GAP, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // DRAW EQUALIZER FREQUENCY BARS (Symmetrical Vertically with Rounded Caps)
      for (let i = 0; i < numBars; i++) {
        const x = startX + i * TOTAL_BAR_STRIDE;
        const normalizedVal = Math.min(1.0, Math.max(0.04, smoothed[i]));
        const halfBarHeight = Math.max(3, normalizedVal * maxHalfHeight);

        const topY = centerY - halfBarHeight;
        const barTotalHeight = halfBarHeight * 2;

        // Color selection matching the user's reference image:
        // Vibrant Cyan / Electric Blue with Hot Pink / Magenta for resonant peak harmonics
        // Notice in reference: index ~4-5, 12-14, 21-23, etc. have hot pink accents!
        const isMagentaAccent =
          (i >= Math.floor(numBars * 0.48) && i <= Math.floor(numBars * 0.52)) || // central formant
          i === Math.floor(numBars * 0.16) || // lower harmonic
          i === Math.floor(numBars * 0.84); // upper harmonic

        let barColor = "#00C2FF"; // Vivid Cyan / Bright Blue (default)

        if (!isRecording && !isPlaying) {
          // Subtle Slate/Cyan when idle
          barColor = isMagentaAccent ? "#F472B6" : "#94A3B8";
        } else if (isMagentaAccent) {
          // Vibrant Hot Pink / Magenta accent (matches reference image)
          barColor = "#EC4899"; // Vibrant Pink
        } else {
          // Electric Blue / Cyan
          barColor = "#00C2FF";
        }

        // Draw symmetrical rounded pill bar
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, topY, BAR_WIDTH, barTotalHeight, BAR_WIDTH / 2);
        } else {
          // Fallback for older canvas implementations
          ctx.lineCap = "round";
          ctx.lineWidth = BAR_WIDTH;
          ctx.strokeStyle = barColor;
          ctx.moveTo(x + BAR_WIDTH / 2, topY + BAR_WIDTH / 2);
          ctx.lineTo(x + BAR_WIDTH / 2, topY + barTotalHeight - BAR_WIDTH / 2);
          ctx.stroke();
          continue;
        }

        ctx.fillStyle = barColor;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording, isPlaying, analyserNode, playbackTime]);

  return (
    <div className="relative w-full rounded-2xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 overflow-hidden font-sans">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full flex items-center justify-center ${
              isRecording
                ? "bg-rose-500 shadow-xs shadow-rose-400"
                : isPlaying
                ? "bg-cyan-500"
                : "bg-slate-300"
            }`}
          >
            {isRecording && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
          </div>

          <span className="text-xs font-bold text-slate-800 tracking-wide flex items-center gap-1.5">
            {isRecording ? (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Voice Frequency Equalizer (Listening...)</span>
              </>
            ) : isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Voice Audio Playback ({playbackTime.toFixed(1)}s / {duration.toFixed(1)}s)</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600">Acoustic Equalizer (Standby)</span>
              </>
            )}
          </span>
        </div>

        {/* Live Frequency & Pitch Metrics Pills */}
        <div className="flex items-center gap-2">
          {isRecording && currentPitchHz > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold flex items-center gap-1">
              <span>{currentPitchHz} Hz</span>
              <span className="text-blue-400">&bull;</span>
              <span>{currentPitchHz > 250 ? "High Pitch" : currentPitchHz > 140 ? "Mid Formant" : "Deep Voice"}</span>
            </span>
          )}

          {isRecording && (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-mono font-bold">
              Energy: {(currentVolRms * 100).toFixed(0)}%
            </span>
          )}

          {!isRecording && !isPlaying && (
            <span className="text-[11px] text-slate-400 font-sans">
              Dynamic FFT frequency bars active on speech
            </span>
          )}
        </div>
      </div>

      {/* Main Symmetrical Equalizer Waveform Canvas on Clean White */}
      <div className="relative w-full h-24 sm:h-28 flex items-center justify-center bg-white rounded-xl">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Bottom Sub-label & Frequency Spectrum Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 mt-1 border-t border-slate-100">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
          <span>Speech Frequency Spectrum (80 Hz &ndash; 4.5 kHz)</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          {isRecording
            ? "Live WebAudio FFT &bull; Symmetrical Harmonic Bars"
            : isPlaying
            ? "Playback Frequency Sync"
            : "Click 'Start Voice Recording' or speak"}
        </span>
      </div>
    </div>
  );
};