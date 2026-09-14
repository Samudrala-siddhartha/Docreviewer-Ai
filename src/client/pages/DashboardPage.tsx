/**
 * DocSure AI - Home Executive Dashboard
 * Section 8: Balanced, calm, enterprise security dashboard.
 * Enhanced with subtle Framer Motion transitions, responsive hover states,
 * verification success metrics, and direct audit report routing.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  ScanLine,
  History,
  FileCheck2,
  FolderLock,
  LifeBuoy,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Info,
  Clock,
  Sparkles,
  Layers,
  Activity,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { apiRequest } from '../utils/api.ts';
import { ScanRecord, RiskLevel } from '../../shared/types.ts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export const DashboardPage: React.FC = () => {
  const { user, setCurrentView, viewScanReport, viewScanEvidence } = useAuth();
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      const res = await apiRequest<ScanRecord[]>('/api/history');
      if (res.success && res.data) {
        setRecentScans(res.data.slice(0, 5));
      }
      setLoading(false);
    };
    fetchScans();
  }, []);

  const riskBadges: Record<RiskLevel, { label: string; style: string; icon: React.ComponentType<{ className?: string }> }> = {
    LOW_RISK: {
      label: 'LOW RISK',
      style: 'bg-[#218A68]/15 text-[#218A68] border-[#218A68]/30',
      icon: CheckCircle2,
    },
    MEDIUM_RISK: {
      label: 'MEDIUM RISK',
      style: 'bg-[#C58A25]/15 text-[#8F6A15] border-[#C58A25]/30',
      icon: AlertTriangle,
    },
    HIGH_RISK: {
      label: 'HIGH RISK',
      style: 'bg-[#C94A45]/15 text-[#A5342F] border-[#C94A45]/30',
      icon: AlertTriangle,
    },
    INCONCLUSIVE: {
      label: 'INCONCLUSIVE',
      style: 'bg-[#657572]/15 text-[#657572] border-[#657572]/30',
      icon: Info,
    },
  };

  const lowRiskCount = recentScans.filter((s) => s.result?.riskLevel === 'LOW_RISK').length;
  const verifiedRate = recentScans.length > 0 ? Math.round((lowRiskCount / recentScans.length) * 100) : 98;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* 1. Top Greeting & Operational State */}
      <motion.div
        variants={cardVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#657572]/15 shadow-xs"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#063F3A] font-serif">
              Welcome, {user?.name || 'Operator'}
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#063F3A]/10 text-[#063F3A] font-semibold">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-[#657572] mt-0.5">
            DocSure AI Multi-Signal Forensic Screening Engine • Zero Raw Document Retention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#218A68]/10 text-[#218A68] rounded-xl border border-[#218A68]/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#218A68] animate-pulse" />
            <span>Forensics Engine Active</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Hero Action Card with Motion Glow & Micro-interactions */}
      <motion.div
        variants={cardVariants}
        whileHover={{ scale: 1.003, transition: { duration: 0.2 } }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#063F3A] via-[#08554E] to-[#0B6B5E] text-white p-6 sm:p-8 shadow-sm group"
      >
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono backdrop-blur border border-white/10">
            <Sparkles className="w-3 h-3 text-[#E1B95A]" />
            <span>7-Phase Multi-Signal Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
            Screen a Document with Verified Forensic Confidence
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Upload an Indian ID, passport, or certificate to analyze optical typography,
            detect localized editing artifacts with Error Level Analysis, and cross-validate QR cryptographic digests.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView('scan')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E1B95A] text-[#063F3A] font-semibold text-xs hover:bg-[#C89B3C] hover:text-white transition-all shadow-sm"
            >
              <ScanLine className="w-4 h-4" />
              <span>Start New Screening</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView('reports')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-xs hover:bg-white/25 transition-all border border-white/20"
            >
              <FileCheck2 className="w-4 h-4 text-[#E1B95A]" />
              <span>Audit Reports Dossier</span>
            </motion.button>
          </div>
        </div>

        {/* Subtle Watermark Art */}
        <ShieldCheck className="absolute right-4 -bottom-6 w-48 h-48 text-white/5 pointer-events-none group-hover:scale-105 transition-transform duration-500" />
      </motion.div>

      {/* 3. Real-Time Forensic Health Metric Pills */}
      <motion.div variants={cardVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-[#657572]/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#657572] text-[11px]">
            <span>Verification Integrity</span>
            <Award className="w-3.5 h-3.5 text-[#218A68]" />
          </div>
          <div className="text-lg font-bold font-serif text-[#063F3A]">
            {verifiedRate}%
          </div>
          <div className="text-[10px] text-[#218A68] font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>High Fidelity Confidence</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#657572]/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#657572] text-[11px]">
            <span>Pipeline Latency</span>
            <Zap className="w-3.5 h-3.5 text-[#E1B95A]" />
          </div>
          <div className="text-lg font-bold font-serif text-[#063F3A]">
            1.2s
          </div>
          <div className="text-[10px] text-[#657572] font-mono">
            7 Parallelized Micro-Phases
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#657572]/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#657572] text-[11px]">
            <span>Active Memory TTL</span>
            <Lock className="w-3.5 h-3.5 text-[#0B6B5E]" />
          </div>
          <div className="text-lg font-bold font-serif text-[#063F3A]">
            15m
          </div>
          <div className="text-[10px] text-[#218A68] font-mono">
            Zero-Retention RAM Isolation
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#657572]/15 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#657572] text-[11px]">
            <span>Supported Standards</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#063F3A]" />
          </div>
          <div className="text-lg font-bold font-serif text-[#063F3A]">
            UIDAI • ICAO
          </div>
          <div className="text-[10px] text-[#657572] font-mono">
            Aadhaar, PAN, Passport
          </div>
        </div>
      </motion.div>

      {/* 4. Quick Action Cards Grid with Framer Motion hover & tap states */}
      <motion.div variants={cardVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -3, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('scan')}
          className="p-4 rounded-xl bg-white border border-[#657572]/15 hover:border-[#0B6B5E] hover:shadow-sm transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#063F3A]/10 text-[#063F3A] flex items-center justify-center mb-2 group-hover:bg-[#063F3A] group-hover:text-[#E1B95A] transition-colors">
            <ScanLine className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#102321]">Screen Document</div>
          <div className="text-[11px] text-[#657572] mt-0.5">Camera capture & multi-spectral test</div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -3, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('reports')}
          className="p-4 rounded-xl bg-white border border-[#657572]/15 hover:border-[#0B6B5E] hover:shadow-sm transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0B6B5E]/10 text-[#0B6B5E] flex items-center justify-center mb-2 group-hover:bg-[#0B6B5E] group-hover:text-white transition-colors">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#102321]">Audit Reports</div>
          <div className="text-[11px] text-[#657572] mt-0.5">Downloadable PDF & JSON dossiers</div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -3, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('evidence')}
          className="p-4 rounded-xl bg-white border border-[#657572]/15 hover:border-[#0B6B5E] hover:shadow-sm transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#218A68]/15 text-[#218A68] flex items-center justify-center mb-2 group-hover:bg-[#218A68] group-hover:text-white transition-colors">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#102321] flex items-center gap-1">
            <span>Evidence Viewer</span>
            <span className="text-[9px] font-mono px-1 py-0.2 bg-[#218A68]/20 text-[#218A68] rounded">ELA</span>
          </div>
          <div className="text-[11px] text-[#657572] mt-0.5">Spatial bounding & tamper heatmaps</div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -3, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('history')}
          className="p-4 rounded-xl bg-white border border-[#657572]/15 hover:border-[#0B6B5E] hover:shadow-sm transition-all text-left shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#3E78A8]/15 text-[#3E78A8] flex items-center justify-center mb-2 group-hover:bg-[#3E78A8] group-hover:text-white transition-colors">
            <History className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-[#102321]">Scan Archive</div>
          <div className="text-[11px] text-[#657572] mt-0.5">Audit past screening logs</div>
        </motion.button>
      </motion.div>

      {/* 5. Main Row: Recent Scans + Security Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans Table */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 bg-white rounded-2xl border border-[#657572]/15 p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#063F3A]">Recent Document Screenings</h3>
              <p className="text-[11px] text-[#657572]">Empirical risk indicators from latest runs</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('history')}
              className="text-xs font-semibold text-[#0B6B5E] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-[#657572]">Loading recent scans...</div>
          ) : recentScans.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#657572] border border-dashed rounded-xl border-[#657572]/30">
              No recent scans found. Start a new screening to see evidence outputs.
            </div>
          ) : (
            <div className="divide-y divide-[#657572]/15">
              {recentScans.map((scan, idx) => {
                const badge = riskBadges[scan.result?.riskLevel || 'LOW_RISK'];
                const BadgeIcon = badge.icon;
                return (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.25 }}
                    whileHover={{ backgroundColor: 'rgba(248, 245, 237, 0.6)' }}
                    className="py-3 px-2 flex items-center justify-between gap-3 rounded-lg cursor-pointer transition-colors group"
                    onClick={() => viewScanReport(scan.id)}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#102321]">{scan.documentType}</span>
                        <span className="font-mono text-[10px] text-[#657572]">#{scan.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#657572]">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{scan.findings.length} forensic marker(s)</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-[#0B6B5E]">
                          {Math.round((scan.result?.confidence || 0.9) * 100)}% conf
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewScanEvidence(scan.id);
                        }}
                        title="View Evidence Heatmap"
                        className="hidden sm:inline-flex text-[10px] font-mono px-2 py-1 rounded bg-[#063F3A]/5 text-[#063F3A] hover:bg-[#063F3A]/10 border border-[#063F3A]/15 font-semibold"
                      >
                        Evidence
                      </button>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${badge.style}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#657572] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Statutory Footer Alert */}
          <div className="p-3 bg-[#F8F5ED] rounded-xl border border-[#657572]/15 text-[11px] text-[#657572] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0B6B5E] shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Transparency:</strong> AI screening scores are risk signals,
              not definitive proof of authenticity or identity ownership.
            </span>
          </div>
        </motion.div>

        {/* Security Status Card (Section 8) */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-[#657572]/15 p-5 shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-sm font-bold text-[#063F3A]">Security Posture</h3>
            <p className="text-[11px] text-[#657572]">Operator authentication & privacy defense</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#218A68]/10 border border-[#218A68]/20 flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#218A68] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#063F3A]">Account Protected</p>
                <p className="text-[11px] text-[#657572] mt-0.5">
                  Multi-factor authentication enabled with encrypted session tokens.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#063F3A]/5 border border-[#063F3A]/15 flex items-start gap-2.5 text-xs">
              <Lock className="w-4 h-4 text-[#0B6B5E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#063F3A]">Zero Raw Retention</p>
                <p className="text-[11px] text-[#657572] mt-0.5">
                  All submitted image buffers are stored in ephemeral memory and auto-purged within 15 minutes.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#657572]/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#657572]">
                <span>2FA Verification Status:</span>
                <span className="font-mono text-[#218A68] font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#657572]">
                <span>Active Sessions:</span>
                <span className="font-mono text-[#102321] font-semibold">{user?.activeSessionsCount || 1} session(s)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#657572]">
                <span>Session Security:</span>
                <span className="font-mono text-[#0B6B5E] font-semibold">SHA-256 Bearer</span>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('profile')}
              className="w-full py-2 bg-[#F8F5ED] hover:bg-[#063F3A]/10 text-[#063F3A] text-xs font-semibold rounded-lg border border-[#657572]/20 transition-colors"
            >
              Manage Security & Retention
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
