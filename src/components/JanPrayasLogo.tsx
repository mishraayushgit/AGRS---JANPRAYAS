import React from "react";

interface JanPrayasLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Pixel-perfect rendition of the official Jan Prayas brand header:
 * - Circular emblem with AI circuit tracks, Saffron & Green outer arcs, Ashoka Chakra,
 *   3 citizens with blue speech bubble, cradled by deep blue hand with "AI" chip.
 * - Tricolor vertical divider line.
 * - Dual-language typography: "जनप्रयास" (Green Devanagari with orange bindi/dot over yaan),
 *   "JANPRAYAS" (Navy bold Latin font), blue circuit pill ribbon "[AI] AI-POWERED GRIEVANCE REDRESSAL SYSTEM".
 * - Bold wide subline: "AI GRIEVANCE REDRESSAL SYSTEM" centered underneath.
 */
export const JanPrayasLogo: React.FC<JanPrayasLogoProps> = ({
  className = "",
  size = "md",
}) => {
  const scaleStyles = {
    sm: {
      emblemSize: "w-8 h-8 sm:w-9 sm:h-9",
      dividerHeight: "h-7 sm:h-8",
      hindiText: "text-[15px] sm:text-[17px]",
      dotSize: "w-1.5 h-1.5 -top-1",
      englishText: "text-[11px] sm:text-[12px]",
      ribbonText: "text-[6.5px] sm:text-[7px]",
      aiBadge: "text-[5.5px] px-0.5",
      subTitle: "text-[8.5px] sm:text-[9.5px] tracking-[0.24em] mt-0.5",
    },
    md: {
      emblemSize: "w-10 h-10 sm:w-11 sm:h-11",
      dividerHeight: "h-9 sm:h-10",
      hindiText: "text-[18px] sm:text-[20px]",
      dotSize: "w-1.5 h-1.5 -top-1.5",
      englishText: "text-[13px] sm:text-[14px]",
      ribbonText: "text-[7.5px] sm:text-[8px]",
      aiBadge: "text-[6px] px-0.5",
      subTitle: "text-[10px] sm:text-[11px] tracking-[0.24em] mt-1",
    },
    lg: {
      emblemSize: "w-12 h-12 sm:w-14 sm:h-14",
      dividerHeight: "h-11 sm:h-12",
      hindiText: "text-[22px] sm:text-[24px]",
      dotSize: "w-2 h-2 -top-1.5",
      englishText: "text-[15px] sm:text-[17px]",
      ribbonText: "text-[9px] sm:text-[10px]",
      aiBadge: "text-[7px] px-1",
      subTitle: "text-[12px] sm:text-[13px] tracking-[0.24em] mt-1.5",
    },
  }[size];

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      {/* Top Main Row: Emblem + Tricolor Divider + Typography Stack */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Left Emblem Icon (High Precision SVG Vector) */}
        <div className={`relative shrink-0 ${scaleStyles.emblemSize}`}>
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xs"
          >
            {/* AI Circuit Nodes & Tracks on Left */}
            <path
              d="M10 40H26M6 60H20M13 80H26"
              stroke="#0284C7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="10" cy="40" r="3.5" fill="#0284C7" />
            <circle cx="6" cy="60" r="3.5" fill="#0284C7" />
            <circle cx="13" cy="80" r="3.5" fill="#0284C7" />

            {/* Saffron Top Arc */}
            <path
              d="M34 44C40 26 58 17 76 21C84 23 91 28 96 35"
              stroke="#FF7722"
              strokeWidth="7.5"
              strokeLinecap="round"
            />

            {/* Ashoka Chakra Motif Top-Right */}
            <circle cx="98" cy="34" r="9.5" stroke="#000088" strokeWidth="2.5" fill="#FFFFFF" />
            <circle cx="98" cy="34" r="2.5" fill="#000088" />
            <path
              d="M98 25V43M89 34H107M92 28L104 40M92 40L104 28"
              stroke="#000088"
              strokeWidth="1.2"
            />

            {/* Green Bottom Arc */}
            <path
              d="M48 88C64 96 84 94 96 82C100 78 103 72 105 66"
              stroke="#138808"
              strokeWidth="7.5"
              strokeLinecap="round"
            />

            {/* Central People & Message Bubble */}
            {/* Message Bubble above center person */}
            <rect x="52" y="32" width="20" height="13" rx="3" fill="#0284C7" />
            <polygon points="56,45 61,45 56,49" fill="#0284C7" />
            <circle cx="57" cy="38" r="1.5" fill="#FFFFFF" />
            <circle cx="62" cy="38" r="1.5" fill="#FFFFFF" />
            <circle cx="67" cy="38" r="1.5" fill="#FFFFFF" />

            {/* Center Citizen */}
            <circle cx="62" cy="53" r="5.5" fill="#0F172A" />
            <path
              d="M51 72C51 63 56 60 62 60C68 60 73 63 73 72"
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Left Citizen */}
            <circle cx="45" cy="57" r="4" fill="#334155" />
            <path
              d="M37 72C37 66 41 64 46 64"
              stroke="#334155"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Right Citizen */}
            <circle cx="79" cy="57" r="4" fill="#334155" />
            <path
              d="M78 64C83 64 87 66 87 72"
              stroke="#334155"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Caring Hand cradling underneath */}
            <path
              d="M22 76C22 76 33 85 45 92C55 99 72 103 88 97C98 93 104 85 104 85C104 85 94 92 82 92C68 92 50 84 42 76C36 70 22 76 22 76Z"
              fill="#005A9C"
            />
            {/* AI Chip Node on Hand */}
            <circle cx="28" cy="74" r="8" fill="#003B6F" stroke="#38BDF8" strokeWidth="1.5" />
            <text
              x="28"
              y="77.5"
              fill="#FFFFFF"
              fontSize="7.5"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              AI
            </text>
          </svg>
        </div>

        {/* Tricolor Vertical Divider Line */}
        <div className={`flex flex-col justify-between w-[3px] ${scaleStyles.dividerHeight} rounded-full overflow-hidden shrink-0`}>
          <div className="h-1/3 w-full bg-[#FF7722]" />
          <div className="h-1/3 w-full bg-slate-300 relative flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#000088]" />
          </div>
          <div className="h-1/3 w-full bg-[#138808]" />
        </div>

        {/* Text Stack */}
        <div className="flex flex-col justify-center min-w-0">
          {/* Hindi Devanagari: जनप्रयास */}
          <div className="flex items-center leading-none">
            <span className={`${scaleStyles.hindiText} font-black tracking-tight text-[#15803D] font-sans`}>
              जन
            </span>
            <span className={`${scaleStyles.hindiText} font-black tracking-tight text-[#15803D] font-sans relative`}>
              प्र
              <span className="relative inline-block">
                या
                {/* Saffron Dot above Yaan */}
                <span className={`absolute ${scaleStyles.dotSize} left-1/2 -translate-x-1/2 rounded-full bg-[#FF7722] shadow-xs`} />
              </span>
              स
            </span>
          </div>

          {/* English: JANPRAYAS */}
          <div className={`${scaleStyles.englishText} font-black tracking-[0.14em] text-[#0F2942] font-sans leading-none mt-0.5`}>
            JANPRAYAS
          </div>

          {/* Blue Circuit Pill Ribbon: [AI] AI-POWERED GRIEVANCE REDRESSAL SYSTEM */}
          <div className="flex items-center mt-0.5">
            <div className="inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full bg-gradient-to-r from-[#007A99] via-[#0284C7] to-[#007A99] text-white shadow-2xs">
              <span className={`${scaleStyles.aiBadge} py-[0.5px] rounded bg-white text-[#007A99] font-black font-mono leading-none`}>
                AI
              </span>
              <span className={`${scaleStyles.ribbonText} font-mono font-bold tracking-wider uppercase whitespace-nowrap leading-none`}>
                AI-POWERED GRIEVANCE REDRESSAL SYSTEM
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Subtitle Line: AI GRIEVANCE REDRESSAL SYSTEM (Matching Image Reference exactly) */}
      <div className="w-full text-center">
        <span className={`${scaleStyles.subTitle} font-mono font-black text-black uppercase block leading-none`}>
          AI GRIEVANCE REDRESSAL SYSTEM
        </span>
      </div>
    </div>
  );
};
