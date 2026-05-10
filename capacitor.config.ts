import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shuatsphere.app',
  appName: 'SHUATSPHERE',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentSecurityPolicy: "default-src 'self' data: https: https: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: wss:; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
    scheme: 'shuatsphere',
  },
  android: {
    backgroundColor: '#7C3AED',
    allowBackup: true,
    fullScreen: false,
    captureInput: false,
    preserveScrollOnBack: true,
    minifyEnabled: false,
    buildOptions: {
      suppressBuildWarnings: false,
    },
  },
};

export default config;