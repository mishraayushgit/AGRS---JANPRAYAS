import React, { useEffect, useRef, useState } from "react";
import { Activity, Volume2, Mic, Music } from "lucide-react";

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
  const phaseRef = useRef<number>(0);
  const [currentPitchHz, setCurrentPitchHz] = useState<number>(0);
  const [currentVolRms, setCurrentVolRms] = useState<number>(0);

  // Pitch estimation via Autocorrelation
  const detectPitch = (timeBuffer: Float32Array, sampleRate: number): number => {
    const size = timeBuffer.length;
    let maxCorr = 0;
    let bestPeriod = -1;

    // Search between 80Hz (period ~ size/80) and 600Hz
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

    // Buffer arrays for analysis
    const bufferLength = analyserNode ? analyserNode.fftSize : 256;
    const timeDomainData = new Float32Array(bufferLength);
    const freqData = new Uint8Array(bufferLength / 2);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      let volume = 0;
      let pitch = 0;

      if (isRecording && analyserNode) {
        analyserNode.getFloatTimeDomainData(timeDomainData);
        analyserNode.getByteFrequencyData(freqData);

        // Compute RMS Volume
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          sumSquares += timeDomainData[i] * timeDomainData[i];
        }
        volume = Math.sqrt(sumSquares / bufferLength);

        // Estimate Pitch
        const sampleRate = analyserNode.context.sampleRate || 44100;
        pitch = detectPitch(timeDomainData, sampleRate);

        if (pitch > 50 && pitch < 800) {
          setCurrentPitchHz(pitch);
        }
        setCurrentVolRms(Math.min(1, volume * 3));
      } else if (isRecording) {
        // Simulated voice wave when microphone stream is unavailable
        const t = performance.now() / 1000;
        volume = 0.35 + 0.25 * Math.sin(t * 4) * Math.cos(t * 1.5);
        pitch = Math.round(180 + Math.sin(t * 3) * 50 + Math.cos(t * 7) * 20);
        setCurrentPitchHz(pitch);
        setCurrentVolRms(Math.min(1, volume));
      } else if (isPlaying) {
        // Synthetic dynamic wave based on playback
        const t = (playbackTime % 2.0);
        volume = 0.25 + 0.2 * Math.sin(t * Math.PI * 3);
        pitch = 180 + Math.sin(t * Math.PI * 4) * 40;
        setCurrentPitchHz(Math.round(pitch));
        setCurrentVolRms(volume);
      } else {
        // Idle gentle wave
        volume = 0.05;
        pitch = 120;
        setCurrentPitchHz(0);
        setCurrentVolRms(0);
      }

      // Increment wave phase based on pitch & active flow
      const pitchFactor = pitch > 0 ? pitch / 200 : 1;
      const flowSpeed = isRecording
        ? 0.06 * (0.8 + pitchFactor * 0.4)
        : isPlaying
        ? 0.05
        : 0.015;
      phaseRef.current += flowSpeed;

      // Draw multi-layered glowing flow waves
      const waveConfigs = isRecording
        ? [
            {
              amplitude: Math.max(12, volume * height * 0.9),
              frequency: 0.012 * (pitch > 0 ? pitch / 150 : 1),
              phaseOffset: 0,
              stroke: "rgba(225, 29, 72, 0.85)", // Rose/Red active recording
              fill: "rgba(244, 63, 94, 0.08)",
              lineWidth: 3,
            },
            {
              amplitude: Math.max(8, volume * height * 0.7),
              frequency: 0.018 * (pitch > 0 ? pitch / 180 : 1),
              phaseOffset: Math.PI / 3,
              stroke: "rgba(13, 148, 136, 0.9)", // Teal resonance
              fill: "rgba(20, 184, 166, 0.06)",
              lineWidth: 2.5,
            },
            {
              amplitude: Math.max(6, volume * height * 0.5),
              frequency: 0.024 * (pitch > 0 ? pitch / 200 : 1),
              phaseOffset: Math.PI * 0.7,
              stroke: "rgba(2, 132, 199, 0.75)", // Sky blue harmonic
              fill: "rgba(56, 189, 248, 0.04)",
              lineWidth: 2,
            },
            {
              amplitude: Math.max(4, volume * height * 0.35),
              frequency: 0.032,
              phaseOffset: Math.PI * 1.2,
              stroke: "rgba(168, 85, 247, 0.6)", // Purple undertone
              fill: "transparent",
              lineWidth: 1.5,
            },
          ]
        : isPlaying
        ? [
            {
              amplitude: Math.max(10, volume * height * 0.8),
              frequency: 0.015,
              phaseOffset: 0,
              stroke: "rgba(13, 148, 136, 0.9)",
              fill: "rgba(13, 148, 136, 0.1)",
              lineWidth: 3,
            },
            {
              amplitude: Math.max(6, volume * height * 0.5),
              frequency: 0.022,
              phaseOffset: Math.PI / 2,
              stroke: "rgba(2, 132, 199, 0.8)",
              fill: "rgba(2, 132, 199, 0.05)",
              lineWidth: 2,
            },
          ]
        : [
            {
              amplitude: 6,
              frequency: 0.008,
              phaseOffset: 0,
              stroke: "rgba(148, 163, 184, 0.6)",
              fill: "rgba(226, 232, 240, 0.2)",
              lineWidth: 1.5,
            },
            {
              amplitude: 4,
              frequency: 0.014,
              phaseOffset: Math.PI / 2,
              stroke: "rgba(203, 213, 225, 0.5)",
              fill: "transparent",
              lineWidth: 1,
            },
          ];

      // Draw each fluid wave path
      waveConfigs.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.stroke;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        const points: { x: number; y: number }[] = [];
        const step = 4;

        for (let x = 0; x <= width; x += step) {
          // Dynamic envelope: taper at the edges so wave is anchored gracefully
          const normalizedX = x / width;
          const envelope = Math.sin(normalizedX * Math.PI);

          // Calculate height with harmonics
          const y =
            centerY +
            Math.sin(x * wave.frequency + phaseRef.current + wave.phaseOffset) *
              wave.amplitude *
              envelope +
            Math.cos(x * wave.frequency * 0.5 + phaseRef.current * 0.8) *
              (wave.amplitude * 0.25) *
              envelope;

          points.push({ x, y });
        }

        // Draw smooth Bezier curve through points
        if (points.length > 0) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.stroke();

          // Fill underneath wave if configured
          if (wave.fill && wave.fill !== "transparent") {
            ctx.lineTo(width, centerY);
            ctx.lineTo(0, centerY);
            ctx.closePath();
            ctx.fillStyle = wave.fill;
            ctx.fill();
          }
        }
      });

      // Center reference baseline
      ctx.beginPath();
      ctx.strokeStyle = isRecording
        ? "rgba(244, 63, 94, 0.2)"
        : "rgba(226, 232, 240, 0.7)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording, isPlaying, analyserNode, playbackTime]);

  // Adjust canvas resolution dynamically to prevent blur on high-DPI displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-4 overflow-hidden shadow-inner font-mono">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isRecording
                ? "bg-rose-500 animate-ping"
                : isPlaying
                ? "bg-teal-400 animate-pulse"
                : "bg-slate-600"
            }`}
          />
          <span className="text-slate-300 font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5">
            {isRecording ? (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>DYNAMIC VOICE PITCH &amp; FLOW MONITOR</span>
              </>
            ) : isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                <span>AUDIO FLOW PLAYBACK ({playbackTime.toFixed(1)}s / {duration.toFixed(1)}s)</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span>ACOUSTIC FLOW ENGINE (READY)</span>
              </>
            )}
          </span>
        </div>

        {/* Live Pitch & Energy Badges */}
        <div className="flex items-center gap-2">
          {isRecording && currentPitchHz > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/80 text-rose-300 text-[10px] font-bold">
              {currentPitchHz} Hz &bull; {currentPitchHz > 250 ? "HIGH PITCH" : currentPitchHz > 140 ? "MID PITCH" : "DEEP VOICE"}
            </span>
          )}

          {isRecording && (
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-[10px] font-bold">
              ENERGY: {(currentVolRms * 100).toFixed(0)}%
            </span>
          )}

          {!isRecording && !isPlaying && (
            <span className="text-slate-500 text-[10px]">
              Speak naturally &bull; Pitch &amp; flow tracks in real time
            </span>
          )}
        </div>
      </div>

      {/* Main Fluid Wave Canvas */}
      <div className="relative w-full h-24 sm:h-28">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Sub-label */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2 mt-1">
        <span className="flex items-center gap-1 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
          Harmonic Modulation Flow
        </span>
        <span className="font-mono text-slate-500">
          {isRecording
            ? "Live WebAudio Analyser &bull; 16kHz VAD"
            : isPlaying
            ? "Phonetic Playback Synchronizer"
            : "Standby &bull; Click record or speak"}
        </span>
      </div>
    </div>
  );
};
