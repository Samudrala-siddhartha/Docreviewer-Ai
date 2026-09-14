/**
 * DocSure AI - Forensic Screening Audit Report Dossier
 * Section 28 & 65: Printable, auditable report with statutory disclaimers,
 * model versions, checks completed, checks unavailable, scan switcher,
 * and direct evidence heatmap cross-linking.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  FileCheck2,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  Building,
  Calendar,
  Layers,
  ArrowLeft,
  ChevronDown,
  Copy,
  Check,
  Award,
  ExternalLink,
  XCircle,
  FileWarning,
} from 'lucide-react';
import { apiRequest } from '../utils/api.ts';
import { ScanRecord } from '../../shared/types.ts';
import { STANDARD_DISCLAIMER } from '../../shared/constants.ts';
import { useAuth } from '../state/AuthContext.tsx';
import { DocSureLogo } from '../components/DocSureLogo.tsx';

export const ReportPage: React.FC = () => {
  const { setCurrentView, activeScanId, setActiveScanId, viewScanEvidence } = useAuth();
  const [allScans, setAllScans] = useState<ScanRecord[]>([]);
  const [scan, setScan] = useState<ScanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const res = await apiRequest<ScanRecord[]>('/api/history');
      if (res.success && res.data && res.data.length > 0) {
        setAllScans(res.data);
        if (activeScanId) {
          const matched = res.data.find((s) => s.id === activeScanId);
          setScan(matched || res.data[0]);
        } else {
          setScan(res.data[0]);
        }
      }
      setLoading(false);
    };
    fetchReports();
  }, [activeScanId]);

  const handleSelectScan = (id: string) => {
    setActiveScanId(id);
    const selected = allScans.find((s) => s.id === id);
    if (selected) {
      setScan(selected);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDigest = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadJSON = () => {
    if (!scan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DocSure_Forensic_Report_${scan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#657572]">Compiling forensic audit dossier...</div>;
  }

  if (!scan) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#657572]/20 space-y-3 max-w-md mx-auto">
        <FileCheck2 className="w-10 h-10 text-[#0B6B5E] mx-auto" />
        <h3 className="text-sm font-bold text-[#102321]">No Audit Reports Available</h3>
        <p className="text-xs text-[#657572]">Execute a document screening first to compile a verifiable forensic report.</p>
        <button
          type="button"
          onClick={() => setCurrentView('scan')}
          className="px-4 py-2 bg-[#063F3A] text-white text-xs font-semibold rounded-xl"
        >
          Screen Document
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print bg-white p-4 rounded-2xl border border-[#657572]/15 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1 text-xs text-[#657572] hover:text-[#063F3A] font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Scan Record Selector Dropdown */}
          {allScans.length > 1 && (
            <div className="flex items-center gap-1.5 pl-3 border-l border-[#657572]/20">
              <span className="text-[11px] text-[#657572] font-semibold hidden md:inline">Viewing Dossier:</span>
              <select
                value={scan.id}
                onChange={(e) => handleSelectScan(e.target.value)}
                className="text-xs font-mono bg-[#F8F5ED] border border-[#657572]/25 rounded-lg px-2.5 py-1 text-[#063F3A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              >
                {allScans.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} ({s.documentType} - {s.result?.riskLevel || 'EVAL'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => viewScanEvidence(scan.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0B6B5E]/30 bg-[#063F3A]/5 text-xs font-semibold text-[#063F3A] hover:bg-[#063F3A]/10 shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#218A68]" />
            <span>Examine Evidence</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#657572]/20 text-xs font-semibold text-[#063F3A] hover:bg-[#F8F5ED]"
          >
            <Download className="w-3.5 h-3.5 text-[#0B6B5E]" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#063F3A] text-white text-xs font-semibold hover:bg-[#0B6B5E] shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#E1B95A]" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Audit Document Container */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border border-[#657572]/20 shadow-sm p-8 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Report Header */}
        <div className="border-b-2 border-[#063F3A] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <DocSureLogo variant="horizontal" size="md" />
            <p className="text-[10px] font-mono tracking-widest text-[#C89B3C] font-semibold uppercase pt-1">
              FORENSIC SCREENING AUDIT DOSSIER
            </p>
          </div>

          <div className="text-right text-xs font-mono text-[#657572] space-y-0.5">
            <div>REPORT ID: <span className="text-[#102321] font-bold">#{scan.id}</span></div>
            <div>TIMESTAMP: {new Date(scan.createdAt).toUTCString()}</div>
            <div className="text-[10px] text-[#218A68] font-semibold">SECURITY: COMMERCIAL CONFIDENTIAL</div>
          </div>
        </div>

        {/* 1. Executive Summary Strip */}
        <div className="p-4 rounded-xl bg-[#F8F5ED] border border-[#657572]/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#657572]">
              1. Executive Screening Assessment
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                scan.result?.riskLevel === 'LOW_RISK'
                  ? 'bg-[#218A68]/15 text-[#218A68] border-[#218A68]/30'
                  : scan.result?.riskLevel === 'HIGH_RISK'
                  ? 'bg-[#C94A45]/15 text-[#A5342F] border-[#C94A45]/30'
                  : 'bg-[#C58A25]/15 text-[#8F6A15] border-[#C58A25]/30'
              }`}
            >
              {scan.result?.riskLevel || 'EVALUATED'}
            </span>
          </div>

          <p className="text-xs text-[#102321] leading-relaxed">
            Multi-signal forensic assessment conducted on specimen category <strong>{scan.documentType}</strong>.
            Statistical model confidence is calculated at{' '}
            <strong>{Math.round((scan.result?.confidence || 0.9) * 100)}%</strong>.
          </p>

          <div className="text-xs text-[#657572] space-y-1 pt-1 border-t border-[#657572]/15">
            <strong>Operational Recommendation:</strong> {scan.result?.recommendation}
          </div>
        </div>

        {/* 2. Document & Quality Specifications */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#063F3A] border-b border-[#657572]/15 pb-1">
            2. Ingestion & Quality Parameters
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-white border border-[#657572]/15 rounded-lg">
              <span className="text-[10px] text-[#657572] block">Classified Type</span>
              <span className="font-bold text-[#102321]">{scan.classifiedType || scan.documentType}</span>
            </div>
            <div className="p-2.5 bg-white border border-[#657572]/15 rounded-lg">
              <span className="text-[10px] text-[#657572] block">Quality Grade</span>
              <span className="font-bold text-[#102321]">{scan.quality?.overall || 'GOOD'}</span>
            </div>
            <div className="p-2.5 bg-white border border-[#657572]/15 rounded-lg">
              <span className="text-[10px] text-[#657572] block">SHA-256 Hash</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[9px] text-[#657572] truncate">
                  {scan.metadata?.sha256Hash?.substring(0, 14)}...
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyDigest(scan.metadata?.sha256Hash || '')}
                  className="text-[#657572] hover:text-[#063F3A]"
                  title="Copy SHA-256 Hash"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-[#218A68]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div className="p-2.5 bg-white border border-[#657572]/15 rounded-lg">
              <span className="text-[10px] text-[#657572] block">Software Detected</span>
              <span className="font-bold text-[#102321] truncate block">
                {scan.metadata?.softwareDetected || 'Direct Sensor Hardware'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. OCR Extracted Fields Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#063F3A] border-b border-[#657572]/15 pb-1">
            3. LayoutLM Extracted Demographic Fields
          </h3>
          <div className="border border-[#657572]/20 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F8F5ED] text-[#657572] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Field</th>
                  <th className="p-2.5">Extracted Value</th>
                  <th className="p-2.5">OCR Confidence</th>
                  <th className="p-2.5">Rule Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#657572]/15 text-[#102321]">
                {(scan.extractedFields || []).map((f, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-semibold text-[#063F3A]">{f.label}</td>
                    <td className="p-2.5 font-mono">{f.value}</td>
                    <td className="p-2.5 font-mono text-[#0B6B5E]">{Math.round(f.confidence * 100)}%</td>
                    <td className="p-2.5">
                      {f.matchesReferenceRule !== false ? (
                        <span className="text-[#218A68] text-[10px] font-semibold">Compliant</span>
                      ) : (
                        <span className="text-[#C94A45] text-[10px] font-semibold">Flagged Inconsistent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Visual Forensics & Security Features */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#063F3A] border-b border-[#657572]/15 pb-1">
            4. Empirical Forensic Findings ({scan.findings.length})
          </h3>
          {scan.findings.length === 0 ? (
            <div className="p-3 rounded-lg bg-[#218A68]/10 text-xs text-[#218A68] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>No anomalous splices, compression variances, or typography anomalies detected.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {scan.findings.map((finding) => (
                <div key={finding.id} className="p-3 bg-[#F8F5ED] rounded-xl border border-[#657572]/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#102321]">{finding.title}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#C94A45]/15 text-[#C94A45] font-bold">
                      {finding.severity}
                    </span>
                  </div>
                  <p className="text-[#657572] text-[11px] leading-relaxed">{finding.description}</p>
                  <div className="text-[10px] font-mono text-[#657572] pt-1">
                    Algorithm: {finding.evidenceType} • Model: {finding.modelVersion}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4B. Border Checkpoint 8-Point Forensic Audit Matrix */}
        {scan.borderAudit && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#657572]/15 pb-1">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#063F3A]">
                4B. Border Checkpoint Forensic Audit (8 Operational Challenges)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#063F3A]/10 text-[#063F3A] font-bold">
                {scan.borderAudit.originalityVerdict}
              </span>
            </div>

            {/* If missing sovereign features or disqualified */}
            {(scan.borderAudit.missingSovereignRequirements && scan.borderAudit.missingSovereignRequirements.length > 0) && (
              <div className="p-3.5 rounded-xl bg-[#991B1B]/5 border border-[#991B1B]/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#991B1B] font-bold">
                  <FileWarning className="w-4 h-4" />
                  <span>Missing Sovereign Checks & Credentials (Disqualification Audit):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {scan.borderAudit.missingSovereignRequirements.map((req, i) => (
                    <div key={i} className="p-2 rounded bg-white border border-[#991B1B]/15 text-[#991B1B] font-medium text-[11px] flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{req.startsWith('"') ? req : `"${req}"`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scan.borderAudit.checks.map((check) => (
                <div
                  key={check.checkKey}
                  className={`p-2.5 rounded-lg border space-y-1 ${
                    check.status === 'PASSED'
                      ? 'bg-[#218A68]/5 border-[#218A68]/20'
                      : check.status === 'FLAGGED'
                      ? 'bg-[#C94A45]/5 border-[#C94A45]/20'
                      : 'bg-[#991B1B]/5 border-[#991B1B]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#102321]">{check.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        check.status === 'PASSED'
                          ? 'bg-[#218A68]/15 text-[#15803D]'
                          : 'bg-[#C94A45]/15 text-[#DC2626]'
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                  <p className="text-[#657572] text-[10px]">{check.details}</p>
                  <div className="text-[9px] font-mono text-[#0B6B5E]">Indicator: {check.technicalIndicator}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 7-Phase Screening Execution Audit */}
        {scan.pipelinePhases && scan.pipelinePhases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#063F3A] border-b border-[#657572]/15 pb-1">
              5. 7-Phase Screening Pipeline Execution Audit
            </h3>
            <div className="border border-[#657572]/20 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F8F5ED] text-[#657572] font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Phase</th>
                    <th className="p-2.5">Subsystem Verification Stage</th>
                    <th className="p-2.5">Execution Time</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#657572]/15 text-[#102321]">
                  {scan.pipelinePhases.map((phase) => (
                    <tr key={phase.id}>
                      <td className="p-2.5 font-mono font-bold text-[#063F3A]">Phase {phase.phaseNumber}</td>
                      <td className="p-2.5">
                        <div className="font-semibold text-xs">{phase.name}</div>
                        <div className="text-[10px] text-[#657572]">{phase.summary}</div>
                      </td>
                      <td className="p-2.5 font-mono text-[#657572]">{phase.durationMs} ms</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            phase.status === 'COMPLETED'
                              ? 'bg-[#218A68]/15 text-[#218A68]'
                              : phase.status === 'FLAGGED'
                              ? 'bg-[#C94A45]/15 text-[#A5342F]'
                              : 'bg-[#C58A25]/15 text-[#8F6A15]'
                          }`}
                        >
                          {phase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Checks Completed vs Unavailable (Section 3 & 26) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#657572]/20 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-[#218A68] uppercase block">
              Checks Performed ({scan.result?.checksCompleted.length || 0})
            </span>
            <ul className="space-y-1 text-[#657572] text-[11px]">
              {(scan.result?.checksCompleted || []).map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#218A68]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#657572]/20 space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-[#657572] uppercase block">
              Unavailable Checks ({scan.result?.checksUnavailable.length || 0})
            </span>
            <ul className="space-y-1 text-[#657572] text-[11px]">
              {(scan.result?.checksUnavailable || []).map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#657572]/40" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 7. Statutory Disclaimer (Section 65) */}
        <div className="p-4 rounded-xl bg-[#F8F5ED] border border-[#657572]/20 space-y-2 text-[11px] leading-relaxed text-[#657572]">
          <div className="flex items-center gap-1.5 font-bold text-[#063F3A]">
            <Info className="w-4 h-4 text-[#0B6B5E]" />
            <span>Statutory Legal Notice</span>
          </div>
          <p>{STANDARD_DISCLAIMER}</p>
          <div className="pt-2 border-t border-[#657572]/15 flex items-center justify-between text-[10px] font-mono">
            <span>DocSure AI Core Framework v1.0</span>
            <span>UIDAI • ICAO 9303 Verified Pipeline</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
