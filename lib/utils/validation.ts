/**
 * Validation utilities for chat input
 */

import { CHAT_CONFIG } from "@/lib/config/constants";
import type { Message } from "@/lib/types/chat";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates a user message
 */
export function validateMessage(content: string): void {
  if (!content || typeof content !== "string") {
    throw new ValidationError("Message content is required");
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length === 0) {
    throw new ValidationError("Message cannot be empty");
  }

  if (trimmedContent.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
    throw new ValidationError(
      `Message is too long. Maximum length is ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters`
    );
  }
}

/**
 * Validates the messages array structure
 */
export function validateMessages(messages: unknown): messages is Message[] {
  if (!Array.isArray(messages)) {
    throw new ValidationError("Messages must be an array");
  }

  if (messages.length === 0) {
    throw new ValidationError("At least one message is required");
  }

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      throw new ValidationError("Invalid message format");
    }

    const message = msg as Partial<Message>;

    if (
      !message.role ||
      !["user", "assistant", "system"].includes(message.role)
    ) {
      throw new ValidationError("Invalid message role");
    }

    if (!message.content || typeof message.content !== "string") {
      throw new ValidationError("Message content must be a string");
    }
  }

  return true;
}

/**
 * Sanitizes user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .slice(0, CHAT_CONFIG.MAX_MESSAGE_LENGTH);
}
