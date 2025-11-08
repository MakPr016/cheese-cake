import OpenAI from 'openai';
import { Message, AutomationStep } from '../types';

export class PolarisService {
  private client: OpenAI;
  private model = 'openrouter/polaris-alpha';

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true,
    });
  }

  async chat(message: string, history: Message[] = []): Promise<string> {
    try {
      const messages = [
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: message,
        },
      ];

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error(`Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeImage(base64Image: string, question: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: question },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || 'No analysis generated';
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async planTask(task: string): Promise<AutomationStep[]> {
    try {
      const prompt = `You are an Android automation planner. Break down this task into specific automation steps.
      
Task: ${task}

Return ONLY a JSON array of steps. Each step must have:
- action: one of [tap, type, swipe, scroll, wait, open_app]
- target: specific element/app name
- text: (optional) text to type
- reasoning: why this step is needed

Example format:
[
  {"action": "open_app", "target": "Messages", "reasoning": "Need to access messaging app"},
  {"action": "tap", "target": "New message button", "reasoning": "Start composing new message"},
  {"action": "type", "target": "Recipient field", "text": "John", "reasoning": "Enter recipient name"}
]

Return only the JSON array, no other text.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content || '[]';
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        const steps = JSON.parse(jsonStr);
        
        return steps.map((step: any) => ({
          ...step,
          status: 'pending' as const,
        }));
      } catch (parseError) {
        console.error('Failed to parse automation steps:', content);
        return [
          {
            action: 'tap' as const,
            target: task,
            reasoning: 'Manual planning required - AI response was not in expected format',
            status: 'pending' as const,
          },
        ];
      }
    } catch (error) {
      console.error('Task planning error:', error);
      throw new Error(`Failed to plan task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
