
import { supabase } from '../supabaseClient';
import { ElevenLabsCredentials } from './types';

export class CredentialsManager {
  private credentials: ElevenLabsCredentials | null = null;

  async getCredentials(): Promise<ElevenLabsCredentials> {
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
}
