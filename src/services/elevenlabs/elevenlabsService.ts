
import { ConversationState } from './types';
import { CredentialsManager } from './credentialsManager';
import { ElevenLabsApiClient } from './apiClient';

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private credentialsManager: CredentialsManager;
  private apiClient: ElevenLabsApiClient;
  private conversationState: ConversationState = {
    isActive: false
  };

  private constructor() {
    this.credentialsManager = new CredentialsManager();
    this.apiClient = new ElevenLabsApiClient();
  }

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  async startConversation(): Promise<void> {
    try {
      console.log('ElevenLabsService: Starting conversation');
      const credentials = await this.credentialsManager.getCredentials();
      console.log('ElevenLabsService: Fetched credentials');

      const signedUrl = await this.apiClient.getSignedUrl(credentials);
      console.log('ElevenLabsService: Got signed URL:', signedUrl);

      const tokenData = await this.apiClient.getConversationToken(credentials);
      console.log('ElevenLabsService: Got conversation token:', tokenData.conversationToken);

      this.conversationState.signedUrl = signedUrl;
      this.conversationState.conversationToken = tokenData.conversationToken;

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
        const credentials = await this.credentialsManager.getCredentials();
        await this.apiClient.deleteConversation(
          credentials,
          this.conversationState.conversationId
        );
      }

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

// Re-export the service class
export default ElevenLabsService;
