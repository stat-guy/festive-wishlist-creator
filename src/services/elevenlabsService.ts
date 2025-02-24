
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

  private constructor() {
    console.log('ElevenLabsService: Initializing service');
  }

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      console.log('ElevenLabsService: Creating new instance');
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  private async fetchCredentials(): Promise<ElevenLabsCredentials> {
    console.log('ElevenLabsService: Fetching credentials');
    if (this.credentials) {
      console.log('ElevenLabsService: Using cached credentials');
      return this.credentials;
    }

    console.log('ElevenLabsService: Making Supabase query');
    const { data, error } = await supabase
      .from('elevenlabs_credentials')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('ElevenLabsService: Failed to fetch credentials:', error);
      throw new Error('Failed to fetch ElevenLabs credentials');
    }
    
    console.log('ElevenLabsService: Successfully fetched credentials:', data);
    this.credentials = {
      api_key: data.api_key,
      agent_id: data.agent_id
    };

    return this.credentials;
  }

  async startConversation(): Promise<void> {
    try {
      console.log('ElevenLabsService: Starting conversation');
      const credentials = await this.fetchCredentials();
      console.log('ElevenLabsService: Got credentials, sending start message');
      
      // Send message to parent window to start conversation
      window.parent.postMessage({
        type: 'START_CONVERSATION',
        data: {
          agentId: credentials.agent_id,
          apiKey: credentials.api_key
        }
      }, '*');
      
      this.conversationState.isActive = true;
      console.log('ElevenLabsService: Conversation started successfully');
    } catch (error) {
      console.error('ElevenLabsService: Error starting conversation:', error);
      throw error;
    }
  }

  async endConversation(): Promise<void> {
    try {
      console.log('ElevenLabsService: Ending conversation');
      // Send message to parent window to end conversation
      window.parent.postMessage({
        type: 'END_CONVERSATION',
        data: {}
      }, '*');
      
      this.conversationState.isActive = false;
      this.conversationState.conversationId = undefined;
      console.log('ElevenLabsService: Conversation ended successfully');
    } catch (error) {
      console.error('ElevenLabsService: Error ending conversation:', error);
      throw error;
    }
  }

  isConversationActive(): boolean {
    return this.conversationState.isActive;
  }
}
