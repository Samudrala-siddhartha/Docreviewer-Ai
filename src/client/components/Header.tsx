/**
 * DocSure AI - Enterprise Header
 * Brand identity, security posture indicator, and role selector.
 */

import React from 'react';
import { ShieldCheck, Fingerprint, Lock, UserCheck, LogOut, ChevronDown, User, Sparkles } from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { UserRole } from '../../shared/types.ts';
import { DocSureLogo } from './DocSureLogo.tsx';

export const Header: React.FC = () => {
  const { user, quickSwitchDemo, logout, currentView, setCurrentView, isSidebarOpen, toggleSidebar } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const roleColors: Record<UserRole, string> = {
    USER: 'bg-[#0B6B5E]/15 text-[#0B6B5E] border-[#0B6B5E]/30',
    REVIEWER: 'bg-[#C89B3C]/20 text-[#8F6A15] border-[#C89B3C]/40',
    ADMIN: 'bg-[#C94A45]/15 text-[#A5342F] border-[#C94A45]/30',
  };

  const isFullscreenSplash = currentView === 'splash' || currentView === 'login' || currentView === 'signup';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-[#657572]/15 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: 3 Lines Menu Toggle Button + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Professional 3-lines Hamburger Toggle Button */}
          {!isFullscreenSplash && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu (3 lines)"
              title={isSidebarOpen ? 'Collapse Navigation Menu' : 'Open Navigation Menu (3 lines)'}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center border group ${
                isSidebarOpen
                  ? 'bg-[#063F3A] text-[#E1B95A] border-[#063F3A] shadow-xs'
                  : 'bg-[#F8F5ED] text-[#063F3A] border-[#657572]/20 hover:bg-[#063F3A]/10 hover:border-[#0B6B5E]/40 active:scale-95'
              }`}
            >
              {/* Professional 3 lines SVG structure */}
              <div className="w-5 h-4 flex flex-col justify-between items-start">
                <span
                  className={`h-0.5 rounded-full transition-all duration-200 ${
                    isSidebarOpen ? 'w-5 bg-[#E1B95A] rotate-45 translate-y-1.5' : 'w-5 bg-current'
                  }`}
                />
                <span
                  className={`h-0.5 rounded-full transition-all duration-200 ${
                    isSidebarOpen ? 'opacity-0 w-0' : 'w-3.5 bg-current group-hover:w-5'
                  }`}
                />
                <span
                  className={`h-0.5 rounded-full transition-all duration-200 ${
                    isSidebarOpen ? 'w-5 bg-[#E1B95A] -rotate-45 -translate-y-1.5' : 'w-5 bg-current'
                  }`}
                />
              </div>
            </button>
          )}

          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center cursor-pointer group hover:opacity-95 transition-opacity"
            onClick={() => setCurrentView('home')}
          >
            <DocSureLogo variant="navbar" size="md" />
          </div>
        </div>

        {/* Evaluation Persona Switcher for SIH reviewers */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-[#F8F5ED] border border-[#657572]/20 rounded-lg text-xs">
          <span className="text-[11px] font-mono text-[#657572] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C89B3C]" /> SIH Persona:
          </span>
          {(['USER', 'REVIEWER', 'ADMIN'] as UserRole[]).map((r) => {
            const isActive = user?.role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => quickSwitchDemo(r)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#063F3A] text-white shadow-xs font-semibold'
                    : 'text-[#657572] hover:text-[#102321] hover:bg-black/5'
                }`}
              >
                {r === 'USER' ? '👤 User' : r === 'REVIEWER' ? '🔍 Reviewer' : '🛡️ Admin'}
              </button>
            );
          })}
        </div>

        {/* Security Status Pill & User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#218A68] font-mono bg-[#218A68]/10 px-2.5 py-1 rounded-full border border-[#218A68]/20">
            <Lock className="w-3 h-3" />
            <span>Zero-Retention Ephemeral Storage</span>
          </div>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#657572]/20 hover:border-[#0B6B5E]/40 transition-colors bg-white text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#063F3A]/10 text-[#063F3A] flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-[#102321] line-clamp-1 max-w-[130px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[#657572] line-clamp-1">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#657572]" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#657572]/20 rounded-xl shadow-lg p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-[#657572]/15 mb-1">
                    <p className="font-semibold text-[#102321]">{user.name}</p>
                    <p className="text-[#657572] text-[11px] truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                      {user.twoFactorEnabled && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#218A68]/15 text-[#218A68] border border-[#218A68]/30">
                          2FA ON
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('profile');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[#F8F5ED] rounded-lg text-[#102321]"
                  >
                    <User className="w-4 h-4 text-[#0B6B5E]" />
                    Profile & Security Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[#C94A45]/10 text-[#C94A45] rounded-lg mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="px-3.5 py-1.5 bg-[#063F3A] text-white text-xs font-semibold rounded-lg hover:bg-[#0B6B5E] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
