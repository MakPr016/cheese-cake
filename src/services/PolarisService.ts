import OpenAI from 'openai';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
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
      const aaiKey = (Constants.expoConfig?.extra as any)?.ASSEMBLYAI_API_KEY as string | undefined;
      if (!aaiKey) {
        throw new Error('Missing AssemblyAI API key in app config (expo.extra.ASSEMBLYAI_API_KEY)');
      }

      console.log('Reading audio file from:', audioUri);

      // 1) Read the audio file using fetch (works with file:// URIs in React Native)
      const fileResponse = await fetch(audioUri);
      const audioBlob = await fileResponse.blob();

      // 2) Upload to AssemblyAI
      const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          authorization: aaiKey,
        },
        body: audioBlob,
      });
      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        console.error('AssemblyAI upload error:', errText);
        throw new Error(`Upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
      }
      const uploadJson = await uploadRes.json();
      const uploadUrl = uploadJson.upload_url as string;
      if (!uploadUrl) {
        throw new Error('AssemblyAI upload did not return upload_url');
      }

      // 3) Create transcript
      const createRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          authorization: aaiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ audio_url: uploadUrl }),
      });
      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error('AssemblyAI transcript create error:', errText);
        throw new Error(`Transcript creation failed: ${createRes.status} ${createRes.statusText}`);
      }
      const createJson = await createRes.json();
      const transcriptId = createJson.id as string;
      if (!transcriptId) {
        throw new Error('AssemblyAI did not return a transcript id');
      }

      // 4) Poll until completed
      const poll = async (): Promise<string> => {
        const statusRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { authorization: aaiKey, accept: 'application/json' },
        });
        if (!statusRes.ok) {
          const errText = await statusRes.text();
          console.error('AssemblyAI poll error:', errText);
          throw new Error(`Polling failed: ${statusRes.status} ${statusRes.statusText}`);
        }
        const statusJson = await statusRes.json();
        const status = statusJson.status as string;
        if (status === 'completed') return statusJson.text as string;
        if (status === 'error') throw new Error(statusJson.error || 'Transcription error');
        await new Promise(r => setTimeout(r, 1500));
        return poll();
      };

      const text = await poll();
      return text || '';
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async planTask(task: string): Promise<AutomationStep[]> {
    try {
      const prompt = `You are a mobile automation planner using ADB (Android Debug Bridge). Break down this task into specific automation steps.

AVAILABLE ACTIONS:
- open_url: Open URL in browser (target = URL, browser = "opera"|"chrome"|"default")
- open_app: Launch an app (target = package name like "com.instagram.android")
- whatsapp: Send WhatsApp message (target = contact name or phone, text = message)
- call: Make phone call (target = contact name or phone number)
- email: Send email (target = email address, text = message, subject = optional)
- wait: Wait/delay (target = milliseconds, e.g., "2000" for 2 seconds)
- tap: Tap screen (x, y coordinates)
- type: Type text (text = content to type)
- key: Press key (keycode = HOME:3, BACK:4, ENTER:66)

IMPORTANT RULES:
1. Contact names will be AUTO-RESOLVED - you can use "Jutin" instead of phone numbers
2. For Instagram/social media, use open_url with the browser parameter
3. Add wait steps between actions (1000-3000ms) for apps to load
4. Use descriptive reasoning for each step

Task: ${task}

Return ONLY a JSON array of steps. Each step must have:
- action: one of the available actions above
- target: the main target (URL, contact name, phone, email, etc.)
- text: message content (for whatsapp/email/type)
- browser: browser name (for open_url, e.g., "opera")
- subject: email subject (optional, for email)
- x, y: coordinates (for tap)
- keycode: key code (for key)
- reasoning: why this step is needed

Example formats:
Open URL: {"action": "open_url", "target": "https://instagram.com", "browser": "opera", "reasoning": "Open Instagram in Opera browser"}
WhatsApp: {"action": "whatsapp", "target": "Jutin", "text": "Are you coming?", "reasoning": "Message Jutin on WhatsApp"}
Call: {"action": "call", "target": "Jutin", "reasoning": "Call Jutin"}
Wait: {"action": "wait", "target": "2000", "reasoning": "Wait for app to load"}

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
            action: 'wait' as const,
            target: '1000',
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
