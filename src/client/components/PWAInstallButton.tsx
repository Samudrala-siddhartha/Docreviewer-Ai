/**
 * DocSure AI - Universal PWA Install Button
 * Renders in header, dashboard, or inline modules.
 * Direct install when browser allows, or opens guided device install modal.
 */

import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'hero' | 'compact' | 'home';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      setLoading(true);
      try {
        const success = await install();
        if (!success) {
          setShowModal(true);
        }
      } catch {
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled && variant === 'navbar') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#218A68]/30 bg-[#218A68]/10 text-[#218A68] text-xs font-semibold hover:bg-[#218A68]/15 transition-colors ${className}`}
          title="App installed on device • Click for details"
        >
          <Check className="w-3.5 h-3.5" />
          <span>App Installed</span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'hero') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E1B95A] hover:bg-[#C89B3C] text-[#063F3A] font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{isInstalled ? 'App Installed ✓' : isInstallable ? '1-Click Install App' : 'How to Install'}</span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'home') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-60 ${className}`}
        >
          <Download className="w-4 h-4 text-[#E1B95A]" />
          <span>{isInstalled ? 'App Active on Device' : 'Setup PWA'}</span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        title="Download / Install DocSure AI PWA on your device or mobile phone"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#063F3A]/20 bg-[#F8F5ED] hover:bg-[#063F3A]/10 text-[#063F3A] text-xs font-semibold transition-all shadow-2xs active:scale-95 ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 text-[#0B6B5E]" />
        <span className="hidden sm:inline">{isInstallable ? 'Install App' : 'How to Install'}</span>
        <Download className="w-3.5 h-3.5 text-[#E1B95A]" />
      </button>
      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
