import React, { useState, useEffect } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { MessageHandler, type Message, type CardData } from '../services/messageHandler';

const Index: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    wishes: [],
    location: ''
  });
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as Message;
      console.log('Received message:', message);

      const updates = MessageHandler.processMessage(message);
      if (updates) {
        console.log('Processing updates:', updates);
        setCardData(prev => ({
          ...prev,
          ...updates,
          wishes: updates.wishes ? [...new Set([...prev.wishes, ...updates.wishes])] : prev.wishes
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleStartCall = () => {
    setIsCallActive(true);
    // Add call start logic here
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Add call end logic here
  };

  const handleEmailCard = () => {
    // Email functionality will be implemented later
    console.log('Email card functionality coming soon');
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      <ChristmasCard
        {...cardData}
        isCallActive={isCallActive}
        onStartCall={handleStartCall}
        onEndCall={handleEndCall}
        onEmailCard={handleEmailCard}
      />
    </div>
  );
};

export default Index;