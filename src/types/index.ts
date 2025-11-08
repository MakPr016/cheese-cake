export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface AutomationStep {
  action: 'tap' | 'type' | 'swipe' | 'scroll' | 'wait' | 'open_app' | 'whatsapp' | 'email' | 'call';
  target: string;
  text?: string;
  reasoning: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

export type IntentType = 'chat' | 'automation';

export interface ApiKeyConfig {
  apiKey: string;
  timestamp: number;
}
