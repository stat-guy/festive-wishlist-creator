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
      const errorText = await response.text();
      throw new Error(`Failed to get signed URL: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Invalid response: empty response from signed URL endpoint');
    }
    
    if (!data.signed_url) {
      throw new Error('Invalid response format: missing signed_url property');
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
      const errorText = await response.text();
      throw new Error(`Failed to get conversation token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Invalid response: empty response from conversation token endpoint');
    }

    // Log response for debugging
    console.log('Token response:', JSON.stringify(data, null, 2));

    // Check for token in response
    if (!data.token) {
      throw new Error('Invalid response format: missing token object');
    }

    // Verify conversation token exists and is a string
    if (typeof data.token.conversation_token !== 'string') {
      throw new Error('Invalid response format: conversation_token must be a string');
    }

    // Verify agent_id matches what we expect
    if (data.agent_id !== credentials.agent_id) {
      throw new Error('Invalid response: agent_id mismatch');
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
      console.log('ElevenLabsService: Got signed URL:', signedUrl);

      const tokenData = await this.getConversationToken();
      console.log('ElevenLabsService: Got conversation token:', tokenData.conversationToken);

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
        
        const response = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversations/${this.conversationState.conversationId}`,
          {
            method: 'DELETE',
            headers: {
              'xi-api-key': credentials.api_key
            }
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Failed to delete conversation: ${response.status} - ${errorText}`);
        }
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