
import { useState, useEffect, useCallback } from 'react';
import { ElevenLabsService } from '../services/elevenlabsService';

export const useConversation = () => {
  const [isActive, setIsActive] = useState(false);
  const elevenlabsService = ElevenLabsService.getInstance();

  useEffect(() => {
    console.log('Setting up conversation state listener');
    const handleConversationState = (event: MessageEvent) => {
      console.log('Received message event:', event.data);
      if (event.data?.type === 'CONVERSATION_STATE_CHANGE') {
        console.log('Setting conversation state to:', event.data.isActive);
        setIsActive(event.data.isActive);
      }
    };

    window.addEventListener('message', handleConversationState);
    return () => window.removeEventListener('message', handleConversationState);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      console.log('useConversation: Starting conversation with Santa...');
      const result = await elevenlabsService.startConversation();
      console.log('useConversation: Start conversation result:', result);
      setIsActive(true);
    } catch (error) {
      console.error('useConversation: Failed to start conversation:', error);
      setIsActive(false);
    }
  }, [elevenlabsService]);

  const endConversation = useCallback(async () => {
    try {
      console.log('useConversation: Ending conversation with Santa...');
      await elevenlabsService.endConversation();
      console.log('useConversation: Successfully ended conversation');
      setIsActive(false);
    } catch (error) {
      console.error('useConversation: Failed to end conversation:', error);
    }
  }, [elevenlabsService]);

  return {
    isActive,
    startConversation,
    endConversation
  };
};
