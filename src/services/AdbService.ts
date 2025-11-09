import { AutomationStep } from '../types';
import { ADB_AGENT_URL } from '../config/adb.config';

export class AdbService {
  private baseUrl: string;

  constructor(baseUrl: string = ADB_AGENT_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if ADB agent is connected and device is available
   */
  async checkConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      console.log('Attempting to connect to ADB agent at:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        return { connected: false, message: 'ADB agent not responding' };
      }

      const data = await response.json();
      return {
        connected: data.connected,
        message: data.message || 'Unknown status',
      };
    } catch (error) {
      console.error('ADB connection check failed:', error);
      return {
        connected: false,
        message: 'Cannot reach ADB agent. Make sure it is running on your PC.',
      };
    }
  }

  /**
   * Search for a contact by name
   */
  async searchContact(query: string): Promise<{
    success: boolean;
    contact: { name: string; number: string } | null;
    error?: string;
    suggestions?: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      return await response.json();
    } catch (error) {
      console.error('Contact search failed:', error);
      return {
        success: false,
        contact: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all contacts from device
   */
  async getAllContacts(): Promise<{ name: string; number: string }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      return data.contacts || [];
    } catch (error) {
      console.error('Failed to get contacts:', error);
      return [];
    }
  }

  /**
   * Execute a single automation step
   */
  async executeStep(step: AutomationStep): Promise<{
    success: boolean;
    output?: string;
    error?: string;
  }> {
    try {
      let endpoint = '';
      let body: any = {};

      switch (step.action) {
        case 'open_url':
          endpoint = '/open-url';
          body = { url: step.target, browser: step.browser };
          break;

        case 'open_app':
          endpoint = '/open-app';
          body = { packageName: step.target };
          break;

        case 'whatsapp':
          endpoint = '/whatsapp';
          body = { contact: step.target, message: step.text };
          break;

        case 'call':
          endpoint = '/call';
          body = { contact: step.target };
          break;

        case 'email':
          endpoint = '/email';
          body = { to: step.target, subject: step.subject, body: step.text };
          break;

        case 'tap':
          endpoint = '/tap';
          body = { x: step.x, y: step.y };
          break;

        case 'type':
          endpoint = '/type';
          body = { text: step.text };
          break;

        case 'key':
          endpoint = '/key';
          body = { keycode: step.keycode };
          break;

        case 'wait':
          // Handle wait locally
          const waitTime = parseInt(step.target || '1000');
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return { success: true, output: `Waited ${waitTime}ms` };

        default:
          return { success: false, error: `Unknown action: ${step.action}` };
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      return await response.json();
    } catch (error) {
      console.error('Step execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute a complete automation plan
   */
  async executePlan(steps: AutomationStep[]): Promise<{
    success: boolean;
    results: Array<{
      step: string;
      reasoning: string;
      success: boolean;
      output?: string;
      error?: string;
    }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/execute-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });

      return await response.json();
    } catch (error) {
      console.error('Plan execution failed:', error);
      return {
        success: false,
        results: [{
          step: 'error',
          reasoning: 'Failed to execute plan',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/screenshot`);
      if (!response.ok) return null;
      return await response.blob();
    } catch (error) {
      console.error('Screenshot failed:', error);
      return null;
    }
  }

  /**
   * Get UI hierarchy dump
   */
  async getUiDump(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/ui-dump`);
      const data = await response.json();
      return data.success ? data.xml : null;
    } catch (error) {
      console.error('UI dump failed:', error);
      return null;
    }
  }
}
