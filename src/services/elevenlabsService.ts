
import { supabase } from './supabaseClient';

export interface ElevenLabsCredentials {
  api_key: string;
  agent_id: string;
}

export interface ConversationState {
  isActive: boolean;
  conversationId?: string;
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

  async startConversation(): Promise<void> {
    try {
      const credentials = await this.fetchCredentials();
      console.log('Starting conversation with credentials:', credentials);
      
      // Send message to parent window to start conversation
      window.parent.postMessage({
        type: 'START_CONVERSATION',
        data: {
          agentId: credentials.agent_id,
          apiKey: credentials.api_key
        }
      }, '*');
      
      this.conversationState.isActive = true;
      console.log('Conversation started with ElevenLabs');
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  async endConversation(): Promise<void> {
    try {
      // Send message to parent window to end conversation
      window.parent.postMessage({
        type: 'END_CONVERSATION',
        data: {}
      }, '*');
      
      this.conversationState.isActive = false;
      this.conversationState.conversationId = undefined;
      console.log('Conversation ended with ElevenLabs');
    } catch (error) {
      console.error('Error ending conversation:', error);
      throw error;
    }
  }

  isConversationActive(): boolean {
    return this.conversationState.isActive;
  }
}
