/**
 * DocSure AI - User Profile & Data Protection Settings
 * Section 34: 2FA configuration, session control, and ephemeral privacy purge.
 */

import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Laptop,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  Lock,
} from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { apiRequest } from '../utils/api.ts';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [retentionDays, setRetentionDays] = useState('7');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handlePurgeAllEphemeralData = async () => {
    if (confirm('Permanently purge all your active screening records and cached forensic tokens?')) {
      const res = await apiRequest('/api/profile/purge-data', { method: 'POST' });
      if (res.success) {
        setStatusNotice('All ephemeral screening buffers purged from system memory.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#063F3A] font-serif">Security Profile & Data Privacy</h1>
        <p className="text-xs text-[#657572]">
          Manage your operator identity, active sessions, and DPDP zero-retention preferences.
        </p>
      </div>

      {statusNotice && (
        <div className="p-3 bg-[#218A68]/10 text-[#218A68] rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Profile Overview */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#063F3A] text-[#E1B95A] flex items-center justify-center font-bold text-lg font-serif">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#102321]">{user?.name}</h2>
            <p className="text-xs text-[#657572]">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#063F3A]/10 text-[#063F3A] font-bold">
                ROLE: {user?.role}
              </span>
              <span className="text-[10px] text-[#657572]">State Verification Authority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & MFA Settings */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#063F3A]">Two-Factor Authentication & Cryptographic Tokens</h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F5ED] border border-[#657572]/20">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#102321]">Time-Based OTP (TOTP) Security</div>
            <div className="text-[11px] text-[#657572]">
              Enforces 6-digit cryptographic authenticator code on sensitive adjudications.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              setStatusNotice(`Two-factor verification ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}.`);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              twoFactorEnabled
                ? 'bg-[#218A68] text-white'
                : 'bg-white border border-[#657572]/30 text-[#657572]'
            }`}
          >
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#063F3A]">Active Authorized Sessions</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#657572]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-[#063F3A]" />
              <div>
                <p className="font-semibold text-[#102321]">Current Browser Client</p>
                <p className="text-[11px] text-[#657572]">Container Sandboxed Session • IP 127.0.0.1</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#218A68]/15 text-[#218A68] font-bold">
              ACTIVE NOW
            </span>
          </div>
        </div>
      </div>

      {/* Data Retention & Privacy (DPDP Act Compliance) */}
      <div className="bg-white rounded-2xl border border-[#657572]/15 shadow-xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#063F3A]">Ephemeral Data Retention & DPDP Purge</h3>
          <p className="text-[11px] text-[#657572]">
            Original document image buffers are never saved permanently. Control metadata archive lifetime:
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="font-semibold text-[#102321]">Auto-Purge Metadata After:</label>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            className="p-1.5 rounded-lg border border-[#657572]/20 bg-white text-xs"
          >
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
            <option value="NEVER">Keep Audit Logs Indefinitely</option>
          </select>
        </div>

        <div className="pt-3 border-t border-[#657572]/15 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePurgeAllEphemeralData}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C94A45]/10 hover:bg-[#C94A45]/20 text-[#A5342F] rounded-lg text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All My Screening Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
