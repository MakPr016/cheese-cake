import { supabase, isSupabaseConfigured } from './SupabaseClient';
import { Message } from '../types';
import OpenAI from 'openai';

export class VectorStorageService {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        dangerouslyAllowBrowser: true,
      });
    }
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openai) {
      console.error('OpenAI client not initialized');
      return null;
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return null;
    }
  }

  async saveMessage(message: Message): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping vector storage');
      return false;
    }

    try {
      const embedding = await this.generateEmbedding(message.content);
      
      if (!embedding) {
        console.error('Failed to generate embedding for message');
        return false;
      }

      const { error } = await supabase!
        .from('chat_messages')
        .insert({
          role: message.role,
          content: message.content,
          embedding: embedding,
        });

      if (error) {
        console.error('Error saving message to Supabase:', error);
        return false;
      }

      console.log('Message saved to vector storage');
      return true;
    } catch (error) {
      console.error('Error in saveMessage:', error);
      return false;
    }
  }

  async getChatHistory(limit: number = 50): Promise<Message[] | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('chat_messages')
        .select('role, content, created_at')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching chat history:', error);
        return null;
      }

      if (!data) {
        console.error('No data returned from chat_messages query');
        return null;
      }

      return data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
      }));
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      return null;
    }
  }

  async searchSimilarMessages(query: string, limit: number = 5): Promise<Array<Message & { similarity: number }>> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning empty results');
      return [];
    }

    try {
      const queryEmbedding = await this.generateEmbedding(query);
      
      if (!queryEmbedding) {
        console.error('Failed to generate query embedding');
        return [];
      }

      const { data, error } = await supabase!
        .rpc('search_similar_messages', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: limit,
        });

      if (error) {
        console.error('Error searching similar messages:', error);
        return [];
      }

      return (data || []).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        similarity: msg.similarity,
      }));
    } catch (error) {
      console.error('Error in searchSimilarMessages:', error);
      return [];
    }
  }

  async clearAllMessages(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping clear');
      return false;
    }

    try {
      const { error } = await supabase!
        .from('chat_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('Error clearing messages:', error);
        return false;
      }

      console.log('All messages cleared from vector storage');
      return true;
    } catch (error) {
      console.error('Error in clearAllMessages:', error);
      return false;
    }
  }
}
