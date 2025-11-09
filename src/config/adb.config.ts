/**
 * ADB Agent Configuration
 * 
 * Set ADB_AGENT_HOST in app.json extra config or use default localhost
 * This allows flexibility without hardcoding IPs
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get host from config or use localhost
const getAdbHost = (): string => {
  // Check if host is configured in app.json
  const configHost = (Constants.expoConfig?.extra as any)?.ADB_AGENT_HOST;
  
  if (configHost) {
    return configHost;
  }
  
  // Default to localhost (works for emulator and web)
  // For physical device, user needs to set ADB_AGENT_HOST in app.json
  return 'localhost';
};

export const ADB_AGENT_PORT = 3000;
export const ADB_AGENT_HOST = getAdbHost();
export const ADB_AGENT_URL = `http://${ADB_AGENT_HOST}:${ADB_AGENT_PORT}`;
