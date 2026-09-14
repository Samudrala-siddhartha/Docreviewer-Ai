/**
 * DocSure AI - DigiLocker Integration Sandbox
 * Section 32 & 72: Clearly labeled Demo integration.
 * Never claims government authority or definitive verification.
 */

import React, { useState, useEffect } from 'react';
import { FolderLock, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { apiRequest } from '../utils/api.ts';
import { DocumentType } from '../../shared/types.ts';
import { useAuth } from '../state/AuthContext.tsx';

interface DigiDoc {
  docId: string;
  docType: DocumentType;
  issuer: string;
  date: string;
}

export const DigiLockerPage: React.FC = () => {
  const { setCurrentView } = useAuth();
  const [docs, setDocs] = useState<DigiDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDigiDocs = async () => {
      const res = await apiRequest<DigiDoc[]>('/api/digilocker/documents');
      if (res.success && res.data) {
        setDocs(res.data);
      }
      setLoading(false);
    };
    fetchDigiDocs();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-xs space-y-1">
        <div className="flex items-center gap-2 text-[#8F6A15] font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>Demo Integration — Non-Authoritative Sandbox Feed</span>
        </div>
        <p className="text-[#657572] leading-relaxed">
          In production, this module coordinates OAuth authorization with the Government of India DigiLocker API gateway.
          This sandbox provides simulated demographic XML payloads for SIH architecture evaluation.
          AI screening remains separate from official registry verification.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#657572]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#063F3A] text-[#E1B95A] flex items-center justify-center">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#063F3A]">Permitted Citizen Credentials (Demo)</h2>
              <p className="text-[11px] text-[#657572]">Simulated repository tokens linked to session identity</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#218A68]/15 text-[#218A68] font-bold">
            Sandbox Linked
          </span>
        </div>

        {/* Documents Table */}
        <div className="divide-y divide-[#657572]/15">
          {docs.map((doc) => (
            <div
              key={doc.docId}
              onClick={() => setSelectedDocId(doc.docId)}
              className={`py-3.5 px-3 flex items-center justify-between gap-3 rounded-xl cursor-pointer transition-colors ${
                selectedDocId === doc.docId ? 'bg-[#063F3A]/5 border border-[#0B6B5E]/30' : 'hover:bg-[#F8F5ED]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#102321]">{doc.docType}</span>
                  <span className="font-mono text-[10px] text-[#657572]">({doc.docId})</span>
                </div>
                <div className="text-[11px] text-[#657572]">
                  Issued by: {doc.issuer} • Date: {doc.date}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('scan');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#063F3A] text-white text-xs font-semibold hover:bg-[#0B6B5E] flex items-center gap-1.5"
              >
                <span>Import & Screen</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E1B95A]" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#F8F5ED] rounded-xl text-[11px] text-[#657572] flex items-center justify-between">
          <span>Official UIDAI / DigiLocker Production API:</span>
          <span className="font-mono text-[#8F6A15] font-semibold">Production Gateway Unconfigured (Demo Active)</span>
        </div>
      </div>
    </div>
  );
};
