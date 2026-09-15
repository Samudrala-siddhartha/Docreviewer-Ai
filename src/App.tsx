/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './client/state/AuthContext.tsx';
import { LanguageProvider } from './client/hooks/useLanguage.tsx';
import { Header } from './client/components/Header.tsx';
import { SidebarNav } from './client/components/SidebarNav.tsx';
import { MobileBottomNav } from './client/components/MobileBottomNav.tsx';
import { SplashPage } from './client/pages/SplashPage.tsx';
import { LoginPage } from './client/pages/LoginPage.tsx';
import { SignupPage } from './client/pages/SignupPage.tsx';
import { DashboardPage } from './client/pages/DashboardPage.tsx';
import { ScanPage } from './client/pages/ScanPage.tsx';
import { EvidenceViewerPage } from './client/pages/EvidenceViewerPage.tsx';
import { ReportPage } from './client/pages/ReportPage.tsx';
import { HistoryPage } from './client/pages/HistoryPage.tsx';
import { SupportTicketsPage } from './client/pages/SupportTicketsPage.tsx';
import { DigiLockerPage } from './client/pages/DigiLockerPage.tsx';
import { ReviewerPage } from './client/pages/ReviewerPage.tsx';
import { AdminPage } from './client/pages/AdminPage.tsx';
import { ProfilePage } from './client/pages/ProfilePage.tsx';

const AppContent: React.FC = () => {
  const { currentView } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'home':
        return <DashboardPage />;
      case 'scan':
        return <ScanPage />;
      case 'evidence':
        return <EvidenceViewerPage />;
      case 'reports':
        return <ReportPage />;
      case 'history':
        return <HistoryPage />;
      case 'support':
        return <SupportTicketsPage />;
      case 'digilocker':
        return <DigiLockerPage />;
      case 'reviewer':
        return <ReviewerPage />;
      case 'admin':
        return <AdminPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  const isFullscreenSplash = currentView === 'splash' || currentView === 'login' || currentView === 'signup';

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#102321] flex flex-col font-sans selection:bg-[#063F3A]/20 selection:text-[#063F3A]">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto pb-16 md:pb-0">
        {!isFullscreenSplash && <SidebarNav />}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isFullscreenSplash ? 'max-w-4xl mx-auto w-full' : ''}`}>
          {renderCurrentView()}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

