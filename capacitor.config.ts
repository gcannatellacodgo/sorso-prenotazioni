import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Sorso',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'LIGHT',          // 👈 QUESTO è il punto chiave
      backgroundColor: '#000000',
      overlaysWebView: false
    }
  }
};

export default config;
