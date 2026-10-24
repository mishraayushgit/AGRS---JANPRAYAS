import React, { useState } from "react";

interface JanPrayasLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

/**
 * Jan Prayas Official Brand Header Logo:
 * Renders the actual official Jan Prayas (AGRS) logo emblem & dual-language typography.
 * Supports "sm" (Header), "md" (Cards/Modals), "lg" (Hero/Login banner).
 */
export const JanPrayasLogo: React.FC<JanPrayasLogoProps> = ({
  className = "",
  size = "md",
  showSubtitle = true,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // Responsive size dimensions
  const heightClass = {
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {!imageError ? (
        <div className="flex items-center">
          <img
            src="/janprayas-logo.png"
            alt="Jan Prayas - National AI Multimodal Grievance Redressal System"
            className={`${heightClass} w-auto object-contain drop-shadow-xs`}
            onError={() => {
              // Try alternate official filename if primary fails
              setImageError(true);
            }}
          />
        </div>
      ) : (
        /* Fallback if PNG asset is unavailable */
        <div className="flex items-center gap-2">
          <img
            src="/jansamadhan-official.png"
            alt="Jan Prayas Emblem"
            className={`${heightClass} w-auto object-contain`}
            onError={() => {
              // Safe inline fallback
            }}
          />
          <div className="flex flex-col justify-center">
            <div className="text-emerald-700 font-black text-base sm:text-lg tracking-tight leading-none">
              जनप्रयास <span className="text-slate-900 font-extrabold text-sm sm:text-base font-sans ml-1">JANPRAYAS</span>
            </div>
            {showSubtitle && (
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-800 uppercase mt-0.5">
                AI GRIEVANCE REDRESSAL SYSTEM
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
