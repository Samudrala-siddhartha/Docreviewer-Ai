/**
 * DocSure AI - Reviewer Case Adjudication Console
 * Section 30: Human-in-the-loop manual review workflow for suspicious or disputed cases.
 */

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  FileCheck2,
  UserCheck,
  Search,
} from 'lucide-react';
import { apiRequest } from '../utils/api.ts';
import { ScanRecord, ManualReviewDecision } from '../../shared/types.ts';
import { useAuth } from '../state/AuthContext.tsx';

export const ReviewerPage: React.FC = () => {
  const { user, setCurrentView } = useAuth();
  const [cases, setCases] = useState<ScanRecord[]>([]);
  const [selectedCase, setSelectedCase] = useState<ScanRecord | null>(null);
  const [decision, setDecision] = useState<ManualReviewDecision>('APPROVED');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    const res = await apiRequest<ScanRecord[]>('/api/admin/scans');
    if (res.success && res.data) {
      setCases(res.data);
      if (res.data.length > 0) {
        setSelectedCase(res.data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setSubmitNotice(null);
    const res = await apiRequest(`/api/scans/${selectedCase.id}/decide-review`, {
      method: 'POST',
      body: JSON.stringify({
        decision,
        notes: decisionNotes,
      }),
    });

    if (res.success && res.data) {
      setSubmitNotice(`Review decision logged: ${decision}`);
      setSelectedCase(res.data);
      setCases((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
      setDecisionNotes('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#063F3A] font-serif">Human Forensic Reviewer Desk</h1>
          <p className="text-xs text-[#657572]">
            Independent case adjudication for flagged or disputed identity submissions.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 bg-[#C89B3C]/15 text-[#8F6A15] border border-[#C89B3C]/30 rounded-full font-semibold">
          Reviewer: {user?.name || 'Dr. Priya Sen'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="bg-white rounded-2xl border border-[#657572]/15 p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#063F3A] uppercase tracking-wider">
            Review Queue ({cases.length})
          </h3>
          <div className="divide-y divide-[#657572]/15 max-h-[500px] overflow-y-auto">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCase(c);
                  setSubmitNotice(null);
                }}
                className={`p-3 rounded-lg cursor-pointer text-xs space-y-1 transition-colors ${
                  selectedCase?.id === c.id ? 'bg-[#063F3A]/5 border border-[#0B6B5E]/30' : 'hover:bg-[#F8F5ED]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#102321]">{c.documentType}</span>
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      c.result?.riskLevel === 'HIGH_RISK'
                        ? 'bg-[#C94A45]/15 text-[#A5342F]'
                        : 'bg-[#218A68]/15 text-[#218A68]'
                    }`}
                  >
                    {c.result?.riskLevel}
                  </span>
                </div>
                <div className="text-[10px] text-[#657572] font-mono">#{c.id}</div>
                <div className="text-[10px] text-[#657572]">
                  {c.findings.length} empirical finding(s) • Status: {c.manualReviewStatus || 'PENDING'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Case Inspector & Decision Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#657572]/15 p-6 shadow-xs space-y-5">
          {selectedCase ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#657572]/15 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#063F3A]">
                    Case Inspection: #{selectedCase.id}
                  </h3>
                  <p className="text-xs text-[#657572]">
                    Document: {selectedCase.documentType} • Created: {new Date(selectedCase.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView('evidence')}
                  className="px-3 py-1.5 rounded-lg border border-[#657572]/20 text-xs font-semibold text-[#063F3A] hover:bg-[#F8F5ED]"
                >
                  Open in Heatmap Canvas
                </button>
              </div>

              {submitNotice && (
                <div className="p-3 bg-[#218A68]/10 text-[#218A68] rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{submitNotice}</span>
                </div>
              )}

              {/* Case Findings Summary */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#102321] block">Empirical Model Signals:</span>
                {selectedCase.findings.length === 0 ? (
                  <p className="text-[#218A68] text-[11px]">No severe anomalies detected in visual pipeline.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedCase.findings.map((f) => (
                      <div key={f.id} className="p-2.5 rounded-lg bg-[#F8F5ED] border border-[#657572]/20 text-[11px]">
                        <div className="flex items-center justify-between font-semibold text-[#102321]">
                          <span>{f.title}</span>
                          <span className="font-mono text-[9px] text-[#C94A45]">{f.severity}</span>
                        </div>
                        <p className="text-[#657572] mt-0.5">{f.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviewer Decision Entry */}
              <form onSubmit={handleDecisionSubmit} className="space-y-4 pt-4 border-t border-[#657572]/15 text-xs">
                <div>
                  <label className="block font-bold text-[#102321] mb-2">Adjudication Outcome</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['APPROVED', 'REJECTED', 'NEEDS_MORE_INFORMATION', 'INCONCLUSIVE'] as ManualReviewDecision[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDecision(d)}
                        className={`p-2 rounded-lg border text-center font-semibold text-[11px] transition-all ${
                          decision === d
                            ? 'border-[#063F3A] bg-[#063F3A] text-white shadow-xs'
                            : 'border-[#657572]/20 bg-white text-[#102321] hover:bg-[#F8F5ED]'
                        }`}
                      >
                        {d.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#102321] mb-1">
                    Reviewer Notes & Evidentiary Rationale (Mandatory for Audit Trail)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Enter technical justification, secondary cross-reference notes, or physical re-verification instructions..."
                    className="w-full p-2.5 text-xs rounded-lg border border-[#657572]/20 focus:border-[#0B6B5E] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#063F3A] text-white font-semibold rounded-lg hover:bg-[#0B6B5E] text-xs transition-colors"
                >
                  Record Official Decision in Audit Log
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#657572]">
              Select a case from the queue to begin forensic adjudication.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
