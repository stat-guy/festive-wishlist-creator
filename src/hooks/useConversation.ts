import { useState, useEffect, useCallback } from 'react';
import { ElevenLabsService } from '../services/elevenlabsService';

export const useConversation = () => {
  const [isActive, setIsActive] = useState(false);
  const elevenlabsService = ElevenLabsService.getInstance();

  useEffect(() => {
    const handleConversationState = (event: MessageEvent) => {
      if (event.data?.type === 'CONVERSATION_STATE_CHANGE') {
        setIsActive(event.data.isActive);
      }
    };

    window.addEventListener('message', handleConversationState);
    return () => window.removeEventListener('message', handleConversationState);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      await elevenlabsService.startConversation();
      setIsActive(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setIsActive(false);
    }
  }, [elevenlabsService]);

  const endConversation = useCallback(async () => {
    try {
      await elevenlabsService.endConversation();
      setIsActive(false);
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  }, [elevenlabsService]);

  return {
    isActive,
    startConversation,
    endConversation
  };
};