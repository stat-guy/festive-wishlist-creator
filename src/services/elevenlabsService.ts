
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
      
      return new Promise((resolve, reject) => {
        // Setup one-time listener for response
        const handleResponse = (event: MessageEvent) => {
          if (event.data?.type === 'CONVERSATION_STARTED') {
            console.log('ElevenLabsService: Received start confirmation');
            window.removeEventListener('message', handleResponse);
            this.conversationState.isActive = true;
            resolve();
          }
        };

        window.addEventListener('message', handleResponse);
        
        // Send message to parent window
        window.parent.postMessage({
          type: 'START_CONVERSATION',
          data: {
            agentId: credentials.agent_id,
            apiKey: credentials.api_key
          }
        }, '*');
        
        // Timeout after 5 seconds
        setTimeout(() => {
          window.removeEventListener('message', handleResponse);
          reject(new Error('Conversation start timeout'));
        }, 5000);
      });
    } catch (error) {
      console.error('ElevenLabsService: Error starting conversation:', error);
      throw error;
    }
  }

  async endConversation(): Promise<void> {
    try {
      console.log('ElevenLabsService: Ending conversation');
      return new Promise((resolve, reject) => {
        // Setup one-time listener for response
        const handleResponse = (event: MessageEvent) => {
          if (event.data?.type === 'CONVERSATION_ENDED') {
            console.log('ElevenLabsService: Received end confirmation');
            window.removeEventListener('message', handleResponse);
            this.conversationState.isActive = false;
            this.conversationState.conversationId = undefined;
            resolve();
          }
        };

        window.addEventListener('message', handleResponse);
        
        // Send message to parent window
        window.parent.postMessage({
          type: 'END_CONVERSATION',
          data: {}
        }, '*');
        
        // Timeout after 5 seconds
        setTimeout(() => {
          window.removeEventListener('message', handleResponse);
          reject(new Error('Conversation end timeout'));
        }, 5000);
      });
    } catch (error) {
      console.error('ElevenLabsService: Error ending conversation:', error);
      throw error;
    }
  }

  isConversationActive(): boolean {
    return this.conversationState.isActive;
  }
}
