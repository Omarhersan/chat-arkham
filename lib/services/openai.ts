/**
 * OpenAI Service - Handles interactions with OpenAI fine-tuned model
 */

import OpenAI from 'openai';
import { OPENAI_CONFIG, CHAT_CONFIG } from '@/lib/config/constants';
import type { Message, OpenAIMessage } from '@/lib/types/chat';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

/**
 * Converts our Message format to OpenAI's expected format
 */
function formatMessagesForOpenAI(messages: Message[]): OpenAIMessage[] {
  return messages
    .slice(-CHAT_CONFIG.MAX_CONVERSATION_HISTORY) // Limit conversation history
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
}

/**
 * Calls the fine-tuned model with the conversation history
 */
export async function getAIResponse(messages: Message[]): Promise<string> {
  try {
    // Prepare messages with system prompt
    const formattedMessages: OpenAIMessage[] = [
      {
        role: 'system',
        content: OPENAI_CONFIG.SYSTEM_PROMPT,
      },
      ...formatMessagesForOpenAI(messages),
    ];

    // Call OpenAI API with fine-tuned model
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.MODEL_ID,
      messages: formattedMessages,
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      temperature: OPENAI_CONFIG.TEMPERATURE,
    });

    // Extract and return the assistant's response
    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response received from OpenAI');
    }

    return response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    
    throw new Error('Failed to get response from AI model');
  }
}

/**
 * Validates that the OpenAI API key is configured
 */
export function validateOpenAIConfig(): boolean {
  return !!process.env.OPEN_AI_API_KEY;
}

/**
 * Streams the AI response for better UX (optional feature)
 */
export async function* streamAIResponse(messages: Message[]): AsyncGenerator<string> {
  try {
    const formattedMessages: OpenAIMessage[] = [
      {
        role: 'system',
        content: OPENAI_CONFIG.SYSTEM_PROMPT,
      },
      ...formatMessagesForOpenAI(messages),
    ];

    const stream = await openai.chat.completions.create({
      model: OPENAI_CONFIG.MODEL_ID,
      messages: formattedMessages,
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      temperature: OPENAI_CONFIG.TEMPERATURE,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Error streaming from OpenAI API:', error);
    throw new Error('Failed to stream response from AI model');
  }
}
