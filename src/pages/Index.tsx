import React, { useState, useEffect } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { MessageHandler, type Message, type CardData } from '../services/messageHandler';

const Index: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    wishes: [],
    location: ''
  });

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

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving card:', cardData);
  };

  const handleRestart = () => {
    setCardData({
      name: '',
      wishes: [],
      location: ''
    });
  };

  const handleVideoSave = () => {
    // Implement video save functionality
    console.log('Saving card with video:', cardData);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      <ChristmasCard
        {...cardData}
        onSave={handleSave}
        onRestart={handleRestart}
        onVideoSave={handleVideoSave}
      />
    </div>
  );
};

export default Index;