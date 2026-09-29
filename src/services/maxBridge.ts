declare global {
  interface Window {
    WebApp?: {
      initData?: string;
      initDataUnsafe?: {
        query_id?: string;
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
          photo_url?: string;
        };
        chat?: {
          id: number;
          type: 'DIALOG' | 'CHAT' | 'CHANNEL';
        };
        start_param?: string;
        auth_date?: number;
        hash?: string;
      };
      platform?: 'ios' | 'android' | 'desktop' | 'web';
      version?: string;
      deviceName?: string;
      ready?: () => Promise<void>;
      close?: () => void;
      getLaunchContext?: () => Promise<{ entryPoint: 'tabbar' | 'default' }>;
      BackButton?: {
        isVisible: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
      };
      HapticFeedback?: {
        impactOccurred: (
          impactStyle: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
          disableVibrationFallback?: boolean
        ) => void;
        notificationOccurred: (
          notificationType: 'error' | 'success' | 'warning',
          disableVibrationFallback?: boolean
        ) => void;
        selectionChanged: (disableVibrationFallback?: boolean) => void;
      };
      openLink?: (url: string) => void;
      openMaxLink?: (url: string) => void;
      shareMaxContent?: (params: { text?: string; link?: string; mid?: string; chatType?: 'DIALOG' | 'CHAT' }) => void;
      shareContent?: (params: { text?: string; link?: string }) => void;
      enableClosingConfirmation?: () => void;
      disableClosingConfirmation?: () => void;
    };
  }
}

export class MaxBridgeService {
  private static instance: MaxBridgeService;
  public isAvailable: boolean = false;

  private constructor() {
    this.isAvailable = typeof window !== 'undefined' && !!window.WebApp;
    if (this.isAvailable && window.WebApp?.ready) {
      try {
        window.WebApp.ready();
      } catch (err) {
        console.warn('[MAX Bridge] Failed to execute WebApp.ready()', err);
      }
    }
  }

  public static getInstance(): MaxBridgeService {
    if (!MaxBridgeService.instance) {
      MaxBridgeService.instance = new MaxBridgeService();
    }
    return MaxBridgeService.instance;
  }

  public getPlatform(): string {
    if (typeof window !== 'undefined' && window.WebApp?.platform) {
      return window.WebApp.platform;
    }
    return 'web (simulation)';
  }

  public getUser() {
    return window?.WebApp?.initDataUnsafe?.user || null;
  }

  public getStartParam(): string | null {
    return window?.WebApp?.initDataUnsafe?.start_param || null;
  }

  public haptic(style: 'light' | 'medium' | 'heavy' | 'soft' = 'light') {
    try {
      if (window?.WebApp?.HapticFeedback?.impactOccurred) {
        window.WebApp.HapticFeedback.impactOccurred(style);
      } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } catch {

    }
  }

  public hapticNotification(type: 'success' | 'warning' | 'error') {
    try {
      if (window?.WebApp?.HapticFeedback?.notificationOccurred) {
        window.WebApp.HapticFeedback.notificationOccurred(type);
      } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(type === 'error' ? [40, 40, 40] : [20, 20]);
      }
    } catch {

    }
  }

  public showBackButton(callback: () => void) {
    if (window?.WebApp?.BackButton) {
      window.WebApp.BackButton.show();
      window.WebApp.BackButton.onClick(callback);
    }
  }

  public hideBackButton() {
    if (window?.WebApp?.BackButton) {
      window.WebApp.BackButton.hide();
    }
  }

  public closeApp() {
    if (window?.WebApp?.close) {
      window.WebApp.close();
    } else {
      console.log('[MAX Bridge] close() called');
    }
  }

  public shareCase(title: string, link: string) {
    const text = `🔥 Проект на бирже МАХ Кейсы:\n«${title}»\nСмотри в мини-приложении:`;
    if (window?.WebApp?.shareMaxContent) {
      window.WebApp.shareMaxContent({ text, link });
    } else if (window?.WebApp?.shareContent) {
      window.WebApp.shareContent({ text, link });
    } else if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, text, url: link }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${text} ${link}`);
      alert('Ссылка на кейс скопирована для отправки в МАХ!');
    }
  }
}

export const maxBridge = MaxBridgeService.getInstance();
