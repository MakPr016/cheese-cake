import { AutomationStep } from '../types';

interface MacroDroidWebhook {
  id: string;
  name: string;
  description: string;
}

interface MacroDroidConfig {
  webhooks: Record<string, MacroDroidWebhook>;
  baseUrl: string;
  timeout: number;
}

export class AutomationService {
  private config: MacroDroidConfig;
  
  constructor() {
    // NOTE: The baseUrl and webhook IDs shown here are placeholders.
    // In a production app, users would configure their actual MacroDroid webhook URLs
    // after creating macros in the MacroDroid app. Each webhook URL is unique per user.
    // For this MVP, we're using the standard format. Users need to replace webhook IDs
    // with their actual IDs from MacroDroid (e.g., using updateWebhookConfig method).
    this.config = {
      baseUrl: 'https://trigger.macrodroid.com',
      timeout: 10000,
      webhooks: {
        'open_browser': {
          id: 'WEBHOOK_OPEN_BROWSER',
          name: 'Open Browser',
          description: 'Opens default browser'
        },
        'search_google': {
          id: 'WEBHOOK_SEARCH_GOOGLE',
          name: 'Google Search',
          description: 'Search on Google'
        },
        'open_url': {
          id: 'WEBHOOK_OPEN_URL',
          name: 'Open URL',
          description: 'Open specific URL'
        },
        'make_call': {
          id: 'WEBHOOK_MAKE_CALL',
          name: 'Make Call',
          description: 'Dial phone number'
        },
        'send_sms': {
          id: 'WEBHOOK_SEND_SMS',
          name: 'Send SMS',
          description: 'Send text message'
        },
        'open_app': {
          id: 'WEBHOOK_OPEN_APP',
          name: 'Open App',
          description: 'Open any installed app'
        },
        'tap': {
          id: 'WEBHOOK_TAP',
          name: 'Tap Screen',
          description: 'Tap at coordinates'
        },
        'type': {
          id: 'WEBHOOK_TYPE',
          name: 'Type Text',
          description: 'Type text input'
        },
        'swipe': {
          id: 'WEBHOOK_SWIPE',
          name: 'Swipe',
          description: 'Swipe gesture'
        },
        'scroll': {
          id: 'WEBHOOK_SCROLL',
          name: 'Scroll',
          description: 'Scroll screen'
        },
        'go_back': {
          id: 'WEBHOOK_GO_BACK',
          name: 'Go Back',
          description: 'Press back button'
        },
        'go_home': {
          id: 'WEBHOOK_GO_HOME',
          name: 'Go Home',
          description: 'Go to home screen'
        },
        'wait': {
          id: 'WEBHOOK_WAIT',
          name: 'Wait',
          description: 'Wait for duration'
        },
      }
    };
  }

  async executePlan(
    steps: AutomationStep[],
    onStepUpdate: (stepIndex: number, status: AutomationStep['status']) => void
  ): Promise<void> {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      try {
        onStepUpdate(i, 'running');
        
        await this.executeStep(step);
        
        await this.waitForAction(step);
        
        onStepUpdate(i, 'completed');
      } catch (error) {
        console.error(`Step ${i} failed:`, error);
        onStepUpdate(i, 'failed');
        throw error;
      }
    }
  }

  private async executeStep(step: AutomationStep): Promise<void> {
    const webhookKey = this.getWebhookKey(step);
    const webhook = this.config.webhooks[webhookKey];
    
    if (!webhook) {
      throw new Error(`No webhook configured for action: ${step.action}`);
    }

    const url = `${this.config.baseUrl}/${webhook.id}`;
    
    const payload = this.buildPayload(step);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }
      
      const result = await response.text();
      console.log(`Step executed: ${step.action}`, result);
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Webhook request timed out');
      }
      
      throw new Error(`Failed to execute step: ${error.message}`);
    }
  }

  private getWebhookKey(step: AutomationStep): string {
    if (step.action === 'open_app') {
      if (step.target.toLowerCase().includes('browser') || 
          step.target.toLowerCase().includes('chrome')) {
        return 'open_browser';
      }
      return 'open_app';
    }
    
    if (step.action === 'type' && step.target.toLowerCase().includes('search')) {
      return 'search_google';
    }
    
    return step.action;
  }

  private buildPayload(step: AutomationStep): Record<string, any> {
    const payload: Record<string, any> = {
      action: step.action,
      target: step.target,
    };
    
    switch (step.action) {
      case 'type':
        payload.text = step.text || '';
        break;
      
      case 'search_google':
        payload.query = step.text || step.target;
        payload.text = step.text || step.target;
        break;
      
      case 'send_sms':
        payload.message = step.text || '';
        payload.text = step.text || '';
        payload.contact = step.target;
        break;
      
      case 'make_call':
        payload.contact = step.target;
        break;
      
      case 'open_url':
        payload.url = step.target;
        break;
        
      case 'tap':
        if ('x' in step && 'y' in step) {
          payload.x = step.x;
          payload.y = step.y;
        }
        break;
        
      case 'swipe':
        if ('direction' in step) {
          payload.direction = step.direction;
        }
        break;
        
      case 'wait':
        payload.duration = step.duration || 2000;
        break;
        
      case 'open_app':
      case 'open_browser':
        payload.package = this.getPackageName(step.target);
        break;
    }
    
    return payload;
  }

  private getPackageName(appName: string): string {
    const packageMap: Record<string, string> = {
      'browser': 'com.android.chrome',
      'chrome': 'com.android.chrome',
      'firefox': 'org.mozilla.firefox',
      'messages': 'com.google.android.apps.messaging',
      'phone': 'com.google.android.dialer',
      'contacts': 'com.android.contacts',
      'settings': 'com.android.settings',
      'camera': 'com.android.camera2',
      'gallery': 'com.google.android.apps.photos',
      'maps': 'com.google.android.apps.maps',
      'gmail': 'com.google.android.gm',
      'youtube': 'com.google.android.youtube',
      'whatsapp': 'com.whatsapp',
      'telegram': 'org.telegram.messenger',
    };
    
    const normalized = appName.toLowerCase().trim();
    return packageMap[normalized] || appName;
  }

  private async waitForAction(step: AutomationStep): Promise<void> {
    const delays: Record<AutomationStep['action'], number> = {
      open_app: 2000,
      open_browser: 2000,
      search_google: 1500,
      open_url: 2000,
      make_call: 1000,
      send_sms: 1000,
      tap: 500,
      type: 1000,
      swipe: 500,
      scroll: 500,
      go_back: 500,
      go_home: 500,
      wait: step.duration || 2000,
    };

    const delay = delays[step.action] || 1000;
    
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  validateStep(step: AutomationStep): boolean {
    if (!step.action || !step.target) {
      return false;
    }

    if (step.action === 'type' && !step.text) {
      return false;
    }
    
    const webhookKey = this.getWebhookKey(step);
    if (!this.config.webhooks[webhookKey]) {
      return false;
    }

    return true;
  }

  estimateExecutionTime(steps: AutomationStep[]): number {
    const times: Record<AutomationStep['action'], number> = {
      open_app: 2.5,
      open_browser: 2.5,
      search_google: 2,
      open_url: 2,
      make_call: 1.5,
      send_sms: 1.5,
      tap: 1,
      type: 2,
      swipe: 1,
      scroll: 1,
      go_back: 0.5,
      go_home: 0.5,
      wait: 2,
    };

    return steps.reduce((total, step) => {
      return total + (times[step.action] || 1.5);
    }, 0);
  }

  updateWebhookConfig(action: string, webhookId: string): void {
    if (this.config.webhooks[action]) {
      this.config.webhooks[action].id = webhookId;
    }
  }

  getWebhookConfig(): Record<string, MacroDroidWebhook> {
    return { ...this.config.webhooks };
  }

  async testWebhook(action: string): Promise<boolean> {
    const webhook = this.config.webhooks[action];
    if (!webhook) {
      return false;
    }

    try {
      const url = `${this.config.baseUrl}/${webhook.id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Webhook test failed for ${action}:`, error);
      return false;
    }
  }
}
