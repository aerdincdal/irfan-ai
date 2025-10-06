import AsyncStorage from "@react-native-async-storage/async-storage";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class IslamicApiService {
  private baseUrl: string = "";
  private apiKey?: string;
  private isInitialized: boolean = false;

  constructor() {}

  async initialize() {
    if (this.isInitialized) return;
    
    // HARDCODED Backend URL (Metro .env yüklemezse)
    this.baseUrl = "http://192.168.1.3:8000";
    this.apiKey = process.env.HF_TOKEN || undefined;
    this.isInitialized = true;
    
    console.log("📡 Backend URL:", this.baseUrl);
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      await this.initialize();

      if (!this.baseUrl) {
        throw new Error("Backend URL yapılandırılmamış. Lütfen Settings'den backend URL'i ayarlayın.");
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("API Request failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Bilinmeyen hata oluştu" 
      };
    }
  }

  async checkHealth(): Promise<ApiResponse<IrfanAPI.HealthResponse>> {
    return this.makeRequest<IrfanAPI.HealthResponse>("/api/health", "GET");
  }

  async chat(request: IrfanAPI.ChatRequest): Promise<ApiResponse<IrfanAPI.ChatResponse>> {
    // Varsayılan değerler
    const payload: IrfanAPI.ChatRequest = {
      query: request.query,
      session_id: request.session_id,
      user_id: request.user_id,
      stream: false,
      language: request.language || "tr",
      temperature: request.temperature || 0.2,
      top_p: request.top_p || 0.95,
      max_tokens: request.max_tokens || 4096,
    };

    return this.makeRequest<IrfanAPI.ChatResponse>("/api/irfan/chat", "POST", payload);
  }

  async *chatStream(request: IrfanAPI.ChatRequest): AsyncGenerator<string, void, unknown> {
    await this.initialize();

    if (!this.baseUrl) {
      throw new Error("Backend URL yapılandırılmamış.");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const payload = {
      query: request.query,
      session_id: request.session_id,
      user_id: request.user_id,
      stream: true,
      language: request.language || "tr",
      temperature: request.temperature || 0.2,
      top_p: request.top_p || 0.95,
      max_tokens: request.max_tokens || 4096,
    };

    const url = `${this.baseUrl}/api/irfan/chat`;
    console.log("🚀 Streaming Request:", url, payload);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data:")) continue;
          
          const data = line.replace(/^data:\s*/, "").trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.token && !parsed.done) {
              yield parsed.token;
            }
            if (parsed.done) {
              return;
            }
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async createSession(title?: string): Promise<ApiResponse<IrfanAPI.SessionResponse>> {
    return this.makeRequest<IrfanAPI.SessionResponse>("/api/sessions", "POST", { title });
  }

  async getSession(sessionId: string): Promise<ApiResponse<IrfanAPI.SessionResponse>> {
    return this.makeRequest<IrfanAPI.SessionResponse>(`/api/sessions/${sessionId}`, "GET");
  }

  async listSessions(): Promise<ApiResponse<IrfanAPI.SessionResponse[]>> {
    return this.makeRequest<IrfanAPI.SessionResponse[]>("/api/sessions", "GET");
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/sessions/${sessionId}`, "POST");
  }

  async getSessionMessages(sessionId: string): Promise<ApiResponse<IrfanAPI.MessageResponse[]>> {
    return this.makeRequest<IrfanAPI.MessageResponse[]>(`/api/sessions/${sessionId}/messages`, "GET");
  }


  getEndpoint(): string {
    return this.baseUrl;
  }

  isConfigured(): boolean {
    return !!this.baseUrl;
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}

const islamicApiService = new IslamicApiService();
export { islamicApiService };
export type { ApiResponse };
