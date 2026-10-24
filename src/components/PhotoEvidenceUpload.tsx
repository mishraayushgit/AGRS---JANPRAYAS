import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { CameraCaptureModal } from "./CameraCaptureModal";

interface PhotoEvidenceUploadProps {
  photoUrl: string | null;
  photoName?: string | null;
  onPhotoChange: (url: string | null, name: string | null) => void;
  readOnly?: boolean;
  label?: string;
}

export const PhotoEvidenceUpload: React.FC<PhotoEvidenceUploadProps> = ({
  photoUrl,
  photoName,
  onPhotoChange,
  readOnly = false,
  label = "PROBLEM PHOTO (SITE EVIDENCE)",
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      onPhotoChange(url, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onPhotoChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-teal-700" />
          <span>{label}</span>
        </div>
        {photoUrl && !readOnly && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[10px] font-mono text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {photoError && (
        <div className="p-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{photoError}</span>
        </div>
      )}

      {/* Main Container */}
      {photoUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group aspect-video sm:aspect-4/3 shadow-2xs">
          <img
            src={photoUrl}
            alt="Site Incident Problem Evidence"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3 opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white">
              <span className="px-2 py-0.5 rounded bg-teal-600/90 text-[10px] font-mono font-bold uppercase tracking-wider">
                VERIFIED SITE EVIDENCE
              </span>
              <span className="text-[10px] font-mono text-slate-300 truncate max-w-[150px]">
                {photoName || "photo.jpg"}
              </span>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>OPEN LIVE CAMERA</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[11px] font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>REPLACE FILE</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className={`rounded-2xl border-2 border-dashed p-4 text-center space-y-3 transition-all ${
            isDragging
              ? "border-teal-500 bg-teal-50/70"
              : "border-slate-300 hover:border-teal-400 bg-slate-50/80 hover:bg-slate-100/70"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <Camera className="w-5 h-5" />
          </div>

          <div>
            <div className="text-xs font-bold text-slate-800">
              Attach Site Problem Photo
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">
              Capture physical damage using live camera or upload photo
            </div>
          </div>

          {!readOnly && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Video className="w-3.5 h-3.5 text-teal-200" />
                <span>TAKE LIVE PHOTO</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>UPLOAD FILE</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          )}

          {/* Demo presets */}
          {!readOnly && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5">
                Quick sample incident photos:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onPhotoChange(
                      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
                      "broken_road_crater.jpg"
                    )
                  }
                  className="p-1.5 rounded bg-white hover:bg-teal-50 border border-slate-200 text-[10px] font-mono text-slate-700 truncate cursor-pointer"
                >
                  🚧 Road Crater
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onPhotoChange(
                      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
                      "pipe_leak_sewage.jpg"
                    )
                  }
                  className="p-1.5 rounded bg-white hover:bg-teal-50 border border-slate-200 text-[10px] font-mono text-slate-700 truncate cursor-pointer"
                >
                  🚰 Water Leak
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onPhotoChange(
                      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
                      "sparking_power_cable.jpg"
                    )
                  }
                  className="p-1.5 rounded bg-white hover:bg-teal-50 border border-slate-200 text-[10px] font-mono text-slate-700 truncate cursor-pointer"
                >
                  ⚡ Live Wire
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Camera Sensor Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl, name) => {
          onPhotoChange(dataUrl, name);
        }}
      />
    </div>
  );
};
