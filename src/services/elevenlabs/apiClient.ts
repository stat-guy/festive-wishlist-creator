
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
    const delayBetweenAttempts = 2000; // 2 seconds delay between attempts
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts} of ${maxAttempts} to get conversation token...`);

      try {
        // First, try to initialize the agent
        const initResponse = await fetch(
          `https://api.elevenlabs.io/v1/convai/agents/${credentials.agent_id}/initialize`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': credentials.api_key,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!initResponse.ok) {
          console.warn(`Agent initialization failed with status ${initResponse.status}`);
          const errorText = await initResponse.text();
          throw new Error(`Failed to initialize agent: ${initResponse.status} - ${errorText}`);
        }

        // Then get the conversation token
        const response = await fetch(
          `https://api.elevenlabs.io/v1/convai/agents/${credentials.agent_id}/link`,
          {
            method: 'GET',
            headers: {
              'xi-api-key': credentials.api_key,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          console.warn(`Token request failed with status ${response.status}`);
          const errorText = await response.text();
          throw new Error(`Failed to get conversation token: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Token response:', JSON.stringify(data, null, 2));

        // Check if we have a token object with a conversation_token
        if (!data || !data.token || !data.token.conversation_token) {
          if (attempts === maxAttempts) {
            throw new Error('Invalid response: missing conversation token');
          }
          console.log('No valid token received, waiting before retry...');
          await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
          continue;
        }

        return {
          conversationToken: data.token.conversation_token,
          agentId: data.agent_id
        };
      } catch (error) {
        console.error(`Error during attempt ${attempts}:`, error);
        
        if (attempts === maxAttempts) {
          throw error;
        }
        
        console.log(`Waiting ${delayBetweenAttempts}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
      }
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
