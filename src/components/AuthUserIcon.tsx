import React from "react";

interface AuthUserIconProps {
  className?: string;
  size?: number;
  badgeSize?: number;
}

/**
 * Exact replica of the user avatar icon shown in user reference (Image 2):
 * - Light-blue silhouette avatar (head + rounded shoulders)
 * - Orange circular badge with bold white forward chevron arrow in bottom-right corner
 */
export const AuthUserIcon: React.FC<AuthUserIconProps> = ({
  className = "",
  size = 24,
  badgeSize = 10,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Blue Person Silhouette */}
        {/* Head */}
        <circle cx="50" cy="28" r="20" fill="#5DADE2" />
        {/* Body / Shoulders with smooth curve */}
        <path
          d="M14 88C14 66 30 52 50 52C70 52 86 66 86 88C86 91 84 93 80 93H20C16 93 14 91 14 88Z"
          fill="#5DADE2"
        />

        {/* Orange Circular Badge in Bottom Right */}
        <circle cx="72" cy="74" r="21" fill="#FFFFFF" />
        <circle cx="72" cy="74" r="18" fill="#F05A28" />

        {/* White Forward Chevron Arrow inside Orange Badge */}
        <path
          d="M68 64L78 74L68 84"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
