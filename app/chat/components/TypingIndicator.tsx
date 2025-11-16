/**
 * TypingIndicator - Animated loading indicator for AI responses
 */

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <span className="text-white text-sm font-semibold">AI</span>
      </div>
      <div className="flex items-center gap-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none">
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
