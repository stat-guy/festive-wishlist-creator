import React, { useState, useCallback, useEffect } from 'react';
import SantaChat from '../components/SantaChat';

interface Message {
  type: 'name' | 'wish' | 'location';
  content: string;
}

const Index: React.FC = () => {
  // Move all the state and handlers up to this component
  const [cardData, setCardData] = useState({
    name: '',
    wishes: [] as string[],
    location: ''
  });

  const handleMessage = useCallback((message: Message) => {
    setCardData(prev => {
      switch (message.type) {
        case 'name':
          return { ...prev, name: message.content };
        case 'wish':
          return { ...prev, wishes: [...prev.wishes, message.content] };
        case 'location':
          return { ...prev, location: message.content };
        default:
          return prev;
      }
    });
  }, []);

  useEffect(() => {
    // Example of receiving messages from ElevenLabs
    const mockMessages = [
      { type: 'name' as const, content: 'Kai' },
      { type: 'wish' as const, content: 'Real Madrid soccer jersey' },
      { type: 'location' as const, content: 'New York' }
    ];

    mockMessages.forEach((msg, index) => {
      setTimeout(() => handleMessage(msg), index * 1000);
    });
  }, [handleMessage]);

  return (
    <div className="min-h-screen bg-gray-900">
      <SantaChat cardData={cardData} onUpdateCard={handleMessage} />
    </div>
  );
};

export default Index;