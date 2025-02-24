
import React, { useEffect } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { useConversation } from '../hooks/useConversation';

const Index: React.FC = () => {
  const { cardData } = useMessageHandler();
  const { isActive, isInitializing, error, startConversation, endConversation } = useConversation();

  useEffect(() => {
    // Add the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  const handleEmailCard = () => {
    // Email functionality will be implemented later
    console.log('Email card functionality coming soon');
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 gap-8">
      <ChristmasCard
        {...cardData}
        isCallActive={isActive}
        isInitializing={isInitializing}
        error={error}
        onStartCall={startConversation}
        onEndCall={endConversation}
        onEmailCard={handleEmailCard}
      />
      
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-md bg-white rounded-lg p-4 shadow-lg">
        <elevenlabs-convai 
          agent-id="xrfJ41NhW2YAQ44g5KXC"
          className="w-full h-[500px]"
        ></elevenlabs-convai>
      </div>
    </div>
  );
};

export default Index;
