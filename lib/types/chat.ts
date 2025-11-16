/**
 * Type definitions for chat functionality
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Message[];
}

export interface ChatResponse {
  message: Message;
  error?: string;
}

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenAIError {
  message: string;
  type?: string;
  code?: string;
}
