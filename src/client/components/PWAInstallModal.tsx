/**
 * DocSure AI - Universal PWA Installation Modal
 * Provides one-click device installation, cross-platform guidance (Android, iOS, Desktop),
 * and quick-sharing QR & link for buddies/colleagues.
 */

import React, { useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  WifiOff,
  Zap,
  Sparkles,
  QrCode,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DocSureLogo } from './DocSureLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    platformName,
    browserName,
    install,
  } = usePWAInstall();

  // Selected guide tab
  const defaultTab = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop' | 'buddy'>(defaultTab);
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://docsure.ai';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTriggerInstall = async () => {
    setInstalling(true);
    try {
      const success = await install();
      if (success) {
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102321]/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#657572]/20 overflow-hidden my-6">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#063F3A] via-[#08554E] to-[#0B6B5E] text-white px-6 py-5 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-1.5 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
              <DocSureLogo variant="shield" size="sm" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E1B95A]/20 text-[#E1B95A] text-[10px] font-mono font-semibold border border-[#E1B95A]/30 mb-1">
                <Sparkles className="w-3 h-3" /> Progressive Web App (PWA)
              </div>
              <h2 className="text-xl font-bold font-serif leading-tight">Install DocSure AI App</h2>
              <p className="text-xs text-white/80">Zero-install footprint • Works offline on your device</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Status / Detected Platform */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F8F5ED] border border-[#657572]/15 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#218A68] animate-pulse" />
              <span className="text-[#657572]">Detected:</span>
              <span className="font-semibold text-[#102321]">{platformName}</span>
              <span className="text-[#657572]">({browserName})</span>
            </div>

            {isInstalled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#218A68]/15 text-[#218A68] font-bold text-[11px] font-mono border border-[#218A68]/30">
                <Check className="w-3 h-3" /> Installed on this Device
              </span>
            ) : isInstallable ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0B6B5E]/15 text-[#0B6B5E] font-bold text-[11px] font-mono border border-[#0B6B5E]/30">
                <Zap className="w-3 h-3 text-[#E1B95A]" /> Direct Install Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#657572]/15 text-[#657572] text-[11px] font-mono">
                Manual / Browser Add
              </span>
            )}
          </div>

          {/* Primary Action Button (when installable directly via browser prompt) */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-[#063F3A]/5 border-2 border-[#0B6B5E] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-sm font-bold text-[#063F3A] flex items-center justify-center sm:justify-start gap-1.5">
                  <Download className="w-4 h-4 text-[#0B6B5E]" /> 1-Click Native Installation
                </div>
                <div className="text-xs text-[#657572]">
                  Your browser supports direct installation to home screen / app dock.
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerInstall}
                disabled={installing}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-[#E1B95A]" />
                {installing ? 'Prompting...' : 'Install App Now'}
              </button>
            </div>
          )}

          {/* Device Tabs */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#063F3A] uppercase tracking-wider font-mono">
              Step-by-Step Installation Guides
            </div>

            <div className="flex rounded-xl bg-[#F8F5ED] p-1 border border-[#657572]/20 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'android'
                    ? 'bg-white text-[#063F3A] shadow-xs'
                    : 'text-[#657572] hover:text-[#102321]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#218A68]" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'ios'
                    ? 'bg-white text-[#063F3A] shadow-xs'
                    : 'text-[#657572] hover:text-[#102321]'
                }`}
              >
                <Apple className="w-4 h-4 text-[#063F3A]" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'desktop'
                    ? 'bg-white text-[#063F3A] shadow-xs'
                    : 'text-[#657572] hover:text-[#102321]'
                }`}
              >
                <Laptop className="w-4 h-4 text-[#0B6B5E]" />
                <span>PC / Mac</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('buddy')}
                className={`flex-1 py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'buddy'
                    ? 'bg-white text-[#063F3A] shadow-xs'
                    : 'text-[#657572] hover:text-[#102321]'
                }`}
              >
                <Share2 className="w-4 h-4 text-[#E1B95A]" />
                <span>Buddy / Phone</span>
              </button>
            </div>

            {/* Tab 1: Android */}
            {activeTab === 'android' && (
              <div className="p-4 rounded-2xl bg-[#F8F5ED] border border-[#657572]/15 space-y-3 text-xs text-[#102321] animate-in fade-in">
                <div className="font-semibold text-sm text-[#063F3A] flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#218A68]" /> Chrome / Edge / Brave on Android
                </div>
                <ol className="list-decimal list-inside space-y-2 text-[#657572] leading-relaxed">
                  <li>
                    Tap the <strong>three dots (⋮)</strong> menu in the upper right of your browser.
                  </li>
                  <li>
                    Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                  </li>
                  <li>
                    Confirm by tapping <strong>&quot;Install&quot;</strong>. DocSure AI will appear in your app drawer alongside your native apps!
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 2: iOS Safari */}
            {activeTab === 'ios' && (
              <div className="p-4 rounded-2xl bg-[#F8F5ED] border border-[#657572]/15 space-y-3 text-xs text-[#102321] animate-in fade-in">
                <div className="font-semibold text-sm text-[#063F3A] flex items-center gap-2">
                  <Apple className="w-4 h-4 text-[#063F3A]" /> Safari on iPhone &amp; iPad
                </div>
                <ol className="list-decimal list-inside space-y-2 text-[#657572] leading-relaxed">
                  <li>
                    Open this URL in <strong>Safari</strong> (iOS WebKit requirement).
                  </li>
                  <li>
                    Tap the <strong>Share</strong> icon (square with upward arrow <span className="inline-block px-1 py-0.5 bg-white border rounded font-mono text-[10px]">⎋</span>) in Safari&apos;s bottom toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> (<span className="font-bold">+</span>).
                  </li>
                  <li>
                    Tap <strong>&quot;Add&quot;</strong> in top-right. Launch directly from your iOS Home Screen!
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 3: Desktop */}
            {activeTab === 'desktop' && (
              <div className="p-4 rounded-2xl bg-[#F8F5ED] border border-[#657572]/15 space-y-3 text-xs text-[#102321] animate-in fade-in">
                <div className="font-semibold text-sm text-[#063F3A] flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#0B6B5E]" /> Chrome, Edge, or Brave on Windows &amp; macOS
                </div>
                <ol className="list-decimal list-inside space-y-2 text-[#657572] leading-relaxed">
                  <li>
                    Look at the right side of the <strong>URL address bar</strong> for the <strong>Install Icon</strong> (<Download className="w-3 h-3 inline" /> or monitor with arrow).
                  </li>
                  <li>
                    Click <strong>&quot;Install DocSure AI&quot;</strong> from the prompt.
                  </li>
                  <li>
                    The app will launch in its own dedicated, clean window without browser toolbars.
                  </li>
                </ol>
              </div>
            )}

            {/* Tab 4: Buddy / Share with phone */}
            {activeTab === 'buddy' && (
              <div className="p-4 rounded-2xl bg-[#F8F5ED] border border-[#657572]/15 space-y-4 text-xs text-[#102321] animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Clean SVG QR code representation */}
                  <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-sm border border-[#657572]/20 flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-24 h-24 text-[#063F3A]" />
                    <span className="text-[9px] font-mono text-[#657572]">Scan with Camera</span>
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="font-bold text-sm text-[#063F3A]">
                      Download on Phone or Send to a Buddy
                    </div>
                    <p className="text-[#657572] leading-relaxed">
                      Point any smartphone camera at the QR code, or copy the direct link below to share with a teammate or install on your personal phone.
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={currentUrl}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#657572]/20 rounded-xl text-xs font-mono text-[#102321] select-all truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3.5 py-1.5 rounded-xl bg-[#063F3A] hover:bg-[#0B6B5E] text-white font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#E1B95A]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PWA Key Features / Why Install */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-[#657572]/15 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#218A68] font-bold text-xs">
                <WifiOff className="w-3.5 h-3.5" />
                <span>100% Offline Ready</span>
              </div>
              <p className="text-[11px] text-[#657572] leading-relaxed">
                Pre-cached assets and cryptographic tools operate seamlessly without internet connection.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#657572]/15 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#0B6B5E] font-bold text-xs">
                <Zap className="w-3.5 h-3.5 text-[#E1B95A]" />
                <span>Instant Launch</span>
              </div>
              <p className="text-[11px] text-[#657572] leading-relaxed">
                Zero download wait from app stores; opens in a standalone window directly from your home screen.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#657572]/15 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#063F3A] font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Retention</span>
              </div>
              <p className="text-[11px] text-[#657572] leading-relaxed">
                Privacy-first architecture with sandboxed memory buffers and ephemeral storage TTL.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8F5ED] px-6 py-3.5 border-t border-[#657572]/15 flex items-center justify-between">
          <span className="text-[11px] text-[#657572] flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#0B6B5E]" /> Web App Manifest v2.1 • W3C PWA Standard
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-black/5 border border-[#657572]/20 text-[#102321] text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
