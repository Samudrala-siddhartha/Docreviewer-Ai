import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [platformName, setPlatformName] = useState<string>('Device');
  const [browserName, setBrowserName] = useState<string>('Browser');
  const [swActive, setSwActive] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');
    setIsInstalled(isStandalone);

    // Detect platform & browser
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isIosDev = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDev = /android/.test(userAgent);
    const isMac = /macintosh|mac os x/.test(userAgent) && !isIosDev;
    const isWindows = /windows/.test(userAgent);
    const isLinux = /linux/.test(userAgent) && !isAndroidDev;

    setIsIOS(isIosDev);
    setIsAndroid(isAndroidDev);
    setIsDesktop(!isIosDev && !isAndroidDev);

    if (isIosDev) setPlatformName('iOS (iPhone / iPad)');
    else if (isAndroidDev) setPlatformName('Android Phone / Tablet');
    else if (isMac) setPlatformName('macOS Desktop');
    else if (isWindows) setPlatformName('Windows PC');
    else if (isLinux) setPlatformName('Linux Desktop');
    else setPlatformName('Personal Device');

    if (/edg\//.test(userAgent)) setBrowserName('Microsoft Edge');
    else if (/chrome|crios/.test(userAgent) && !/edg\//.test(userAgent)) setBrowserName('Google Chrome');
    else if (/safari/.test(userAgent) && !/chrome|crios|edg/.test(userAgent)) setBrowserName('Apple Safari');
    else if (/firefox|fxios/.test(userAgent)) setBrowserName('Mozilla Firefox');
    else setBrowserName('Web Browser');

    // Check service worker state
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.active) setSwActive(true);
      }).catch(() => {});
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isDesktop,
    platformName,
    browserName,
    swActive,
    install,
  };
}

