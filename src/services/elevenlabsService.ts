export interface ConversationState {
  isActive: boolean;
  conversationId?: string;
}

export class ElevenLabsService {
  private static instance: ElevenLabsService;
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

  async startConversation(): Promise<void> {
    try {
      // Send message to parent window to start conversation
      window.parent.postMessage({
        type: 'START_CONVERSATION',
        data: {}
      }, '*');
      
      this.conversationState.isActive = true;
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
    } catch (error) {
      console.error('Error ending conversation:', error);
      throw error;
    }
  }

  isConversationActive(): boolean {
    return this.conversationState.isActive;
  }
}
