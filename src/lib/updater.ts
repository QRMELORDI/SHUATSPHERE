import { App } from '@capacitor/app';
import { toast } from 'sonner';

const APP_VERSION = '1.0.0';

const getUpdateUrl = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocal ? 'http://localhost:8000/api/version' : 'https://shuatsphere.onrender.com/api/version';
};

interface VersionInfo {
  version: string;
  minVersion: string;
  updateUrl: string;
  forceUpdate: boolean;
}

export async function checkForUpdates(): Promise<VersionInfo | null> {
  try {
    const response = await fetch(getUpdateUrl());
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Update check skipped:', error);
  }
  return null;
}

export function getCurrentVersion(): string {
  return APP_VERSION;
}

export async function initializeAutoUpdater(): Promise<void> {
  try {
    // Check on startup
    const initialUpdate = await checkForUpdates();
    if (initialUpdate && initialUpdate.version !== APP_VERSION) {
      showUpdateToast(initialUpdate);
    }

    // Check when app comes to foreground
    App.addListener('appStateChange', async (state) => {
      if (state.isActive) {
        const update = await checkForUpdates();
        if (update && update.version !== APP_VERSION) {
          showUpdateToast(update);
        }
      }
    });
  } catch (error) {
    console.log('Auto-updater initialization skipped');
  }
}

function showUpdateToast(update: VersionInfo) {
  toast.info(`Update Available: v${update.version}`, {
    description: update.forceUpdate 
      ? 'A critical update is required to continue.' 
      : 'A new version of SHUATSPHERE is available.',
    duration: update.forceUpdate ? Infinity : 10000,
    action: {
      label: 'Update Now',
      onClick: () => window.open(update.updateUrl, '_blank')
    }
  });
}

export function openAppStore(): void {
  window.open('https://play.google.com/store/apps/details?id=com.shuatsphere.app', '_blank');
}