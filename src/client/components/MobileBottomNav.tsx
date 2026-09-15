/**
 * DocSure AI - Mobile Bottom Navigation
 * Ensures 44px+ touch targets and intuitive access on handheld screens.
 */

import React from 'react';
import { LayoutDashboard, ScanLine, FileCheck2, UserCog, Menu } from 'lucide-react';
import { useAuth } from '../state/AuthContext.tsx';
import { useLanguage } from '../hooks/useLanguage.tsx';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, isSidebarOpen, toggleSidebar } = useAuth();
  const { t } = useLanguage();

  const isFullscreenSplash = currentView === 'splash' || currentView === 'login' || currentView === 'signup';
  if (isFullscreenSplash) return null;

  const navItems = [
    { id: 'home', labelKey: 'nav_home', defaultLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', labelKey: 'nav_scan', defaultLabel: 'Screen', icon: ScanLine, isPrimary: true },
    { id: 'reports', labelKey: 'nav_reports', defaultLabel: 'Reports', icon: FileCheck2 },
    { id: 'profile', labelKey: 'nav_profile', defaultLabel: 'Profile', icon: UserCog },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#657572]/20 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const label = t(item.labelKey, item.defaultLabel);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-lg transition-colors ${
                item.isPrimary
                  ? 'bg-[#063F3A] text-white -translate-y-2 shadow-md'
                  : isActive
                  ? 'text-[#063F3A] font-semibold'
                  : 'text-[#657572]'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isPrimary ? 'text-[#E1B95A]' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[65px]">{label}</span>
            </button>
          );
        })}

        {/* 3-Lines Menu Trigger in Mobile Bottom Bar */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open 3-lines navigation menu"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-lg transition-colors ${
            isSidebarOpen ? 'text-[#0B6B5E] font-bold' : 'text-[#657572]'
          }`}
        >
          {/* Animated 3 lines mini-indicator */}
          <div className="w-5 h-5 flex flex-col justify-center gap-1 items-center">
            <span className="w-4 h-0.5 bg-current rounded-full" />
            <span className="w-3 h-0.5 bg-current rounded-full self-start ml-0.5" />
            <span className="w-4 h-0.5 bg-current rounded-full" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">{t('menu', 'Menu')}</span>
        </button>
      </div>
    </div>
  );
};
