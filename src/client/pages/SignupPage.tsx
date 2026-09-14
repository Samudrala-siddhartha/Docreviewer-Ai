/**
 * DocSure AI - Signup View
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Building, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { DocSureLogo } from '../components/DocSureLogo.tsx';

export const SignupPage: React.FC = () => {
  const { signup, setCurrentView } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    const res = await signup(email, name, password, organization);
    setLoading(false);

    if (res.success) {
      setCurrentView('home');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#657572]/20 shadow-md p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <DocSureLogo variant="horizontal" size="md" />
          </div>
          <h2 className="text-xl font-bold text-[#063F3A] font-serif">Register Organization Desk</h2>
          <p className="text-xs text-[#657572]">
            Create an enterprise screening operator account.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#C94A45]/10 border border-[#C94A45]/20 flex items-start gap-2 text-xs text-[#C94A45]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#102321] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#657572] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Varma"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/30 focus:border-[#0B6B5E] focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102321] mb-1">Organization / Department</label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#657572] absolute left-3 top-3" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="National Identity Review Desk"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/30 focus:border-[#0B6B5E] focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102321] mb-1">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#657572] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan.varma@enterprise.in"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/30 focus:border-[#0B6B5E] focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102321] mb-1">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#657572] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#657572]/30 focus:border-[#0B6B5E] focus:outline-none focus:ring-1 focus:ring-[#0B6B5E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#063F3A] text-white text-xs font-semibold hover:bg-[#0B6B5E] transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 text-[#E1B95A]" />
          </button>
        </form>

        <div className="text-center text-xs text-[#657572]">
          Already have an authorized desk?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-[#0B6B5E] font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
