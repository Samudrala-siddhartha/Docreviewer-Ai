/**
 * DocSure AI - Splash & Welcome View
 * Establishes enterprise trust, security identity, and fast persona entry for reviewers.
 */

import React from 'react';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { DocSureLogo } from '../components/DocSureLogo.tsx';

export const SplashPage: React.FC = () => {
  const { setCurrentView, quickSwitchDemo } = useAuth();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl w-full text-center space-y-7">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063F3A]/5 border border-[#063F3A]/15 text-xs font-mono text-[#063F3A] mx-auto shadow-xs">
          <Lock className="w-3.5 h-3.5 text-[#0B6B5E]" />
          <span>SIH 2024–2026 Enterprise Security Architecture</span>
        </div>

        {/* Official Brand Logo */}
        <div className="flex justify-center">
          <DocSureLogo variant="full" size="xl" />
        </div>

        {/* Hero Narrative */}
        <div className="space-y-3">
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#657572] leading-relaxed">
            Enterprise AI-assisted document screening and visual forensic platform. Identifies
            suspicious characteristics, typography anomalies, and QR/OCR inconsistencies
            while communicating uncertainty with strict scientific honesty.
          </p>
        </div>

        {/* Core Principles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-white border border-[#657572]/15 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#063F3A]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#218A68]" />
              <span>Honest Uncertainty</span>
            </div>
            <p className="text-[11px] text-[#657572] leading-normal">
              Never claims "100% Genuine" or "100% Fake". Evaluates empirical risk levels.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#657572]/15 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#063F3A]">
              <Lock className="w-3.5 h-3.5 text-[#0B6B5E]" />
              <span>Zero Raw Retention</span>
            </div>
            <p className="text-[11px] text-[#657572] leading-normal">
              Original identity documents are processed ephemerally with strict TTL purge.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#657572]/15 shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#063F3A]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Deterministic Fusion</span>
            </div>
            <p className="text-[11px] text-[#657572] leading-normal">
              Combines visual forensics, cryptographic QR check, and OCR cross-validation.
            </p>
          </div>
        </div>

        {/* Immediate Reviewer Access Actions */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                quickSwitchDemo('USER');
                setCurrentView('scan');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#063F3A] text-white text-sm font-semibold hover:bg-[#0B6B5E] shadow-sm hover:shadow transition-all"
            >
              <span>Launch Screening Pipeline</span>
              <ArrowRight className="w-4 h-4 text-[#E1B95A]" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-5 py-3 rounded-xl bg-white border border-[#657572]/20 text-[#063F3A] text-sm font-semibold hover:bg-[#F8F5ED] transition-colors"
            >
              Enter Dashboard
            </button>
          </div>

          {/* Quick SIH Persona Jump */}
          <div className="pt-3 border-t border-[#657572]/15 max-w-md mx-auto">
            <p className="text-xs font-mono text-[#657572] mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" /> Fast SIH Evaluation Logins:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickSwitchDemo('USER');
                  setCurrentView('home');
                }}
                className="p-2 rounded-lg bg-white border border-[#657572]/20 hover:border-[#0B6B5E] text-left text-xs transition-colors"
              >
                <div className="font-semibold text-[#102321]">User Desk</div>
                <div className="text-[10px] text-[#657572]">Aarav Sharma</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  quickSwitchDemo('REVIEWER');
                  setCurrentView('reviewer');
                }}
                className="p-2 rounded-lg bg-white border border-[#657572]/20 hover:border-[#C89B3C] text-left text-xs transition-colors"
              >
                <div className="font-semibold text-[#8F6A15]">Reviewer Desk</div>
                <div className="text-[10px] text-[#657572]">Dr. Priya Sen</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  quickSwitchDemo('ADMIN');
                  setCurrentView('admin');
                }}
                className="p-2 rounded-lg bg-white border border-[#657572]/20 hover:border-[#C94A45] text-left text-xs transition-colors"
              >
                <div className="font-semibold text-[#A5342F]">Admin Gov</div>
                <div className="text-[10px] text-[#657572]">Chief Architect</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
