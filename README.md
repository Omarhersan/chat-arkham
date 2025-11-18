# Arkham Contract Chat - Aplicación Web

Chatbot especializado en contratos de arrendamiento desarrollado con Next.js 15, que utiliza el modelo fine-tuned de OpenAI entrenado específicamente para responder preguntas sobre contratos legales.

## 📋 Descripción del Proyecto

Esta aplicación web es la interfaz de usuario del challenge de Arkham Intelligence, diseñada para demostrar las capacidades del modelo fine-tuned en un entorno de producción. Permite a los usuarios interactuar mediante chat con un asistente especializado que comprende y responde preguntas sobre contratos de arrendamiento.

## 🚀 Características

- **Chat en tiempo real** con streaming de respuestas
- **Interfaz moderna y responsiva** construida con Tailwind CSS
- **Integración directa** con el modelo fine-tuned de OpenAI
- **Indicador de escritura** durante la generación de respuestas
- **Historial de conversación** persistente en la sesión
- **API Routes optimizadas** para manejo eficiente de tokens

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **LLM:** OpenAI GPT-4o-mini (Fine-tuned)
- **API:** OpenAI SDK v4
- **Despliegue:** Vercel-ready

## 📁 Estructura del Proyecto

```
chat-arkham/
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── route.ts          # API endpoint principal (no-streaming)
│   │       └── stream/
│   │           └── route.ts      # API endpoint con streaming
│   ├── chat/
│   │   ├── page.tsx              # Página principal del chat
│   │   └── components/
│   │       ├── ChatInput.tsx     # Input de mensajes del usuario
│   │       ├── ChatMessage.tsx   # Componente de mensaje individual
│   │       └── TypingIndicator.tsx # Indicador de "escribiendo..."
│   ├── layout.tsx                # Layout principal de la app
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Estilos globales
│
├── lib/
│   ├── config/
│   │   └── constants.ts          # Configuración y constantes
│   ├── services/
│   │   └── openai.ts            # Cliente de OpenAI configurado
│   ├── types/
│   │   └── chat.ts              # Tipos TypeScript
│   └── utils/
│       └── validation.ts         # Validaciones y utilidades
│
└── public/                       # Recursos estáticos
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+ o compatible
- pnpm (recomendado) / npm / yarn
- API Key de OpenAI con acceso al modelo fine-tuned

### Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Omarhersan/chat-arkham.git
cd chat-arkham
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

Crear archivo `.env.local`:

```env
OPENAI_API_KEY=tu_api_key_aqui
OPENAI_MODEL=ft:gpt-4o-mini-2024-07-18:personal:arkham-contract:CcK1RP96
```

### Desarrollo

Ejecutar el servidor de desarrollo:

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Producción

Construir la aplicación:

```bash
pnpm build
```

Ejecutar en modo producción:

```bash
pnpm start
```

## 🎯 Hallazgos del Desarrollo

### 1. Implementación de Streaming

**Desafío:** Implementar respuestas en tiempo real que mejoren la experiencia del usuario.

**Solución implementada:**
- API Route `/api/chat/stream` con `ReadableStream`
- Procesamiento de chunks del streaming de OpenAI
- Manejo de eventos SSE (Server-Sent Events) para actualización incremental

**Aprendizaje:** El streaming mejora significativamente la percepción de velocidad, especialmente en respuestas largas del modelo fine-tuned que pueden contener citas extensas de cláusulas contractuales.

### 2. Gestión de Contexto de Conversación

**Desafío:** Mantener coherencia en conversaciones multi-turno sin exceder límites de tokens.

**Implementación:**
- Historial de mensajes en estado del cliente (React)
- Envío completo del historial en cada petición
- Sistema de prompts con rol "system" especializado

**Limitación identificada:** Sin implementar truncado de contexto aún. Para producción real se requeriría:
- Límite de mensajes en historial (ej: últimos 10 mensajes)
- Conteo de tokens para prevenir excesos
- Estrategia de resumen de conversación larga

### 3. Optimización de UX con Indicadores Visuales

**Componentes clave:**
- `TypingIndicator`: Animación durante generación de respuesta
- Scroll automático al último mensaje
- Diferenciación visual entre mensajes de usuario y asistente

**Impacto:** Reduce la percepción de latencia y mejora la sensación de "conversación natural".

### 4. Arquitectura de API Routes

**Decisión de diseño:** Dos endpoints separados
- `/api/chat/route.ts`: Respuesta completa (útil para testing)
- `/api/chat/stream/route.ts`: Respuesta con streaming (producción)


### 5. Validación y Manejo de Errores

**Implementaciones:**
- Validación de mensajes vacíos en cliente
- Manejo de errores de API con mensajes user-friendly

**Áreas de mejora identificadas:**
- Rate limiting no implementado
- Falta manejo de errores específicos de OpenAI (ej: model overload)
- Sin fallback a modelo base si fine-tuned falla


### 7. Rendimiento y Optimización

**Métricas observadas:**
- Tiempo de primera respuesta (TTFR): ~800ms
- Streaming de chunks: ~50-100ms entre tokens
- Tamaño de bundle: Optimizado con App Router de Next.js

**Estrategias aplicadas:**
- Server Components por defecto para reducir JS del cliente
- Lazy loading de componentes pesados (no aplicado aún)
- CSS optimizado con Tailwind + purge

## 🔧 Configuración del Modelo

El archivo `lib/config/constants.ts` define el comportamiento del chatbot:

```typescript
export const CHAT_CONFIG = {
  model: process.env.OPENAI_MODEL || 'ft:gpt-4o-mini-2024-07-18:personal:arkham-contract:CcK1RP96',
  systemPrompt: 'Eres un asistente especializado en contratos de arrendamiento...',
  maxTokens: 1000,
  temperature: 0.7,
};
```

**Parámetros ajustables:**
- `temperature`: 0.7 para balance entre creatividad y precisión
- `maxTokens`: 1000 para permitir citas extensas de contratos
- `systemPrompt`: Define comportamiento y tono del asistente

## 📊 Métricas de la Aplicación

**Rendimiento:**
- Lighthouse Score: 95+ (Performance)
- First Contentful Paint: <1s
- Time to Interactive: <2s


## 🎓 Mejoras Futuras

### Corto plazo:
1. **Gestión de contexto mejorada**
   - Implementar ventana deslizante de mensajes
   - Conteo de tokens con `tiktoken`
   - Resumen automático de conversaciones largas

2. **Funcionalidades de chat avanzadas**
   - Botones de sugerencias de preguntas
   - Exportar conversación a PDF
   - Compartir chat mediante URL

3. **Robustez**
   - Rate limiting por usuario
   - Manejo robusto de errores de API
   - Retry logic con backoff exponencial

## 🔗 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- Despliegue en [Vercel](https://chat-arkham.vercel.app/chat)

## 📝 Notas de Desarrollo

**Versiones utilizadas:**
- Next.js: 15.0.3
- React: 19.0.0
- TypeScript: 5.6.3
- OpenAI SDK: 4.73.0

**Consideraciones:**
- App Router de Next.js (no Pages Router)
- Modo estricto de TypeScript habilitado
- ESLint configurado con reglas recomendadas
