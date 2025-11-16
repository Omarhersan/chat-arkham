/**
 * Chat API Route - Handles chat requests and returns AI responses
 * POST /api/chat
 */

import { NextRequest, NextResponse } from "next/server";
import { getAIResponse, validateOpenAIConfig } from "@/lib/services/openai";
import {
  validateMessages,
  validateMessage,
  sanitizeInput,
  ValidationError,
} from "@/lib/utils/validation";
import type { ChatRequest, ChatResponse, Message } from "@/lib/types/chat";

export async function POST(request: NextRequest) {
  try {
    // Validate OpenAI configuration
    if (!validateOpenAIConfig()) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body: ChatRequest = await request.json();

    // Validate messages
    validateMessages(body.messages);

    // Get the last user message
    const lastMessage = body.messages[body.messages.length - 1];

    if (lastMessage.role !== "user") {
      throw new ValidationError("Last message must be from user");
    }

    // Validate and sanitize the message content
    validateMessage(lastMessage.content);
    const sanitizedContent = sanitizeInput(lastMessage.content);

    // Update the last message with sanitized content
    const sanitizedMessages = [
      ...body.messages.slice(0, -1),
      { ...lastMessage, content: sanitizedContent },
    ];

    // Get AI response
    const aiResponseContent = await getAIResponse(sanitizedMessages);

    // Create response message
    const responseMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: aiResponseContent,
      timestamp: new Date(),
    };

    // Return successful response
    const response: ChatResponse = {
      message: responseMessage,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Chat API Error:", error);

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle general errors
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
