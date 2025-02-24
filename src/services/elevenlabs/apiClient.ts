
import { ElevenLabsCredentials, ConversationTokenResponse } from './types';

export class ElevenLabsApiClient {
  async getSignedUrl(credentials: ElevenLabsCredentials): Promise<string> {
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
    if (!data || !data.signed_url) {
      throw new Error('Invalid response: missing signed_url property');
    }
    
    return data.signed_url;
  }

  async getConversationToken(credentials: ElevenLabsCredentials): Promise<ConversationTokenResponse> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
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
      console.log('Token response attempt', attempts + 1, ':', JSON.stringify(data, null, 2));

      if (!data || !data.token) {
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error('Failed to get valid conversation token after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (typeof data.token.conversation_token !== 'string') {
        throw new Error('Invalid response format: conversation_token must be a string');
      }

      return {
        conversationToken: data.token.conversation_token,
        agentId: data.agent_id
      };
    }

    throw new Error('Failed to get conversation token after maximum attempts');
  }

  async deleteConversation(credentials: ElevenLabsCredentials, conversationId: string): Promise<void> {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
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
}
