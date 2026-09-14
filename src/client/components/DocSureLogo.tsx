/**
 * DocSure AI - Official Brand Logo Component
 * Renders the official brand identity:
 * - Document with folded corner
 * - Deep emerald green biometric fingerprint
 * - 3D Golden shield with white verification checkmark
 * - Serif DocSure (emerald) + AI (gold) typography
 * - "TRUST IN EVERY DOCUMENT" & "VERIFY • PROTECT • EMPOWER"
 */

import React, { useState } from 'react';

export interface DocSureLogoProps {
  /**
   * Display variant:
   * - 'navbar': Compact horizontal lockup with emblem and text, optimized for headers (height ~40px)
   * - 'full': Complete vertical brand presentation with emblem, typography, tagline & pillars
   * - 'mark': Standalone emblem icon only (for avatars, badges, compact buttons)
   * - 'horizontal': Medium horizontal lockup with emblem and tagline
   */
  variant?: 'navbar' | 'full' | 'mark' | 'horizontal';
  /**
   * Size presets
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional custom class for container
   */
  className?: string;
  /**
   * Use image asset directly (with vector SVG fallback on error)
   */
  preferImage?: boolean;
}

export const DocSureLogo: React.FC<DocSureLogoProps> = ({
  variant = 'navbar',
  size = 'md',
  className = '',
  preferImage = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Pixel sizing helpers
  const iconSizes = {
    sm: 28,
    md: 40,
    lg: 64,
    xl: 96,
  };

  const currentIconSize = iconSizes[size];

  /**
   * Pure Scalable Vector Graphic (SVG) Emblem matching official brand identity
   */
  const renderVectorEmblem = (width: number, height: number) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none drop-shadow-xs"
      aria-label="DocSure AI Emblem"
    >
      <defs>
        {/* Emerald gradients */}
        <linearGradient id="dsEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B6B5E" />
          <stop offset="60%" stopColor="#063F3A" />
          <stop offset="100%" stopColor="#042C29" />
        </linearGradient>

        <linearGradient id="dsPaperFold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2ECE9" />
          <stop offset="100%" stopColor="#A8C2BD" />
        </linearGradient>

        {/* 3D Gold Shield Gradients */}
        <linearGradient id="dsGoldShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7E294" />
          <stop offset="35%" stopColor="#DDB146" />
          <stop offset="70%" stopColor="#B3861B" />
          <stop offset="100%" stopColor="#7E5C0C" />
        </linearGradient>

        <linearGradient id="dsGoldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F5D77F" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#A0720C" stopOpacity="0.9" />
        </linearGradient>

        <filter id="dsShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" floodColor="#063F3A" />
        </filter>
        <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" floodColor="#7E5C0C" />
        </filter>
      </defs>

      {/* Document Sheet Silhouette with Folded Corner */}
      <path
        d="M26 12 C24 12 22 14 22 16 L22 102 C22 105 24 107 27 107 L85 107 C88 107 90 105 90 102 L90 32 L68 12 Z"
        fill="#FFFFFF"
        stroke="url(#dsEmerald)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Folded Top-Right Corner */}
      <path
        d="M68 12 L90 34 L70 34 C68.8 34 68 33.2 68 32 Z"
        fill="url(#dsPaperFold)"
        stroke="url(#dsEmerald)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Fingerprint Ridge Pattern in Deep Emerald */}
      <g stroke="url(#dsEmerald)" strokeWidth="4.2" strokeLinecap="round" fill="none" opacity="0.95">
        {/* Outermost Ridge */}
        <path d="M34 68 C34 46 44 34 58 34 C72 34 80 46 80 60" />
        {/* 2nd Ridge */}
        <path d="M40 73 C40 50 48 40 58 40 C68 40 75 48 75 58" />
        {/* 3rd Ridge */}
        <path d="M46 78 C46 54 52 46 58 46 C64 46 70 52 70 60" />
        {/* 4th Ridge */}
        <path d="M52 82 C52 62 55 52 58 52 C61 52 64 57 64 64" />
        {/* Inner core loop */}
        <path d="M58 84 C58 72 58 60 58 58" />
        {/* Lower branch arcs */}
        <path d="M34 76 C35 83 38 88 42 93" />
        <path d="M38 83 C39 88 42 92 46 96" />
      </g>

      {/* 3D Golden Shield on Lower-Right Corner */}
      <g filter="url(#shieldGlow)">
        {/* Outer Shield Rim */}
        <path
          d="M66 52 C76 52 88 48 94 44 C94 65 92 82 80 94 C68 82 66 65 66 52 Z"
          fill="url(#dsGoldShield)"
          stroke="url(#dsGoldHighlight)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Inner Shield Bevel Accent */}
        <path
          d="M69 54 C76 54 86 51 91 48 C91 64 89 78 80 88 C71 78 69 64 69 54 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          opacity="0.4"
        />
        {/* White Verification Checkmark */}
        <path
          d="M73 66 L78 72 L87 58"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  // Render emblem: try image first, fallback to vector SVG
  const renderEmblem = () => {
    if (preferImage && !imageError) {
      return (
        <div
          className="relative shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-xs"
          style={{ width: currentIconSize, height: currentIconSize }}
        >
          <img
            src="/favicon.png"
            alt="DocSure AI Icon"
            className="w-full h-full object-contain p-0.5"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
    return renderVectorEmblem(currentIconSize, currentIconSize);
  };

  // Full Variant: Emblem + Brand typography + Tagline + Pillars
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center space-y-3 ${className}`}>
        {/* Main Logo Graphic (Image or Vector) */}
        {!imageError ? (
          <div className="relative group p-1 transition-transform duration-300 hover:scale-[1.02]">
            <img
              src="/logo.png"
              alt="DocSure AI Official Logo"
              className="max-h-56 sm:max-h-64 w-auto object-contain drop-shadow-md rounded-2xl"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white rounded-3xl shadow-lg border border-[#657572]/15">
              {renderVectorEmblem(110, 110)}
            </div>
            {/* Typography */}
            <div className="space-y-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#063F3A]">
                DocSure <span className="text-[#C89B3C]">AI</span>
              </h1>
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#102321]">
                TRUST IN EVERY DOCUMENT
              </p>
              <div className="w-16 h-0.5 bg-[#C89B3C] mx-auto my-2 rounded-full" />
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#657572] font-semibold">
                VERIFY &nbsp;•&nbsp; PROTECT &nbsp;•&nbsp; EMPOWER
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standalone Mark Only (e.g. for small cards or avatar icons)
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // Horizontal Lockup
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        {renderEmblem()}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-xl text-[#063F3A] tracking-tight">
              DocSure
            </span>
            <span className="font-serif font-bold text-xl text-[#C89B3C]">AI</span>
          </div>
          <span className="text-[9px] uppercase font-mono tracking-widest text-[#657572] font-semibold">
            Trust In Every Document
          </span>
        </div>
      </div>
    );
  }

  // Default: Navbar Lockup (Compact and responsive)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {renderEmblem()}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-lg sm:text-xl text-[#063F3A] tracking-tight leading-none">
            DocSure<span className="text-[#C89B3C] ml-1">AI</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 bg-[#063F3A]/5 text-[#0B6B5E] rounded font-semibold border border-[#0B6B5E]/20">
            Enterprise
          </span>
        </div>
        <span className="text-[9px] uppercase font-mono tracking-widest text-[#657572] font-medium leading-tight mt-0.5 hidden xs:block">
          Trust In Every Document
        </span>
      </div>
    </div>
  );
};
