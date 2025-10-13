
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quotetok.app',
  appName: 'QuoteTok',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
