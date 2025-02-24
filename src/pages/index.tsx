import React, { useEffect, useState } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import ChristmasTimer from '../components/ChristmasTimer';

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

  const updateCardData = (data: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...data }));
  };

  const logInteraction = (message: string) => {
    console.log('Interaction:', message);
  };

  const handleEmailCard = () => {
    // Implement email functionality
    console.log('Sending card to email...');
  };

  const configureWidget = (widget: HTMLElement) => {
    widget.addEventListener('nameUpdate', ((event: CustomEvent) => {
      updateCardData({ name: event.detail });
      logInteraction(`Name updated: ${event.detail}`);
    }) as EventListener);

    widget.addEventListener('wishlistUpdate', ((event: CustomEvent) => {
      updateCardData({ wishes: event.detail });
      logInteraction(`Wishlist updated: ${event.detail.join(', ')}`);
    }) as EventListener);
  };

  useEffect(() => {
    const widget = document.querySelector('elevenlabs-convai');
    if (widget) {
      configureWidget(widget);
    }
  }, [cardData.wishes, cardData.name, updateCardData, logInteraction]);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6">
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-4 shadow-lg mb-8">
        <elevenlabs-convai
          agent-id="XYF341NWZ2YAQ44g5KXC"
          className="w-full h-[600px]"
        />
      </div>

      {/* Christmas Card */}
      <ChristmasCard
        {...cardData}
        onEmailCard={handleEmailCard}
      />
    </div>
  );
};

export default Index;