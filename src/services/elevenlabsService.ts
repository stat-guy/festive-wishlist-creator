import { supabase } from './supabaseClient';

export interface ElevenLabsCredentials {
  api_key: string;
  agent_id: string;
}

export interface ConversationState {
  isActive: boolean;
  conversationId?: string;
  signedUrl?: string;
  conversationToken?: string;
}

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private credentials: ElevenLabsCredentials | null = null;
  private conversationState: ConversationState = {
    isActive: false
  };

  private constructor() {}

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  private async fetchCredentials(): Promise<ElevenLabsCredentials> {
    if (this.credentials) return this.credentials;

    const { data, error } = await supabase
      .from('elevenlabs_credentials')
      .select('*')
      .limit(1)
      .single();

    if (error) throw new Error('Failed to fetch ElevenLabs credentials');
    
    this.credentials = {
      api_key: data.api_key,
      agent_id: data.agent_id
    };

    return this.credentials;
  }

  private async getSignedUrl(): Promise<string> {
    const credentials = await this.fetchCredentials();
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${credentials.agent_id}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': credentials.api_key
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get signed URL');
    }

    const data = await response.json();
    if (!data.signed_url) {
      throw new Error('Invalid response format: missing signed_url');
    }
    return data.signed_url;
  }

  private async getConversationToken(): Promise<{
    conversationToken: string;
    agentId: string;
  }> {
    const credentials = await this.fetchCredentials();
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${credentials.agent_id}/link`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': credentials.api_key
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get conversation token');
    }

    const data = await response.json();
    if (!data.token?.conversation_token) {
      throw new Error('Invalid response format: missing token.conversation_token');
    }

    return {
      conversationToken: data.token.conversation_token,
      agentId: data.agent_id
    };
  }

  async startConversation(): Promise<void> {
    try {
      console.log('ElevenLabsService: Starting conversation');
      const credentials = await this.fetchCredentials();
      console.log('ElevenLabsService: Fetched credentials');

      // Get signed URL and token sequentially to handle potential errors better
      const signedUrl = await this.getSignedUrl();
      console.log('ElevenLabsService: Got signed URL');

      const tokenData = await this.getConversationToken();
      console.log('ElevenLabsService: Got conversation token');

      if (!tokenData.conversationToken) {
        throw new Error('Failed to initialize conversation: Missing conversation token');
      }

      this.conversationState.signedUrl = signedUrl;
      this.conversationState.conversationToken = tokenData.conversationToken;

      // Send initialization message to parent window
      window.parent.postMessage({
        type: 'INIT_CONVERSATION',
        data: {
          signedUrl,
          agentId: tokenData.agentId,
          conversationToken: tokenData.conversationToken,
          apiKey: credentials.api_key
        }
      }, '*');
      
      this.conversationState.isActive = true;
      console.log('ElevenLabsService: Conversation initialized');
    } catch (error) {
      console.error('ElevenLabsService: Error starting conversation:', error);
      this.conversationState.isActive = false;
      throw error;
    }
  }

  async endConversation(): Promise<void> {
    try {
      if (this.conversationState.conversationId) {
        const credentials = await this.fetchCredentials();
        
        await fetch(
          `https://api.elevenlabs.io/v1/convai/conversations/${this.conversationState.conversationId}`,
          {
            method: 'DELETE',
            headers: {
              'xi-api-key': credentials.api_key
            }
          }
        );
      }

      // Send message to parent window to end conversation
      window.parent.postMessage({
        type: 'END_CONVERSATION',
        data: {}
      }, '*');
      
      this.conversationState = {
        isActive: false
      };

      console.log('ElevenLabsService: Conversation ended');
    } catch (error) {
      console.error('ElevenLabsService: Error ending conversation:', error);
      throw error;
    }
  }

  isConversationActive(): boolean {
    return this.conversationState.isActive;
  }
}