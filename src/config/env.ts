import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 3000;

/**
 * Resolve a URL da API:
 * 1. EXPO_PUBLIC_API_URL (se definida no .env);
 * 2. IP do computador que roda o Metro (hostUri do Expo) — o celular já alcança esse IP,
 *    pois foi por ele que baixou o bundle;
 * 3. fallback para emulador Android (10.0.2.2) ou localhost (simulador iOS / web).
 */
export function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri; // ex.: "192.168.0.10:8081"
  const host = hostUri?.split(':')[0];
  if (host && !host.includes('exp.direct')) return `http://${host}:${API_PORT}`;

  return Platform.OS === 'android' ? `http://10.0.2.2:${API_PORT}` : `http://localhost:${API_PORT}`;
}

export const API_URL = resolveApiUrl();
