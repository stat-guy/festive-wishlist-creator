import React from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { useConversation } from '../hooks/useConversation';

const Index: React.FC = () => {
  const { cardData } = useMessageHandler();
  const { isActive, isInitializing, error, startConversation, endConversation } = useConversation();

  const handleEmailCard = () => {
    // Email functionality will be implemented later
    console.log('Email card functionality coming soon');
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      <ChristmasCard
        {...cardData}
        isCallActive={isActive}
        isInitializing={isInitializing}
        error={error}
        onStartCall={startConversation}
        onEndCall={endConversation}
        onEmailCard={handleEmailCard}
      />
    </div>
  );
};

export default Index;