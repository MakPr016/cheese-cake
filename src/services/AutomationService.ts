import { AutomationStep } from '../types';

export class AutomationService {
  async executePlan(
    steps: AutomationStep[],
    onStepUpdate: (stepIndex: number, status: AutomationStep['status']) => void
  ): Promise<void> {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      onStepUpdate(i, 'running');
      
      await this.simulateExecution(step);
      
      onStepUpdate(i, 'completed');
    }
  }

  private async simulateExecution(step: AutomationStep): Promise<void> {
    const baseDelay = 1000;
    
    const delays: Record<AutomationStep['action'], number> = {
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

    return true;
  }

  estimateExecutionTime(steps: AutomationStep[]): number {
    const times: Record<AutomationStep['action'], number> = {
      open_app: 1.5,
      tap: 0.8,
      type: 2,
      swipe: 0.6,
      scroll: 0.8,
      wait: 2,
    };

    return steps.reduce((total, step) => {
      return total + (times[step.action] || 1);
    }, 0);
  }
}
