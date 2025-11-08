import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Message, ApiKeyConfig } from '../types';

const KEYS = {
  API_KEY: '@ai_assistant_api_key',
  CHAT_HISTORY: '@ai_assistant_chat_history',
};

const MAX_MESSAGES = 20;

let memoryStorage: { [key: string]: string } = {};

const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      setItem: async (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch {
          memoryStorage[key] = value;
        }
      },
      getItem: async (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch {
          return memoryStorage[key] || null;
        }
      },
      removeItem: async (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch {
          delete memoryStorage[key];
        }
      },
    };
  }
  return AsyncStorage;
};

export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    const config: ApiKeyConfig = {
      apiKey,
      timestamp: Date.now(),
    };
    const storage = getStorage();
    await storage.setItem(KEYS.API_KEY, JSON.stringify(config));
    console.log('API key saved successfully');
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

export const getApiKey = async (): Promise<string | null> => {
  try {
    const storage = getStorage();
    const configStr = await storage.getItem(KEYS.API_KEY);
    console.log('Retrieved API key config:', configStr ? 'found' : 'not found');
    
    if (!configStr) return null;
    
    const config: ApiKeyConfig = JSON.parse(configStr);
    return config.apiKey;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

export const saveChatHistory = async (messages: Message[]): Promise<void> => {
  try {
    const limitedMessages = messages.slice(-MAX_MESSAGES);
    const storage = getStorage();
    await storage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(limitedMessages));
    console.log('Chat history saved:', limitedMessages.length, 'messages');
  } catch (error) {
    console.error('Error saving chat history:', error);
    throw error;
  }
};

export const getChatHistory = async (): Promise<Message[]> => {
  try {
    const storage = getStorage();
    const historyStr = await storage.getItem(KEYS.CHAT_HISTORY);
    
    if (!historyStr) return [];
    
    return JSON.parse(historyStr);
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

export const clearChatHistory = async (): Promise<void> => {
  try {
    const storage = getStorage();
    await storage.removeItem(KEYS.CHAT_HISTORY);
    console.log('Chat history cleared');
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

export const hasApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey();
  return !!apiKey;
};
