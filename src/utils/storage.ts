import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, ApiKeyConfig } from '../types';

const KEYS = {
  API_KEY: '@ai_assistant_api_key',
  CHAT_HISTORY: '@ai_assistant_chat_history',
};

const MAX_MESSAGES = 20;

export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    const config: ApiKeyConfig = {
      apiKey,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(KEYS.API_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

export const getApiKey = async (): Promise<string | null> => {
  try {
    const configStr = await AsyncStorage.getItem(KEYS.API_KEY);
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
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Error saving chat history:', error);
    throw error;
  }
};

export const getChatHistory = async (): Promise<Message[]> => {
  try {
    const historyStr = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    if (!historyStr) return [];
    
    return JSON.parse(historyStr);
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

export const clearChatHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

export const hasApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey();
  return !!apiKey;
};
