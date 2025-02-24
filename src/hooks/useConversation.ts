
import { useState, useEffect, useCallback, useRef } from 'react';
import { ElevenLabsService } from '../services/elevenlabsService';

interface ConversationMessage {
  role: 'user' | 'assistant';
  message: string;
}

export const useConversation = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const elevenlabsService = useRef(ElevenLabsService.getInstance());

  // Handle incoming messages from the parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case 'CONVERSATION_READY':
          setIsActive(true);
          setIsInitializing(false);
          setError(null);
          break;

        case 'CONVERSATION_ERROR':
          setIsActive(false);
          setIsInitializing(false);
          setError(data.error);
          break;

        case 'CONVERSATION_ENDED':
          setIsActive(false);
          setIsInitializing(false);
          setError(null);
          break;

        case 'CONVERSATION_MESSAGE':
          // Handle incoming message - this will be handled by the message processor
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);
      console.log('useConversation: Starting conversation with Santa...');
      await elevenlabsService.current.startConversation();
    } catch (error) {
      console.error('useConversation: Failed to start conversation:', error);
      setError(error instanceof Error ? error.message : 'Failed to start conversation');
      setIsActive(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const endConversation = useCallback(async () => {
    try {
      console.log('useConversation: Ending conversation with Santa...');
      await elevenlabsService.current.endConversation();
      setIsActive(false);
      setError(null);
    } catch (error) {
      console.error('useConversation: Failed to end conversation:', error);
      setError(error instanceof Error ? error.message : 'Failed to end conversation');
    }
  }, []);

  return {
    isActive,
    isInitializing,
    error,
    startConversation,
    endConversation
  };
};
