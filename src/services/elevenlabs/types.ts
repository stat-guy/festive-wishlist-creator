
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

export interface ConversationTokenResponse {
  conversationToken: string;
  agentId: string;
}
