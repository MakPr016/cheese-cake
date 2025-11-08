import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Message, ApiKeyConfig } from '../types';
import Constants from 'expo-constants';

const KEYS = {
  API_KEY: '@ai_assistant_api_key',
  USER_ID: '@ai_assistant_user_id',
};

const API_URL = Platform.OS === 'web' 
  ? `https://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000` 
  : 'http://localhost:3000';

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

const getUserId = async (): Promise<string> => {
  try {
    const storage = getStorage();
    let userId = await storage.getItem(KEYS.USER_ID);
    
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await storage.setItem(KEYS.USER_ID, userId);
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
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
    const userId = await getUserId();
    
    for (const message of messages) {
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: message.role,
          content: message.content,
        }),
      });
    }
    
    console.log('Chat history saved to cloud:', messages.length, 'messages');
  } catch (error) {
    console.error('Error saving chat history to cloud:', error);
    throw error;
  }
};

export const getChatHistory = async (): Promise<Message[]> => {
  try {
    const userId = await getUserId();
    const response = await fetch(`${API_URL}/api/messages/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    
    const data = await response.json();
    
    return data.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.createdAt).getTime(),
    }));
  } catch (error) {
    console.error('Error getting chat history from cloud:', error);
    return [];
  }
};

export const clearChatHistory = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    await fetch(`${API_URL}/api/messages/${userId}`, {
      method: 'DELETE',
    });
    console.log('Chat history cleared from cloud');
  } catch (error) {
    console.error('Error clearing chat history from cloud:', error);
    throw error;
  }
};

export const hasApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey();
  return !!apiKey;
};
