/**
 * Application constants and configuration
 */

export const OPENAI_CONFIG = {
  MODEL_ID: 'ft:gpt-4o-mini-2024-07-18:personal:arkham-contract:CcK1RP96',
  SYSTEM_PROMPT: `Eres un asistente especializado en contratos de arrendamiento. Tu función es responder preguntas sobre contratos de arrendamiento de manera precisa y detallada, basándote en la información del contrato. 

Debes:
- Proporcionar respuestas claras y concisas
- Citar información específica del contrato cuando sea relevante
- Ser profesional y cortés en todo momento
- Si no tienes información sobre algo específico, indícalo claramente
- Enfocarte en aspectos legales y financieros de los contratos de arrendamiento`,
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_CONVERSATION_HISTORY: 10, // Keep last 10 messages for context
} as const;
