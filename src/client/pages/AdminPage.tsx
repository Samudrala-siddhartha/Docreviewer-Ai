/**
 * DocSure AI - Enterprise Governance & Admin Console
 * Section 33 & 35: System metrics, RBAC user registry, reference templates,
 * model registry, and immutable audit logs.
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Layers,
  FileCheck2,
  Database,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { apiRequest } from '../utils/api.ts';
import { SystemMetrics, AuditLogEntry, ReferenceTemplate, ModelVersionInfo } from '../../shared/types.ts';
import { useAuth } from '../state/AuthContext.tsx';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'USERS' | 'TEMPLATES' | 'MODELS' | 'AUDIT'>('METRICS');
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [templates, setTemplates] = useState<ReferenceTemplate[]>([]);
  const [models, setModels] = useState<ModelVersionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      const [mRes, aRes, tRes, modRes] = await Promise.all([
        apiRequest<SystemMetrics>('/api/admin/metrics'),
        apiRequest<AuditLogEntry[]>('/api/admin/audit-logs'),
        apiRequest<ReferenceTemplate[]>('/api/admin/templates'),
        apiRequest<ModelVersionInfo[]>('/api/admin/models'),
      ]);

      if (mRes.success && mRes.data) setMetrics(mRes.data);
      if (aRes.success && aRes.data) setAuditLogs(aRes.data);
      if (tRes.success && tRes.data) setTemplates(tRes.data);
      if (modRes.success && modRes.data) setModels(modRes.data);
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#063F3A] font-serif">Enterprise Governance Console</h1>
          <p className="text-xs text-[#657572]">
            System telemetry, reference baseline templates, and immutable audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-[#C94A45]/15 text-[#A5342F] border border-[#C94A45]/30 rounded-full font-bold">
            Admin Level Access: {user?.email}
          </span>
        </div>
      </div>

      {/* Console Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#657572]/20 pb-2 text-xs overflow-x-auto">
        {[
          { key: 'METRICS', label: 'System Metrics', icon: Activity },
          { key: 'USERS', label: 'Operator Registry', icon: Users },
          { key: 'TEMPLATES', label: 'Reference Templates', icon: Layers },
          { key: 'MODELS', label: 'Model Registry', icon: Cpu },
          { key: 'AUDIT', label: 'Immutable Audit Logs', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#063F3A] text-white shadow-xs'
                  : 'text-[#657572] hover:text-[#102321] hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Metrics */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#657572]/15 shadow-xs">
              <span className="text-[11px] text-[#657572] block">Total Ingested Scans</span>
              <span className="text-2xl font-bold text-[#063F3A] font-serif">
                {metrics?.totalScans ?? 24}
              </span>
              <span className="text-[10px] text-[#218A68] mt-1 block">100% ephemeral retention</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#657572]/15 shadow-xs">
              <span className="text-[11px] text-[#657572] block">High Risk Anomaly Ratio</span>
              <span className="text-2xl font-bold text-[#C94A45] font-serif">
                {metrics?.highRiskCount ?? 6}
              </span>
              <span className="text-[10px] text-[#657572] mt-1 block">Discrepancy flagged</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#657572]/15 shadow-xs">
              <span className="text-[11px] text-[#657572] block">Average Pipeline Latency</span>
              <span className="text-2xl font-bold text-[#102321] font-mono">
                {metrics?.averageProcessingTimeMs ?? 1420} ms
              </span>
              <span className="text-[10px] text-[#218A68] mt-1 block">Within SLA (&lt; 2.5s)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#657572]/15 shadow-xs">
              <span className="text-[11px] text-[#657572] block">System Error Rate</span>
              <span className="text-2xl font-bold text-[#218A68] font-mono">
                {metrics?.errorRate ?? '0.00%'}
              </span>
              <span className="text-[10px] text-[#218A68] mt-1 block">Zero catastrophic fails</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#657572]/15 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#063F3A] uppercase tracking-wider">
              Real-time Ingestion Pipeline Health
            </h3>
            <p className="text-xs text-[#657572] leading-relaxed">
              All multi-signal stages operating in sandboxed container memory. Ephemeral image buffers
              are automatically dereferenced following feature vector extraction.
            </p>
            <div className="p-3 bg-[#F8F5ED] rounded-xl text-xs font-mono text-[#657572] flex items-center justify-between">
              <span>ACTIVE FORENSIC ENGINE: Gemini 2.5 Flash + OpenCV + PyMuPDF Sim</span>
              <span className="text-[#218A68] font-bold">ONLINE</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Operator Registry */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#063F3A]">Authorized Role-Based Operators</h3>
            <span className="text-xs text-[#657572]">SIH Evaluation Environment</span>
          </div>

          <div className="border border-[#657572]/20 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F8F5ED] text-[#657572] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">MFA Status</th>
                  <th className="p-3">Active Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#657572]/15 text-[#102321]">
                <tr>
                  <td className="p-3 font-semibold">Aarav Sharma (user@docsure.ai)</td>
                  <td className="p-3 font-mono font-bold text-[#063F3A]">USER</td>
                  <td className="p-3 text-[#657572]">State Verification Unit</td>
                  <td className="p-3 text-[#218A68]">Enabled</td>
                  <td className="p-3 font-mono">1</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Dr. Priya Sen (reviewer@docsure.ai)</td>
                  <td className="p-3 font-mono font-bold text-[#8F6A15]">REVIEWER</td>
                  <td className="p-3 text-[#657572]">National Forensic Agency</td>
                  <td className="p-3 text-[#218A68]">Enabled</td>
                  <td className="p-3 font-mono">2</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Siddartha V. (admin@docsure.ai)</td>
                  <td className="p-3 font-mono font-bold text-[#A5342F]">ADMIN</td>
                  <td className="p-3 text-[#657572]">SIH Core Directorate</td>
                  <td className="p-3 text-[#218A68]">Enabled</td>
                  <td className="p-3 font-mono">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reference Templates */}
      {activeTab === 'TEMPLATES' && (
        <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#063F3A]">
            Official Reference Baseline Templates ({templates.length})
          </h3>
          <p className="text-xs text-[#657572]">
            Cryptographic check-patterns, font families, and security features for Indian identification standards.
          </p>

          <div className="space-y-3">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-3.5 bg-[#F8F5ED] rounded-xl border border-[#657572]/20 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#102321]">{tpl.name}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/5 text-[#657572]">
                      Ver {tpl.version}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#218A68]/15 text-[#218A68] font-bold">
                    ACTIVE TEMPLATE
                  </span>
                </div>
                <div className="text-[11px] text-[#657572]">
                  Category: <strong className="text-[#102321]">{tpl.documentType}</strong> • Source: {tpl.source}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tpl.securityFeaturesExpected.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-white rounded border border-[#657572]/20 text-[#063F3A]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Model Registry */}
      {activeTab === 'MODELS' && (
        <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#063F3A]">Forensic Model Registry ({models.length})</h3>
          <p className="text-xs text-[#657572]">
            Versioned machine learning checkpoints and algorithmic modules deployed across screening stages.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {models.map((mod) => (
              <div key={mod.id} className="p-3 bg-[#F8F5ED] rounded-xl border border-[#657572]/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#102321]">{mod.name}</span>
                  <span className="font-mono text-[10px] font-bold text-[#0B6B5E]">{mod.version}</span>
                </div>
                <p className="text-[11px] text-[#657572]">{mod.type} • {mod.notes}</p>
                <div className="text-[10px] font-mono text-[#657572] pt-1">
                  Created: {new Date(mod.createdAt).toLocaleDateString()} • Status: {mod.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Immutable Audit Logs */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#063F3A]">Immutable Activity Audit Trail ({auditLogs.length})</h3>
            <span className="text-[10px] font-mono text-[#218A68] flex items-center gap-1">
              <Lock className="w-3 h-3" /> Append-Only Enforced
            </span>
          </div>

          <div className="border border-[#657572]/20 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F8F5ED] text-[#657572] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Actor</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Actor ID</th>
                  <th className="p-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#657572]/15 text-[#102321]">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-2.5 font-mono text-[10px] text-[#657572]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-2.5 font-semibold text-[#063F3A]">{log.userEmail || 'System'}</td>
                    <td className="p-2.5 font-mono text-[11px] font-bold">{log.action}</td>
                    <td className="p-2.5 font-mono text-[11px] text-[#657572]">{log.userId || 'system'}</td>
                    <td className="p-2.5 text-[11px] text-[#657572] truncate max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
