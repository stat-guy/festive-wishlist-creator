import React, { useEffect, useState } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import ChristmasTimer from '../components/ChristmasTimer';

interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id'?: string;
        className?: string;
      }, HTMLElement>;
    }
  }
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
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 relative">
      <ChristmasTimer />
      
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-2xl mx-auto relative z-20">
        <elevenlabs-convai
          agent-id="xrfJ41NhW2YAQ44g5KXC"
          className="w-full h-[600px]"
        />
      </div>

      {/* Christmas Card */}
      <div className="mt-8 w-full max-w-2xl mx-auto relative z-10">
        <ChristmasCard
          {...cardData}
          onEmailCard={handleEmailCard}
        />
      </div>
    </div>
  );
};

export default Index;