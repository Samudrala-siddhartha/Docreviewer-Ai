/**
 * DocSure AI - Professionalistic Navigation Menu Bar
 * Supports 3-lines hamburger trigger, smooth drawer and docked modes,
 * real-time menu search filter, custom scrolling effect, and essential forensic functions.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  ScanLine,
  History,
  FileCheck2,
  FolderLock,
  LifeBuoy,
  UserCog,
  ClipboardList,
  ShieldAlert,
  Info,
  Layers,
  Search,
  X,
  Pin,
  PinOff,
  Sparkles,
  ChevronRight,
  Lock,
  LogOut,
  SlidersHorizontal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Camera,
  UploadCloud,
} from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { UserRole } from '../../shared/types.ts';
import { DocSureLogo } from './DocSureLogo.tsx';

interface NavItem {
  id: string;
  label: string;
  category: 'OPERATIONS' | 'GOVERNANCE' | 'SYSTEM';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  highlight?: boolean;
  requiredRoles?: UserRole[];
}

export const SidebarNav: React.FC = () => {
  const {
    user,
    currentView,
    setCurrentView,
    isSidebarOpen,
    setSidebarOpen,
    isSidebarPinned,
    toggleSidebarPinned,
    quickSwitchDemo,
    logout,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen && !isSidebarPinned) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, isSidebarPinned, setSidebarOpen]);

  const allNavItems: NavItem[] = useMemo(
    () => [
      {
        id: 'home',
        label: 'Executive Dashboard',
        category: 'OPERATIONS',
        icon: LayoutDashboard,
        description: 'System health, real-time metrics & risk distribution',
      },
      {
        id: 'scan',
        label: 'Screen Document',
        category: 'OPERATIONS',
        icon: ScanLine,
        description: '7-phase multi-spectral forensic verification pipeline',
        highlight: true,
        badge: '7 Phases',
      },
      {
        id: 'history',
        label: 'Scan Archives',
        category: 'OPERATIONS',
        icon: History,
        description: 'Chronological audit records & verified metadata',
      },
      {
        id: 'reports',
        label: 'Forensic Reports Dossier',
        category: 'OPERATIONS',
        icon: FileCheck2,
        description: 'Downloadable PDF audit dossiers & legal disclaimers',
      },
      {
        id: 'evidence',
        label: 'Evidence Heatmap Viewer',
        category: 'OPERATIONS',
        icon: Layers,
        description: 'Multi-spectral ELA overlays & bounding markers',
        badge: 'Live',
      },
      {
        id: 'digilocker',
        label: 'DigiLocker Sandbox',
        category: 'OPERATIONS',
        icon: FolderLock,
        description: 'Government repository credential ingestion demo',
        badge: 'Sandbox',
      },
      {
        id: 'reviewer',
        label: 'Reviewer Case Desk',
        category: 'GOVERNANCE',
        icon: ClipboardList,
        description: 'Dual-custody adjudications for high-risk flags',
        badge: 'Desk',
        requiredRoles: ['REVIEWER', 'ADMIN'],
      },
      {
        id: 'admin',
        label: 'Admin Governance & Audit',
        category: 'GOVERNANCE',
        icon: ShieldAlert,
        description: 'Cryptographic tamper logs, API keys & model drift',
        badge: 'Gov',
        requiredRoles: ['ADMIN'],
      },
      {
        id: 'support',
        label: 'Citizen Dispute Tickets',
        category: 'SYSTEM',
        icon: LifeBuoy,
        description: 'Statutory contestations & appeal escalation',
      },
      {
        id: 'profile',
        label: 'Security & Privacy Desk',
        category: 'SYSTEM',
        icon: UserCog,
        description: '2FA authentication, credentials & privacy posture',
      },
    ],
    []
  );

  // Filter items based on active search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allNavItems;
    const q = searchQuery.toLowerCase();
    return allNavItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allNavItems, searchQuery]);

  // Group filtered items
  const operations = filteredItems.filter((i) => i.category === 'OPERATIONS');
  const governance = filteredItems.filter(
    (i) =>
      i.category === 'GOVERNANCE' &&
      (!i.requiredRoles || (user && i.requiredRoles.includes(user.role)))
  );
  const system = filteredItems.filter((i) => i.category === 'SYSTEM');

  const handleItemClick = (id: string) => {
    setCurrentView(id);
    // On small screens, close the drawer after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Render navigation item button
  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleItemClick(item.id)}
        className={`w-full group text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
          isActive
            ? 'bg-[#063F3A] text-white border-[#063F3A] shadow-xs'
            : item.highlight
            ? 'bg-[#063F3A]/5 text-[#063F3A] hover:bg-[#063F3A]/10 border-[#063F3A]/15 font-semibold'
            : 'text-[#102321]/85 border-transparent hover:bg-[#F8F5ED] hover:border-[#657572]/20 hover:text-[#063F3A]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isActive
                ? 'bg-[#E1B95A]/20 text-[#E1B95A]'
                : item.highlight
                ? 'bg-[#063F3A]/10 text-[#0B6B5E]'
                : 'bg-black/5 text-[#657572] group-hover:text-[#063F3A] group-hover:bg-[#063F3A]/5'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="truncate font-semibold text-xs leading-snug">
              {item.label}
            </div>
            <div
              className={`truncate text-[10px] leading-none mt-0.5 ${
                isActive ? 'text-white/70' : 'text-[#657572]'
              }`}
            >
              {item.description}
            </div>
          </div>
        </div>

        {item.badge && (
          <span
            className={`ml-2 shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase ${
              isActive
                ? 'bg-[#E1B95A] text-[#063F3A]'
                : item.badge === '7 Phases'
                ? 'bg-[#218A68]/15 text-[#218A68] border border-[#218A68]/30'
                : item.badge === 'Sandbox' || item.badge === 'Demo'
                ? 'bg-[#C89B3C]/15 text-[#8F6A15] border border-[#C89B3C]/30'
                : 'bg-[#0B6B5E]/15 text-[#0B6B5E]'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  // The core inner menu content
  const menuContent = (
    <div
      ref={menuContainerRef}
      className="flex flex-col h-full bg-white border-r border-[#657572]/15 shadow-sm select-none"
    >
      {/* 1. Header of Menu: 3-lines icon, title & Pin/Close controls */}
      <div className="p-4 border-b border-[#657572]/15 bg-[#F8F5ED]/40 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#063F3A] text-[#E1B95A] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
            3≡
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-xs text-[#063F3A] truncate">
              DocSure Menu
            </div>
            <div className="text-[10px] text-[#657572] font-mono truncate">
              Forensic Navigation Desk
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Desktop Pin Toggle */}
          <button
            type="button"
            onClick={toggleSidebarPinned}
            aria-label={isSidebarPinned ? 'Unpin menu (float as drawer)' : 'Pin menu to screen'}
            title={isSidebarPinned ? 'Unpin menu (tuck under 3-lines button)' : 'Pin menu alongside workspace'}
            className={`hidden lg:flex p-1.5 rounded-lg border text-xs transition-colors ${
              isSidebarPinned
                ? 'bg-[#063F3A]/10 text-[#063F3A] border-[#063F3A]/20'
                : 'text-[#657572] border-transparent hover:bg-black/5'
            }`}
          >
            {isSidebarPinned ? <Pin className="w-3.5 h-3.5 fill-[#063F3A]" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>

          {/* Close Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            title="Close menu (Esc)"
            className="p-1.5 rounded-lg text-[#657572] hover:text-[#102321] hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Search & Instant Filter Bar */}
      <div className="p-3 border-b border-[#657572]/15 bg-white shrink-0 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#657572] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools, modules, desk..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-[#657572]/25 focus:outline-none focus:border-[#0B6B5E] focus:ring-1 focus:ring-[#0B6B5E] bg-[#F8F5ED]/40 placeholder:text-[#657572]/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#657572] hover:text-[#102321]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Screening CTA Banner */}
        <button
          type="button"
          onClick={() => handleItemClick('scan')}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-[#063F3A] to-[#0B6B5E] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity group"
        >
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-[#E1B95A] group-hover:scale-110 transition-transform" />
            <span>Screen Document Now</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-[#E1B95A]">
            7-Phase
          </span>
        </button>
      </div>

      {/* 3. Smooth Scrolling Nav Container with custom scrollbar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-5 scroll-smooth">
        {/* Operations Section */}
        {operations.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#657572]">
                Forensic Operations
              </span>
              <span className="text-[10px] font-mono text-[#657572]/60">
                {operations.length}
              </span>
            </div>
            <nav className="space-y-1">{operations.map(renderNavButton)}</nav>
          </div>
        )}

        {/* Reviewer & Governance Section */}
        {governance.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-[#657572]/15">
            <div className="flex items-center justify-between px-2 mb-1.5 mt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#657572]">
                Adjudication & Governance
              </span>
              <span className="text-[10px] font-mono text-[#657572]/60">
                {governance.length}
              </span>
            </div>
            <nav className="space-y-1">{governance.map(renderNavButton)}</nav>
          </div>
        )}

        {/* System & Support Section */}
        {system.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-[#657572]/15">
            <div className="flex items-center justify-between px-2 mb-1.5 mt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#657572]">
                Citizen Desk & Security
              </span>
              <span className="text-[10px] font-mono text-[#657572]/60">
                {system.length}
              </span>
            </div>
            <nav className="space-y-1">{system.map(renderNavButton)}</nav>
          </div>
        )}

        {/* SIH Hackathon Evaluation Persona Switcher inside Menu */}
        <div className="p-3 bg-[#F8F5ED] border border-[#657572]/20 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#063F3A] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C89B3C]" /> SIH Evaluation Role
            </span>
            <span className="text-[10px] font-mono text-[#0B6B5E] font-semibold">
              {user?.role || 'GUEST'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['USER', 'REVIEWER', 'ADMIN'] as UserRole[]).map((r) => {
              const isActive = user?.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => quickSwitchDemo(r)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold transition-all text-center border ${
                    isActive
                      ? 'bg-[#063F3A] text-white border-[#063F3A] shadow-xs'
                      : 'bg-white text-[#657572] border-[#657572]/20 hover:border-[#0B6B5E] hover:text-[#063F3A]'
                  }`}
                >
                  {r === 'USER' ? '👤 User' : r === 'REVIEWER' ? '🔍 Review' : '🛡️ Admin'}
                </button>
              );
            })}
          </div>
        </div>

        {/* System & Ephemeral Storage Health Indicator */}
        <div className="p-3 bg-white border border-[#657572]/15 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#063F3A]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#218A68] animate-pulse" />
              <span>Ephemeral RAM Sandbox</span>
            </span>
            <span className="text-[10px] font-mono text-[#218A68] font-bold">ACTIVE</span>
          </div>
          <p className="text-[10px] text-[#657572] leading-tight">
            Zero-retention memory purge boundary active (15m TTL buffer). No raw biometrics stored.
          </p>
        </div>
      </div>

      {/* 4. Sticky Bottom Footer: Active User & Logout */}
      <div className="p-3 border-t border-[#657572]/15 bg-[#F8F5ED]/50 shrink-0 space-y-2">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-[#657572]/15 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#063F3A] text-[#E1B95A] font-bold text-xs flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#102321] truncate leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] text-[#657572] truncate">
                  {user.role} • {user.organization || 'SIH Evaluator'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#657572] hover:text-[#C94A45] hover:bg-[#C94A45]/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleItemClick('login')}
            className="w-full py-2 bg-[#063F3A] text-white text-xs font-semibold rounded-xl hover:bg-[#0B6B5E] transition-colors text-center"
          >
            Sign In to Desk
          </button>
        )}

        <div className="text-center">
          <span className="text-[9px] font-mono text-[#657572]">
            DocSure AI v2.4 • Statutory Risk Engine
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* A. DOCKED DESKTOP MODE: Visible when on large screen, open, and pinned */}
      {isSidebarOpen && isSidebarPinned && (
        <aside className="hidden lg:block w-72 shrink-0 min-h-[calc(100vh-4rem)] z-20">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            {menuContent}
          </div>
        </aside>
      )}

      {/* B. SLIDE-OUT OVERLAY DRAWER: Triggered by 3-lines menu button */}
      {/* Works on all devices when opened as a drawer (or whenever screen < lg, or unpinned on desktop) */}
      {isSidebarOpen && (!isSidebarPinned || typeof window !== 'undefined') && (
        <div className={`fixed inset-0 z-50 flex ${isSidebarPinned ? 'lg:hidden' : ''}`}>
          {/* Backdrop Blur with smooth fade */}
          <div
            className="fixed inset-0 bg-[#063F3A]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer Container */}
          <div
            className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 transition-transform duration-300 ease-out animate-in slide-in-from-left duration-200"
          >
            {menuContent}
          </div>
        </div>
      )}
    </>
  );
};
