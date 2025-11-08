import { IntentType } from '../types';

const AUTOMATION_KEYWORDS = [
  'open',
  'launch',
  'start',
  'send',
  'text',
  'message',
  'call',
  'dial',
  'search',
  'play',
  'pause',
  'stop',
  'take',
  'photo',
  'picture',
  'screenshot',
  'swipe',
  'scroll',
  'tap',
  'click',
  'press',
  'turn on',
  'turn off',
  'enable',
  'disable',
  'set alarm',
  'remind me',
  'navigate to',
  'go to',
];

export const detectIntent = (message: string): IntentType => {
  const lowerMessage = message.toLowerCase().trim();
  
  const hasAutomationKeyword = AUTOMATION_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  const hasActionPattern = /^(open|launch|start|send|call|text|search|play|take|turn|set|navigate|go to)\s+/i.test(lowerMessage);
  
  if (hasAutomationKeyword || hasActionPattern) {
    return 'automation';
  }
  
  return 'chat';
};
