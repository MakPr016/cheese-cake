export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface AutomationStep {
  action: 'tap' | 'type' | 'swipe' | 'scroll' | 'wait' | 'open_app' | 'open_url' | 'whatsapp' | 'email' | 'call' | 'key';
  target: string;
  text?: string;
  reasoning: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  // Additional properties for specific actions
  browser?: string;      // For open_url: "opera", "chrome", etc.
  subject?: string;      // For email: subject line
  x?: number;            // For tap: x coordinate
  y?: number;            // For tap: y coordinate
  keycode?: number;      // For key: key code (HOME=3, BACK=4, ENTER=66)
}

export type IntentType = 'chat' | 'automation';

export interface ApiKeyConfig {
  apiKey: string;
  timestamp: number;
}
