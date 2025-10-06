declare module 'react-native-vector-icons/Ionicons';

declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const BACKEND_URL: string;
  export const HF_TOKEN: string;
  export const OPENAI_API_KEY: string;
}

// Backend API Types
declare namespace IrfanAPI {
  type Language = 'tr' | 'ar' | 'both' | 'auto';
  
  interface ChatRequest {
    query: string;
    session_id?: string;
    user_id?: string;
    stream?: boolean;
    language?: Language;
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  }
  
  interface ChatResponse {
    session_id: string;
    content: string;
    citations: string[];
    language: Language;
  }
  
  interface SessionResponse {
    id: string;
    user_id?: string;
    title?: string;
    created_at: string;
    updated_at: string;
  }
  
  interface MessageResponse {
    id: number;
    role: string;
    content: string;
    created_at: string;
  }
  
  interface HealthResponse {
    status: string;
    time: string;
    model: string;
    hf_api_base: string;
  }
}
