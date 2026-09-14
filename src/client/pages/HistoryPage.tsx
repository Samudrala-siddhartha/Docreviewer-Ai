/**
 * DocSure AI - Scan History & Archives
 * Searchable, filterable screening logs with zero sensitive image exposure.
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  FileCheck2,
  Trash2,
} from 'lucide-react';
import { apiRequest } from '../utils/api.ts';
import { ScanRecord, RiskLevel, DocumentType } from '../../shared/types.ts';
import { useAuth } from '../state/AuthContext.tsx';

export const HistoryPage: React.FC = () => {
  const { setCurrentView, viewScanReport, viewScanEvidence } = useAuth();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const fetchHistory = async () => {
    setLoading(true);
    const res = await apiRequest<ScanRecord[]>('/api/history');
    if (res.success && res.data) {
      setScans(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Permanently purge this screening metadata record?')) {
      const res = await apiRequest(`/api/scans/${id}`, { method: 'DELETE' });
      if (res.success) {
        setScans((prev) => prev.filter((s) => s.id !== id));
      }
    }
  };

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || s.result?.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#063F3A] font-serif">Screening Archives</h1>
          <p className="text-xs text-[#657572]">
            Auditable screening log repository with automated GDPR/DPDP purge support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('scan')}
            className="px-4 py-2 bg-[#063F3A] text-white text-xs font-semibold rounded-xl hover:bg-[#0B6B5E]"
          >
            New Screening
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#657572]/15 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#657572] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Scan ID or document category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/20 focus:border-[#0B6B5E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#657572]" />
          <span className="text-[#657572]">Risk Level:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="p-1.5 rounded-lg border border-[#657572]/20 bg-white text-xs text-[#102321] focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW_RISK">Low Risk</option>
            <option value="MEDIUM_RISK">Medium Risk</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="INCONCLUSIVE">Inconclusive</option>
          </select>
        </div>
      </div>

      {/* Scans Table / List */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#657572]">Loading archives...</div>
        ) : filteredScans.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#657572]">No screening records match your filter.</div>
        ) : (
          <div className="divide-y divide-[#657572]/15">
            {filteredScans.map((s) => (
              <div
                key={s.id}
                onClick={() => viewScanReport(s.id)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#F8F5ED]/60 cursor-pointer transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#063F3A]">{s.documentType}</span>
                    <span className="font-mono text-[11px] text-[#657572]">#{s.id}</span>
                    {s.manualReviewStatus && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#C89B3C]/15 text-[#8F6A15] border border-[#C89B3C]/30">
                        Reviewer: {s.manualReviewStatus}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#657572] flex items-center gap-2">
                    <span>{new Date(s.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{s.findings.length} empirical finding(s)</span>
                    <span>•</span>
                    <span>Quality: {s.quality?.overall || 'GOOD'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                      s.result?.riskLevel === 'LOW_RISK'
                        ? 'bg-[#218A68]/15 text-[#218A68] border-[#218A68]/30'
                        : s.result?.riskLevel === 'HIGH_RISK'
                        ? 'bg-[#C94A45]/15 text-[#A5342F] border-[#C94A45]/30'
                        : 'bg-[#C58A25]/15 text-[#8F6A15] border-[#C58A25]/30'
                    }`}
                  >
                    {s.result?.riskLevel || 'EVALUATED'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, s.id)}
                    className="p-1.5 rounded-lg hover:bg-[#C94A45]/10 text-[#657572] hover:text-[#C94A45]"
                    title="Purge Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-[#657572]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
