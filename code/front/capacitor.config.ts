import type {CapacitorConfig} from '@capacitor/cli';

const CAPACITOR_ANDROID_STUDIO_PATH = 'C:/Users/Usuario/AppData/Local/Android/Sdk';
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'front',
  webDir: 'www',
  plugins: { // Habilito a la aplicación a guardar las cookies
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    }
  }

};

export default config;
