import React from "react";

export interface AuthUserIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Custom Login / Auth Icon matching the user's reference line-art:
 * - Rounded card container
 * - User silhouette (head circle + curved torso with horizontal baseline)
 * - Rightward entry/exit arrow passing through the right border
 * - Unlocked padlock in the bottom-right corner with open shackle & keyhole
 */
export const AuthUserIcon: React.FC<AuthUserIconProps> = ({
  className = "",
  size = 24,
  strokeWidth = 5.5,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 inline-block ${className}`}
      style={{ width: size, height: size }}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Rounded Box (starts at top of lock, runs around perimeter, stops at left of lock) */}
      <path d="M 74 48 V 24 C 74 18.5 69.5 14 64 14 H 26 C 20.5 14 16 18.5 16 24 V 64 C 16 69.5 20.5 74 26 74 H 60" />

      {/* User Silhouette: Head */}
      <circle cx="44" cy="30" r="10" />

      {/* User Silhouette: Torso */}
      <path d="M 23 63 C 23 49 32.5 42 44 42 C 55.5 42 65 49 65 63 H 23 Z" />

      {/* Login Arrow (crosses right border outward) */}
      <path d="M 57 27 H 85" />
      <path d="M 78 20 L 85 27 L 78 34" />

      {/* Unlocked Padlock: Open Shackle (unhooked / lifted on right) */}
      <path d="M 66 48 V 38 C 66 32 76 32 76 38 V 43" />

      {/* Unlocked Padlock: Lock Body */}
      <rect x="60" y="48" width="22" height="24" rx="4" />

      {/* Keyhole */}
      <circle cx="71" cy="56" r="1.8" fill="currentColor" stroke="none" />
      <path d="M 71 58 V 64" strokeWidth={strokeWidth * 0.6} />
    </svg>
  );
};

