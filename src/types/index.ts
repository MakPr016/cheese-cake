export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface AutomationStep {
  action: 'tap' | 'type' | 'swipe' | 'scroll' | 'wait' | 'open_app' | 
          'open_browser' | 'search_google' | 'open_url' | 'make_call' | 
          'send_sms' | 'go_back' | 'go_home';
  target: string;
  text?: string;
  reasoning: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  x?: number;
  y?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export type IntentType = 'chat' | 'automation';

export interface ApiKeyConfig {
  apiKey: string;
  timestamp: number;
}
