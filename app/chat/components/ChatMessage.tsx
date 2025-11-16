/**
 * ChatMessage - Individual message bubble component
 */

import type { Message } from "@/lib/types/chat";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  // Don't render system messages
  if (isSystem) return null;

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-linear-to-br from-blue-500 to-cyan-500"
            : "bg-linear-to-br from-purple-500 to-blue-500"
        }`}
      >
        <span className="text-white text-sm font-semibold">
          {isUser ? "U" : "AI"}
        </span>
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-tr-none"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap wrap-break-word">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
