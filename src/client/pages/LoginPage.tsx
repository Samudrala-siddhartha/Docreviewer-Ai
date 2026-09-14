/**
 * DocSure AI - Enterprise Login View
 * Secure authentication with rate limiting and pre-configured role selector.
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { DocSureLogo } from '../components/DocSureLogo.tsx';

export const LoginPage: React.FC = () => {
  const { login, quickSwitchDemo, setCurrentView } = useAuth();
  const [email, setEmail] = useState('user@docsure.ai');
  const [password, setPassword] = useState('User@1234');
  const [error, setError] = useState<string | null>(null);
  const [showForgotNote, setShowForgotNote] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setCurrentView('home');
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#657572]/20 shadow-md p-6 sm:p-8 space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <DocSureLogo variant="horizontal" size="md" />
          </div>
          <h2 className="text-xl font-bold text-[#063F3A] font-serif">Sign in to Enterprise Workspace</h2>
          <p className="text-xs text-[#657572]">
            AI-assisted document screening and visual forensic analysis console.
          </p>
        </div>

        {showForgotNote && (
          <div className="p-3 rounded-xl bg-[#063F3A]/5 border border-[#0B6B5E]/20 flex items-start gap-2 text-xs text-[#063F3A]">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0B6B5E]" />
            <span>For SIH evaluation, please use the quick persona switcher below or reset via Admin console.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-[#C94A45]/10 border border-[#C94A45]/20 flex items-start gap-2 text-xs text-[#C94A45]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102321] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#657572] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@agency.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/30 focus:border-[#0B6B5E] focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#102321]">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotNote((v) => !v)}
                className="text-[11px] text-[#0B6B5E] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#657572] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/30 focus:border-[#0B6B5E] focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#063F3A] text-white text-xs font-semibold hover:bg-[#0B6B5E] transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-[#E1B95A]" />
          </button>
        </form>

        {/* Quick Reviewer Logins for SIH Judges */}
        <div className="pt-4 border-t border-[#657572]/15 space-y-2">
          <p className="text-[11px] font-mono text-[#657572] uppercase tracking-wider text-center">
            One-Click Evaluator Credentials
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('user@docsure.ai');
                setPassword('User@1234');
                quickSwitchDemo('USER');
                setCurrentView('home');
              }}
              className="p-2 rounded-lg bg-[#F8F5ED] hover:bg-[#063F3A]/5 border border-[#657572]/20 text-[11px] transition-colors"
            >
              <div className="font-semibold text-[#063F3A]">User</div>
              <div className="text-[10px] text-[#657572]">Aarav</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('reviewer@docsure.ai');
                setPassword('Reviewer@1234');
                quickSwitchDemo('REVIEWER');
                setCurrentView('reviewer');
              }}
              className="p-2 rounded-lg bg-[#F8F5ED] hover:bg-[#C89B3C]/10 border border-[#657572]/20 text-[11px] transition-colors"
            >
              <div className="font-semibold text-[#8F6A15]">Reviewer</div>
              <div className="text-[10px] text-[#657572]">Dr. Priya</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@docsure.ai');
                setPassword('Admin@1234');
                quickSwitchDemo('ADMIN');
                setCurrentView('admin');
              }}
              className="p-2 rounded-lg bg-[#F8F5ED] hover:bg-[#C94A45]/10 border border-[#657572]/20 text-[11px] transition-colors"
            >
              <div className="font-semibold text-[#A5342F]">Admin</div>
              <div className="text-[10px] text-[#657572]">Architect</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#657572]">
          Need an onboarding account?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('signup')}
            className="text-[#0B6B5E] font-semibold hover:underline"
          >
            Create new account
          </button>
        </div>
      </div>
    </div>
  );
};
