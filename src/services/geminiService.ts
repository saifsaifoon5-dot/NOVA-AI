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
}

export async function requestAppGeneration(params: GenerateAppParams) {
  try {
    const response = await fetch('/api/gemini/generate-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: params.prompt,
        deepThinking: params.deepThinking,
        searchGrounding: params.searchGrounding,
        imageBase64: params.imageBase64,
        options: {
          framework: params.framework || 'React 19 + Tailwind',
          db: params.db || 'Supabase / PostgreSQL',
          auth: params.auth || 'OAuth + Email',
          lang: params.lang || 'ar',
          model: params.model,
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
