import { Capacitor, registerPlugin } from '@capacitor/core';

export interface BlurGuardSettingsPlugin {
  openUsageAccessSettings(): Promise<void>;
  openNotificationSettings(): Promise<void>;
  checkUsagePermission(): Promise<{ granted: boolean }>;
}

// Register the native plugin. The web fallback is a no-op so the
// same code works in both browser dev and Android.
export const BlurGuardSettings = registerPlugin<BlurGuardSettingsPlugin>(
  'BlurGuardSettings',
  {
    web: {
      async openUsageAccessSettings() {
        console.log('[web] openUsageAccessSettings – no-op');
      },
      async openNotificationSettings() {
        console.log('[web] openNotificationSettings – no-op');
      },
      async checkUsagePermission() {
        return { granted: false };
      },
    },
  }
);

export const isNative = () => Capacitor.isNativePlatform();
