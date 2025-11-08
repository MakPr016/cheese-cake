import { AutomationStep } from '../types';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

export class AutomationService {
  async executePlan(
    steps: AutomationStep[],
    onStepUpdate: (stepIndex: number, status: AutomationStep['status']) => void
  ): Promise<void> {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      onStepUpdate(i, 'running');
      
      try {
        await this.executeStep(step);
        onStepUpdate(i, 'completed');
      } catch (error) {
        console.error('Step execution failed:', error);
        onStepUpdate(i, 'failed');
        Alert.alert('Execution Failed', `Failed to execute: ${step.action} - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  private async executeStep(step: AutomationStep): Promise<void> {
    switch (step.action) {
      case 'whatsapp':
        await this.executeWhatsApp(step);
        break;
      case 'email':
        await this.executeEmail(step);
        break;
      case 'call':
        await this.executeCall(step);
        break;
      case 'wait':
        await this.executeWait();
        break;
      default:
        await this.simulateExecution(step);
        break;
    }
  }

  private async executeWhatsApp(step: AutomationStep): Promise<void> {
    const phoneNumber = step.target.replace(/\D/g, '');
    const message = encodeURIComponent(step.text || '');
    
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error('WhatsApp is not installed on your device');
    }
    
    await Linking.openURL(url);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async executeEmail(step: AutomationStep): Promise<void> {
    const email = step.target;
    const subject = encodeURIComponent('Message from AI Assistant');
    const body = encodeURIComponent(step.text || '');
    
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error('Email app is not available on your device');
    }
    
    await Linking.openURL(url);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async executeCall(step: AutomationStep): Promise<void> {
    const phoneNumber = step.target.replace(/\D/g, '');
    const url = `tel:${phoneNumber}`;
    
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error('Phone dialer is not available on your device');
    }
    
    await Linking.openURL(url);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async executeWait(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async simulateExecution(step: AutomationStep): Promise<void> {
    const baseDelay = 1000;
    
    const delays: Record<string, number> = {
      open_app: 1500,
      tap: 800,
      type: step.text ? step.text.length * 100 : 1000,
      swipe: 600,
      scroll: 800,
      wait: 2000,
    };

    const delay = delays[step.action] || baseDelay;
    
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  validateStep(step: AutomationStep): boolean {
    if (!step.action || !step.target) {
      return false;
    }

    if (step.action === 'type' && !step.text) {
      return false;
    }

    if (step.action === 'whatsapp' && !step.text) {
      return false;
    }

    if (step.action === 'email' && !step.text) {
      return false;
    }

    return true;
  }

  estimateExecutionTime(steps: AutomationStep[]): number {
    const times: Record<string, number> = {
      open_app: 1.5,
      tap: 0.8,
      type: 2,
      swipe: 0.6,
      scroll: 0.8,
      wait: 2,
      whatsapp: 3,
      email: 3,
      call: 2,
    };

    return steps.reduce((total, step) => {
      return total + (times[step.action] || 1);
    }, 0);
  }
}
