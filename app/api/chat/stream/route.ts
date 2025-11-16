/**
 * Chat Stream API Route - Handles streaming chat requests
 * POST /api/chat/stream
 */

import { NextRequest } from "next/server";
import { streamAIResponse, validateOpenAIConfig } from "@/lib/services/openai";
import {
  validateMessages,
  validateMessage,
  sanitizeInput,
  ValidationError,
} from "@/lib/utils/validation";
import type { ChatRequest, Message } from "@/lib/types/chat";

export async function POST(request: NextRequest) {
  try {
    // Validate OpenAI configuration
    if (!validateOpenAIConfig()) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the message ID first
          const messageId = crypto.randomUUID();
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "id", id: messageId })}\n\n`
            )
          );

          // Stream the AI response
          for await (const chunk of streamAIResponse(sanitizedMessages)) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "content",
                  content: chunk,
                })}\n\n`
              )
            );
          }

          // Send done signal
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "done",
                timestamp: new Date().toISOString(),
              })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occurred while streaming";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: errorMessage,
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat Stream API Error:", error);

    // Handle validation errors
    if (error instanceof ValidationError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle general errors
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle unsupported methods
export async function GET() {
  return new Response(
    JSON.stringify({ error: "Method not allowed. Use POST." }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
}
