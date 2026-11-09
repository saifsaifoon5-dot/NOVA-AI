// Client service for interacting with LGS Gemini endpoints

export interface GenerateAppParams {
  prompt: string;
  framework?: string;
  db?: string;
  auth?: string;
  lang?: string;
  deepThinking?: boolean;
  searchGrounding?: boolean;
  imageBase64?: string;
  model?: string;
  designStyle?: string;
  capabilities?: any;
  customGeminiKey?: string;
  conversationHistory?: Array<{ sender: string; text: string; appName?: string }>;
  currentCode?: string;
  currentAppName?: string;
}

export async function requestAppGeneration(params: GenerateAppParams) {
  try {
    const keyToSend =
      params.customGeminiKey ||
      (typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') || undefined : undefined);

    const response = await fetch('/api/gemini/generate-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: params.prompt,
        deepThinking: params.deepThinking,
        searchGrounding: params.searchGrounding,
        imageBase64: params.imageBase64,
        customGeminiKey: keyToSend,
        conversationHistory: params.conversationHistory,
        currentCode: params.currentCode,
        currentAppName: params.currentAppName,
        options: {
          framework: params.framework || 'React 19 + Tailwind',
          db: params.db || 'PostgreSQL / Drizzle',
          auth: params.auth || 'OAuth + Email',
          lang: params.lang || 'ar',
          model: params.model,
          designStyle: params.designStyle || 'minimal',
          capabilities: params.capabilities,
          geminiApiKey: keyToSend,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation error: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Error in requestAppGeneration:', err);
    throw err;
  }
}

export interface BuildStreamProgressEvent {
  phase: 'INIT' | 'REASONING' | 'DATABASE' | 'PAYMENT_SECURITY' | 'CODEGEN' | 'VERIFY' | 'DEPLOYED' | 'ERROR';
  progress: number;
  message: string;
  activeFile?: string;
  codeSnippet?: string;
  appName?: string;
  data?: any;
  buildChecksum?: string;
  engine?: string;
}

export async function requestBuildStatus() {
  try {
    const res = await fetch('/api/gemini/build-status');
    return await res.json();
  } catch (err) {
    console.error('Error fetching build status:', err);
    return null;
  }
}

export async function requestAppGenerationStream(
  params: GenerateAppParams,
  onProgress: (event: BuildStreamProgressEvent) => void
): Promise<any> {
  const keyToSend =
    params.customGeminiKey ||
    (typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') || undefined : undefined);

  const payload = {
    prompt: params.prompt,
    deepThinking: params.deepThinking,
    searchGrounding: params.searchGrounding,
    imageBase64: params.imageBase64,
    customGeminiKey: keyToSend,
    conversationHistory: params.conversationHistory,
    currentCode: params.currentCode,
    currentAppName: params.currentAppName,
    options: {
      framework: params.framework || 'React 19 + Tailwind',
      db: params.db || 'PostgreSQL / Drizzle',
      auth: params.auth || 'OAuth + Email',
      lang: params.lang || 'ar',
      model: params.model,
      designStyle: params.designStyle || 'minimal',
      capabilities: params.capabilities,
      geminiApiKey: keyToSend,
    },
  };

  try {
    const response = await fetch('/api/gemini/build-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      const fallbackData = await requestAppGeneration(params);
      return fallbackData?.data;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let completedData: any = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const clean = line.replace(/^data:\s*/, '').trim();
        if (!clean) continue;
        try {
          const parsed = JSON.parse(clean);
          onProgress(parsed);
          if (parsed.phase === 'DEPLOYED' && parsed.data) {
            completedData = parsed.data;
          }
        } catch {
          // parse error
        }
      }
    }

    if (completedData) return completedData;
    const fallback = await requestAppGeneration(params);
    return fallback?.data;
  } catch (err: any) {
    console.warn('Stream failed, trying standard fallback:', err.message);
    const fallback = await requestAppGeneration(params);
    return fallback?.data;
  }
}

export interface AiLabRequestParams {
  model: string;
  prompt: string;
  taskType?: 'text' | 'ocr' | 'sentiment' | 'image' | 'video' | 'audio';
  imageBase64?: string;
  temperature?: number;
}

export async function requestAiLabExecution(params: AiLabRequestParams) {
  try {
    const response = await fetch('/api/gemini/ai-lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`AI Lab error: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Error in requestAiLabExecution:', err);
    throw err;
  }
}

export async function requestAgentPlanner(objective: string) {
  try {
    const response = await fetch('/api/gemini/agent-planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective }),
    });

    if (!response.ok) {
      throw new Error(`Agent Planner error: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Error in requestAgentPlanner:', err);
    throw err;
  }
}

export interface DynamicInquiryItem {
  label: string;
  prompt: string;
  category?: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  isBuildIntent: boolean;
  dynamicInquiries?: DynamicInquiryItem[];
  thoughtSnippet?: string;
}

export interface ChatRequestParams {
  message: string;
  history?: Array<{ role: 'user' | 'model'; parts: string }>;
  customGeminiKey?: string;
}

export async function requestGeminiChat(params: ChatRequestParams): Promise<ChatResponse> {
  try {
    const keyToSend =
      params.customGeminiKey ||
      (typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') || undefined : undefined);

    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: params.message,
        history: params.history,
        customGeminiKey: keyToSend,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat error: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Error in requestGeminiChat:', err);
    throw err;
  }
}


