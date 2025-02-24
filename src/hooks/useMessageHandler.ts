
import { useState, useCallback, useEffect } from 'react';
import { Message, MessageProcessor } from '../services/messageProcessor';

export interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

export const useMessageHandler = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    wishes: [],
    location: ''
  });

  const handleMessage = useCallback((message: Message) => {
    console.log('Processing message:', message);

    if (!MessageProcessor.isValidMessage(message)) {
      console.warn('Invalid message format:', message);
      return;
    }

    const processedMessage = MessageProcessor.processMessage(message);
    if (!processedMessage) {
      console.log('No processable content found in message');
      return;
    }

    console.log('Processed message:', processedMessage);

    setCardData(prev => {
      switch (processedMessage.type) {
        case 'name':
          return { ...prev, name: processedMessage.content };
        case 'wish':
          if (!prev.wishes.includes(processedMessage.content)) {
            return { ...prev, wishes: [...prev.wishes, processedMessage.content] };
          }
          return prev;
        case 'location':
          return { ...prev, location: processedMessage.content };
        default:
          return prev;
      }
    });
  }, []);

  const updateCardData = useCallback(({ name, wishes }: { name: string; wishes: string[] }) => {
    setCardData(prev => ({
      ...prev,
      name: name || prev.name,
      wishes: wishes || prev.wishes
    }));
  }, []);

  useEffect(() => {
    const handleConversationUpdate = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data !== null) {
        handleMessage(event.data as Message);
      }
    };

    window.addEventListener('message', handleConversationUpdate);
    return () => window.removeEventListener('message', handleConversationUpdate);
  }, [handleMessage]);

  return { cardData, handleMessage, updateCardData };
};
