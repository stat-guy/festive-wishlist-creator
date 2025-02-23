import React, { useState, useCallback, useEffect } from 'react';
import SantaChat from '../components/SantaChat';

interface Message {
  source: 'ai' | 'user';
  message: string;
  type?: 'name' | 'wish' | 'location';
}

interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

const Index: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    wishes: [],
    location: ''
  });

  // Process message content to determine type and extract relevant info
  const processMessage = (message: string): { type: 'name' | 'wish' | 'location'; content: string } | null => {
    // Check for name introduction
    if (message.toLowerCase().includes('my name is')) {
      const name = message.split('my name is').pop()?.trim().split(' ')[0];
      return name ? { type: 'name', content: name } : null;
    }

    // Check for wishes
    if (message.toLowerCase().includes('soccer jersey')) {
      return { type: 'wish', content: 'Real Madrid soccer jersey' };
    }

    // You can add more patterns here for location and other wishes
    return null;
  };

  const handleMessage = useCallback((message: Message) => {
    console.log('Received message:', message);

    // Process the message content
    const processedData = processMessage(message.message);
    if (!processedData) return;

    // Update card data based on message type
    setCardData(prev => {
      switch (processedData.type) {
        case 'name':
          return { ...prev, name: processedData.content };
        case 'wish':
          return { ...prev, wishes: [...prev.wishes, processedData.content] };
        case 'location':
          return { ...prev, location: processedData.content };
        default:
          return prev;
      }
    });
  }, []);

  // Listen for conversation updates
  useEffect(() => {
    // Set up event listener for conversation updates
    const handleConversationUpdate = (event: MessageEvent) => {
      const message = event.data;
      handleMessage(message);
    };

    window.addEventListener('message', handleConversationUpdate);
    return () => window.removeEventListener('message', handleConversationUpdate);
  }, [handleMessage]);

  return (
    <div className="min-h-screen bg-gray-900">
      <SantaChat cardData={cardData} onUpdateCard={handleMessage} />
    </div>
  );
};

export default Index;