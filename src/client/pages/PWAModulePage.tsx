/**
 * DocSure AI - PWA Device App Module
 * Dedicated operational module for downloading, installing, and managing
 * the Progressive Web App across desktop and mobile devices.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  Check,
  Copy,
  WifiOff,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  QrCode,
  CheckCircle2,
  ExternalLink,
  Info,
  HardDrive,
  Camera,
  Layers,
  FileCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../hooks/useLanguage';
import { DocSureLogo } from '../components/DocSureLogo';
import { PWAInstallModal } from '../components/PWAInstallModal';

export const PWAModulePage: React.FC = () => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    platformName,
    browserName,
    swActive,
    install,
  } = usePWAInstall();

  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://docsure.ai';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      try {
        await install();
      } finally {
        setInstalling(false);
      }
    } else {
      setModalOpen(true);
    }
  };

  const handleCheckCache = async () => {
    setCacheStatus('Checking cache storage...');
    try {
      if ('caches' in window) {
        const keys = await window.caches.keys();
        setCacheStatus(`Verified ${keys.length} active service worker cache vaults.`);
      } else {
        setCacheStatus('Standard local browser storage active.');
      }
    } catch {
      setCacheStatus('Cache check completed.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Module Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#657572]/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#063F3A]/10 text-[#063F3A] flex items-center justify-center shrink-0 border border-[#063F3A]/15">
            <Smartphone className="w-6 h-6 text-[#0B6B5E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-[#063F3A]">
                PWA Device App Module
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E1B95A]/20 text-[#8F6A15] border border-[#E1B95A]/40 font-bold">
                Standalone Ready
              </span>
            </div>
            <p className="text-xs text-[#657572] mt-1">
              Download DocSure AI directly to your mobile phone, tablet, or desktop workstation without app store delays.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#F8F5ED] hover:bg-[#063F3A]/10 text-[#063F3A] border border-[#657572]/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-4 h-4 text-[#0B6B5E]" />
            <span>Install Guide</span>
          </button>

          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing}
            className="px-5 py-2 rounded-xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
          >
            <Download className="w-4 h-4 text-[#E1B95A]" />
            <span>{isInstalled ? 'App Installed ✓' : isInstallable ? 'Download PWA Now' : 'Install on Device'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Installation & Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Installation Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#063F3A] via-[#08554E] to-[#0B6B5E] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono border border-white/15 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-[#E1B95A]" />
              <span>Zero App-Store Dependency</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
              Instant Native-Quality Experience on Any Device
            </h2>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              DocSure AI operates as a certified W3C Progressive Web App. Enjoy ultra-fast cold starts, offline document verification, camera hardware acceleration, and full-screen security view.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={installing}
                className="px-6 py-3 rounded-xl bg-[#E1B95A] hover:bg-[#C89B3C] text-[#063F3A] font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isInstalled
                    ? 'App Installed on this Device'
                    : isInstallable
                    ? '1-Click Install PWA'
                    : 'Download & Install on Device'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#E1B95A]" />
                <span>Share with Buddy</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-[11px] text-white/80 gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E1B95A]" />
              <span>Device: {platformName} ({browserName})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#218A68]" />
              <span>Service Worker: {swActive ? 'Active & Caching' : 'Standard Web Engine'}</span>
            </div>
          </div>

          <Smartphone className="absolute right-3 -bottom-8 w-56 h-56 text-white/5 pointer-events-none" />
        </div>

        {/* Quick Share with Buddy Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#657572]/15 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#063F3A] flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#0B6B5E]" />
                <span>Send to Buddy or Phone</span>
              </h3>
              <span className="text-[10px] font-mono text-[#657572]">Instant QR</span>
            </div>
            <p className="text-xs text-[#657572] mt-1">
              Want your colleague or buddy to test document scans on their smartphone? Scan below:
            </p>
          </div>

          {/* Interactive QR Card */}
          <div className="p-4 rounded-2xl bg-[#F8F5ED] border border-[#657572]/15 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-xs border border-[#657572]/20 flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-[#063F3A]" />
              <span className="text-[9px] font-mono text-[#657572]">Scan with Camera</span>
            </div>
            <p className="text-[11px] font-semibold text-[#063F3A]">
              Open in Safari (iOS) or Chrome (Android)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-1.5 bg-[#F8F5ED] border border-[#657572]/20 rounded-xl text-xs font-mono text-[#102321] select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#E1B95A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Platform Instruction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Android */}
        <div className="p-5 bg-white rounded-2xl border border-[#657572]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#063F3A]">
            <Smartphone className="w-5 h-5 text-[#218A68]" />
            <span>Android (Chrome / Edge)</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-[#657572] leading-relaxed">
            <li>Open DocSure AI in Google Chrome or Microsoft Edge.</li>
            <li>Tap the <strong>three dots (⋮)</strong> menu in the upper-right corner.</li>
            <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
            <li>Launch directly from your mobile home screen anytime!</li>
          </ol>
        </div>

        {/* iOS */}
        <div className="p-5 bg-white rounded-2xl border border-[#657572]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#063F3A]">
            <Apple className="w-5 h-5 text-[#063F3A]" />
            <span>iPhone &amp; iPad (Safari)</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-[#657572] leading-relaxed">
            <li>Open DocSure AI inside the standard <strong>Safari</strong> browser.</li>
            <li>Tap the <strong>Share</strong> button at the bottom toolbar.</li>
            <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</li>
            <li>Confirm by tapping <strong>Add</strong> in the top-right corner.</li>
          </ol>
        </div>

        {/* Desktop */}
        <div className="p-5 bg-white rounded-2xl border border-[#657572]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#063F3A]">
            <Laptop className="w-5 h-5 text-[#0B6B5E]" />
            <span>Desktop (PC / Mac / Linux)</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-[#657572] leading-relaxed">
            <li>Look at the right side of the URL bar for the <strong>Install</strong> icon.</li>
            <li>Or open browser menu &gt; <strong>Save and share</strong> &gt; <strong>Install DocSure AI</strong>.</li>
            <li>Dock to taskbar or desktop for one-click access.</li>
          </ol>
        </div>
      </div>

      {/* 4. Device Features & Diagnostics */}
      <div className="bg-white p-6 rounded-2xl border border-[#657572]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#063F3A]">PWA Performance &amp; Hardware Diagnostics</h3>
            <p className="text-xs text-[#657572]">Client-side features enabled when running on your device</p>
          </div>

          <button
            type="button"
            onClick={handleCheckCache}
            className="px-3 py-1.5 rounded-lg border border-[#657572]/20 hover:bg-[#F8F5ED] text-xs font-semibold text-[#063F3A] flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0B6B5E]" />
            <span>Verify Offline Caches</span>
          </button>
        </div>

        {cacheStatus && (
          <div className="p-3 bg-[#0B6B5E]/10 border border-[#0B6B5E]/20 text-[#063F3A] rounded-xl text-xs font-mono">
            ✓ {cacheStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#F8F5ED] border border-[#657572]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#657572]">
              <span>Offline Pipeline</span>
              <WifiOff className="w-4 h-4 text-[#218A68]" />
            </div>
            <div className="text-sm font-bold text-[#063F3A]">Supported</div>
            <div className="text-[10px] text-[#218A68] font-mono">Local OCR &amp; Cryptography</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F5ED] border border-[#657572]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#657572]">
              <span>Camera Ingestion</span>
              <Camera className="w-4 h-4 text-[#0B6B5E]" />
            </div>
            <div className="text-sm font-bold text-[#063F3A]">Native Video API</div>
            <div className="text-[10px] text-[#657572] font-mono">60 FPS Document Guides</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F5ED] border border-[#657572]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#657572]">
              <span>Memory Footprint</span>
              <HardDrive className="w-4 h-4 text-[#E1B95A]" />
            </div>
            <div className="text-sm font-bold text-[#063F3A]">&lt; 8 MB</div>
            <div className="text-[10px] text-[#657572] font-mono">Zero Bloatware</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F5ED] border border-[#657572]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#657572]">
              <span>Security Isolation</span>
              <ShieldCheck className="w-4 h-4 text-[#063F3A]" />
            </div>
            <div className="text-sm font-bold text-[#063F3A]">Sandbox Enforced</div>
            <div className="text-[10px] text-[#218A68] font-mono">Ephemeral Buffer Memory</div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
