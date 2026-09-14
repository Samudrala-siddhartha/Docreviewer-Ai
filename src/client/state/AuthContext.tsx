/**
 * DocSure AI - Authentication State Context
 * Manages user identity, session tokens, and one-click persona switching
 * for enterprise reviewers & SIH hackathon evaluation.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../shared/types.ts';
import {
  apiRequest,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from '../utils/api.ts';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
  activeScanId: string | null;
  setActiveScanId: (id: string | null) => void;
  viewScanReport: (id: string) => void;
  viewScanEvidence: (id: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSidebarPinned: boolean;
  toggleSidebarPinned: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, name: string, pass: string, org?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quickSwitchDemo: (role: UserRole) => Promise<void>;
  toggle2FA: (enable: boolean) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('docsure_sidebar_pinned');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  const viewScanReport = (id: string) => {
    setActiveScanId(id);
    setCurrentView('reports');
  };

  const viewScanEvidence = (id: string) => {
    setActiveScanId(id);
    setCurrentView('evidence');
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleSidebarPinned = () => {
    setIsSidebarPinned((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('docsure_sidebar_pinned', String(next));
      }
      return next;
    });
  };

  const refreshUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    const res = await apiRequest<UserProfile>('/api/auth/me');
    if (res.success && res.data) {
      setUser(res.data);
    } else {
      clearStoredToken();
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Attempt auto-login with default demo user on fresh preview if no session exists
    const init = async () => {
      const existingToken = getStoredToken();
      if (existingToken) {
        await refreshUser();
      } else {
        // Automatically authenticate as Aarav (USER) for smooth first-turn SIH review
        await quickSwitchDemo('USER');
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await apiRequest<{ user: UserProfile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Login failed' };
  };

  const signup = async (email: string, name: string, pass: string, org?: string) => {
    const res = await apiRequest<{ user: UserProfile; token: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password: pass, organization: org }),
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Signup failed' };
  };

  const logout = async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    clearStoredToken();
    setToken(null);
    setUser(null);
    setCurrentView('login');
  };

  // One-click demo switch for seamless SIH and architectural evaluation
  const quickSwitchDemo = async (role: UserRole) => {
    const credentials: Record<UserRole, { email: string; pass: string }> = {
      USER: { email: 'user@docsure.ai', pass: 'User@1234' },
      REVIEWER: { email: 'reviewer@docsure.ai', pass: 'Reviewer@1234' },
      ADMIN: { email: 'admin@docsure.ai', pass: 'Admin@1234' },
    };

    const target = credentials[role];
    const res = await apiRequest<{ user: UserProfile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: target.email, password: target.pass }),
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const toggle2FA = async (enable: boolean) => {
    const res = await apiRequest('/api/auth/2fa', {
      method: 'POST',
      body: JSON.stringify({ enable }),
    });
    if (res.success) {
      if (user) setUser({ ...user, twoFactorEnabled: enable });
      return true;
    }
    return false;
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    const res = await apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
    });
    return Boolean(res.success);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentView,
        setCurrentView,
        activeScanId,
        setActiveScanId,
        viewScanReport,
        viewScanEvidence,
        isSidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        isSidebarPinned,
        toggleSidebarPinned,
        login,
        signup,
        logout,
        quickSwitchDemo,
        toggle2FA,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
