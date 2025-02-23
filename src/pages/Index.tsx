import React from 'react';
import SantaChat from '../components/SantaChat';
import { useMessageHandler } from '../hooks/useMessageHandler';

const Index: React.FC = () => {
  const { cardData, handleMessage } = useMessageHandler();

  return (
    <div className="min-h-screen bg-gray-900">
      <SantaChat cardData={cardData} onUpdateCard={handleMessage} />
    </div>
  );
};

export default Index;