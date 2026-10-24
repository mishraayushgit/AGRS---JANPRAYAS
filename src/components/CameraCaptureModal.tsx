import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  RotateCcw,
  Check,
  SwitchCamera,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string, fileName: string) => void;
  title?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = "Capture Incident Evidence Photo",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Check available video devices
  useEffect(() => {
    if (!isOpen) return;

    const checkDevices = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          setHasMultipleCameras(videoInputs.length > 1);
        }
      } catch {
        // Ignore enumerate devices errors
      }
    };
    checkDevices();
  }, [isOpen]);

  // Start camera stream
  useEffect(() => {
    if (!isOpen || capturedImage) return;

    let isMounted = true;
    setIsInitializing(true);
    setCameraError(null);

    const startCamera = async () => {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in this browser.");
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          // Fallback to any available video input
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsInitializing(false);
      } catch (err: any) {
        if (!isMounted) return;
        setIsInitializing(false);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError("Camera permission was denied. Please allow camera access in your browser address bar.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setCameraError("No physical camera device detected on your system.");
        } else {
          setCameraError("Unable to access camera feed. Please check device permissions or upload an image file.");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode, capturedImage]);

  // Clean up stream on close
  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCapturedImage(null);
    setCameraError(null);
    onClose();
  };

  // Toggle Front / Back Camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Take Snapshot from Video
  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flash animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    // If front camera, horizontally flip canvas for mirror effect
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    setCapturedImage(dataUrl);

    // Stop video stream while reviewing snapshot
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
  };

  // Confirm photo
  const handleConfirmPhoto = () => {
    if (!capturedImage) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `live_capture_${timestamp}.jpg`;
    onCapture(capturedImage, fileName);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans">{title}</h3>
              <div className="text-[10px] font-mono text-slate-400">
                {capturedImage ? "PHOTO CAPTURED &bull; REVIEW" : "LIVE CAMERA FEED &bull; 1080P"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!capturedImage && hasMultipleCameras && (
              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] bg-black flex items-center justify-center overflow-hidden">
          
          {/* Flash Effect on capture */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-ping opacity-80" />
          )}

          {capturedImage ? (
            /* Review Captured Still */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedImage}
                alt="Captured incident snapshot"
                className="max-h-[60vh] w-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-teal-600/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                ✓ Photo Ready
              </div>
            </div>
          ) : cameraError ? (
            /* Error State with fallback options */
            <div className="p-6 text-center space-y-4 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-rose-900/40 border border-rose-700/50 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {cameraError}
                </p>
              </div>

              {/* Sample presets fallback */}
              <div className="pt-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">
                  Or load high-resolution incident sample:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onCapture(
                        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
                        "road_crater_pothole.jpg"
                      );
                      handleClose();
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-900/60 border border-slate-700 text-[10px] font-mono text-teal-300 text-center cursor-pointer"
                  >
                    🚧 Road Crater
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCapture(
                        "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
                        "pipeline_water_leak.jpg"
                      );
                      handleClose();
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-900/60 border border-slate-700 text-[10px] font-mono text-teal-300 text-center cursor-pointer"
                  >
                    🚰 Water Leak
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCapture(
                        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
                        "live_wire_hazard.jpg"
                      );
                      handleClose();
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-900/60 border border-slate-700 text-[10px] font-mono text-teal-300 text-center cursor-pointer"
                  >
                    ⚡ Power Hazard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Live Camera Video Feed */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full max-h-[60vh] object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />

              {/* Viewfinder crosshairs overlay */}
              <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-l-2 border-teal-400 absolute top-0 left-0 rounded-tl-lg" />
                <div className="w-12 h-12 border-t-2 border-r-2 border-teal-400 absolute top-0 right-0 rounded-tr-lg" />
                <div className="w-12 h-12 border-b-2 border-l-2 border-teal-400 absolute bottom-0 left-0 rounded-bl-lg" />
                <div className="w-12 h-12 border-b-2 border-r-2 border-teal-400 absolute bottom-0 right-0 rounded-br-lg" />
                
                <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  ALIGN DAMAGE EVIDENCE IN FRAME
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                  <div className="text-xs font-mono text-teal-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>STARTING CAMERA SENSOR...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls Bar */}
        <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETAKE PHOTO</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-900/40"
              >
                <Check className="w-4 h-4" />
                <span>USE THIS PHOTO</span>
              </button>
            </>
          ) : (
            <>
              <div className="text-xs font-mono text-slate-400 hidden sm:block">
                Tap shutter to capture site condition
              </div>

              <div className="flex items-center gap-3 mx-auto sm:mx-0">
                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  disabled={isInitializing || !!cameraError}
                  className="w-14 h-14 rounded-full bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-1 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="Capture Photo"
                >
                  <div className="w-11 h-11 rounded-full border-2 border-slate-900 bg-red-600 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer border border-slate-700"
              >
                CANCEL
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
