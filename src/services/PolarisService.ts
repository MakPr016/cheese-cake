import OpenAI from 'openai';
import { Message, AutomationStep } from '../types';

export class PolarisService {
  private client: OpenAI;
  private apiKey: string;
  private model = 'openrouter/polaris-alpha';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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

  async transcribeAudio(audioUri: string): Promise<string> {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      } as any);
      formData.append('model', 'openai/whisper-1');

      const transcriptionResponse = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        const errorText = await transcriptionResponse.text();
        console.error('Transcription API error:', errorText);
        throw new Error(`Transcription failed: ${transcriptionResponse.statusText}`);
      }

      const result = await transcriptionResponse.json();
      return result.text || '';
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async planTask(task: string): Promise<AutomationStep[]> {
    try {
      const prompt = `You are a mobile automation planner. Break down this task into specific automation steps.

IMPORTANT: Use these REAL actions that actually work:
- whatsapp: Send WhatsApp message (target = phone number with country code, text = message)
- email: Send email (target = email address, text = message body)
- call: Make phone call (target = phone number with country code)
- wait: Wait for a few seconds

DO NOT use these actions (they only simulate, don't actually work):
- tap, type, swipe, scroll, open_app

Task: ${task}

Return ONLY a JSON array of steps. Each step must have:
- action: one of [whatsapp, email, call, wait]
- target: phone number (for whatsapp/call) or email address (for email)
- text: message content (for whatsapp/email)
- reasoning: why this step is needed

Example formats:
For WhatsApp: {"action": "whatsapp", "target": "1234567890", "text": "Hello John!", "reasoning": "Send WhatsApp message to John"}
For Email: {"action": "email", "target": "[email protected]", "text": "Hello, this is a test email.", "reasoning": "Send email to John"}
For Call: {"action": "call", "target": "1234567890", "reasoning": "Call John's phone"}

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
