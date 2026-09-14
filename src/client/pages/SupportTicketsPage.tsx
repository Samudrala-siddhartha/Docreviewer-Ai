/**
 * DocSure AI - Support & AI Forensic Assistant
 * Section 31: Dispute resolution, ticketing, and server-side AI advisory.
 */

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '../utils/api.ts';
import { SupportTicket, TicketCategory, TicketPriority } from '../../shared/types.ts';
import { useAuth } from '../state/AuthContext.tsx';

export const SupportTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('SCAN_DISPUTE');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [description, setDescription] = useState('');
  const [scanId, setScanId] = useState('');
  const [ticketNotice, setTicketNotice] = useState<string | null>(null);

  // AI Assistant Chat state
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello. I am the DocSure AI Forensic Advisor. How can I explain your screening results, QR/OCR demographic cross-checks, or privacy policies?',
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await apiRequest<SupportTicket[]>('/api/tickets');
    if (res.success && res.data) {
      setTickets(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketNotice(null);

    const res = await apiRequest<SupportTicket>('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        subject,
        category,
        priority,
        description,
        scanId: scanId || undefined,
      }),
    });

    if (res.success && res.data) {
      setTickets([res.data, ...tickets]);
      setSubject('');
      setDescription('');
      setScanId('');
      setTicketNotice('Ticket registered successfully. An authorized forensic officer will review the case.');
    }
  };

  const handleSendAiQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    setAiQuery('');
    setAiChatLogs((prev) => [...prev, { role: 'user', text: userText }]);
    setAiLoading(true);

    const res = await apiRequest<{ answer: string }>('/api/assistant/ask', {
      method: 'POST',
      body: JSON.stringify({ query: userText }),
    });

    setAiLoading(false);
    if (res.success && res.data) {
      setAiChatLogs((prev) => [...prev, { role: 'assistant', text: res.data!.answer }]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#063F3A] font-serif">Dispute Resolution & Forensic Advisor</h1>
        <p className="text-xs text-[#657572]">
          Submit screening disputes for human re-adjudication or consult the technical AI advisor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: AI Assistant (Section 31 & 49) */}
        <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 flex flex-col justify-between h-[540px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#657572]/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#063F3A] text-[#E1B95A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#063F3A]">Forensic Technical Advisor</h3>
                  <p className="text-[10px] text-[#657572]">Explains visual anomalies, check digits, and uncertainty metrics</p>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#218A68]/15 text-[#218A68] font-semibold">
                Guarded Agent
              </span>
            </div>

            {/* Chat conversation box */}
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 text-xs">
              {aiChatLogs.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#063F3A] text-white ml-8'
                      : 'bg-[#F8F5ED] text-[#102321] mr-8 border border-[#657572]/15'
                  }`}
                >
                  <p className="text-[11px] font-semibold opacity-75 mb-0.5">
                    {msg.role === 'user' ? 'Operator' : 'DocSure Advisor'}
                  </p>
                  <p className="text-xs">{msg.text}</p>
                </div>
              ))}
              {aiLoading && (
                <div className="p-3 bg-[#F8F5ED] rounded-xl text-xs text-[#657572] mr-8 border border-[#657572]/15 animate-pulse">
                  Analyzing forensic context...
                </div>
              )}
            </div>
          </div>

          {/* Chat query input */}
          <form onSubmit={handleSendAiQuestion} className="flex items-center gap-2 pt-3 border-t border-[#657572]/15">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask e.g. Why did the PAN scan trigger a QR mismatch?"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#657572]/20 focus:border-[#0B6B5E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="p-2 bg-[#063F3A] text-white rounded-lg hover:bg-[#0B6B5E]"
            >
              <Send className="w-4 h-4 text-[#E1B95A]" />
            </button>
          </form>
        </div>

        {/* Right Col: Raise Dispute Ticket */}
        <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#063F3A]">Register Formal Dispute Ticket</h3>
            <p className="text-[11px] text-[#657572]">
              Escalate flagged documents to human forensic reviewers for manual case review.
            </p>
          </div>

          {ticketNotice && (
            <div className="p-3 bg-[#218A68]/10 text-[#218A68] rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{ticketNotice}</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#102321] mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Clarification regarding DOB compression marker"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#657572]/20 focus:border-[#0B6B5E] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#102321] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-[#657572]/20 bg-white"
                >
                  <option value="SCAN_DISPUTE">Scan Dispute</option>
                  <option value="DOCUMENT_QUALITY">Quality Degradation</option>
                  <option value="PRIVACY_REQUEST">Privacy & Data Purge</option>
                  <option value="TECHNICAL_SUPPORT">Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#102321] mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-[#657572]/20 bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#102321] mb-1">Associated Scan ID (Optional)</label>
              <input
                type="text"
                value={scanId}
                onChange={(e) => setScanId(e.target.value)}
                placeholder="e.g. scn_pan_tampered_742"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#657572]/20 focus:border-[#0B6B5E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#102321] mb-1">Description & Evidence Justification</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the discrepancy or why physical re-inspection should be conducted..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#657572]/20 focus:border-[#0B6B5E] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#063F3A] text-white font-semibold rounded-lg hover:bg-[#0B6B5E] text-xs transition-colors"
            >
              Submit Ticket to Forensic Desk
            </button>
          </form>
        </div>
      </div>

      {/* Active Tickets List */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#063F3A]">Registered Support & Dispute Cases ({tickets.length})</h3>

        {loading ? (
          <div className="text-center py-6 text-xs text-[#657572]">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#657572]">No active dispute tickets.</div>
        ) : (
          <div className="divide-y divide-[#657572]/15">
            {tickets.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#063F3A]">{t.id}</span>
                    <span className="font-semibold text-[#102321]">{t.subject}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-black/5 text-[#657572]">
                      {t.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#657572] flex items-center gap-2">
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Submitter: {t.userEmail}</span>
                    {t.assignedTo && <span>• Assigned: {t.assignedTo}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono font-semibold text-[10px] ${
                      t.status === 'RESOLVED'
                        ? 'bg-[#218A68]/15 text-[#218A68]'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-[#C89B3C]/20 text-[#8F6A15]'
                        : 'bg-black/5 text-[#657572]'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
