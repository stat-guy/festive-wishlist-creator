import React from 'react';
import ChristmasCard from './components/ChristmasCard';
import ChristmasTimer from './components/ChristmasTimer';
import { useConversation } from './hooks/useConversation';
const App: React.FC = () => {
  const {
    isActive,
    isInitializing,
    error,
    startConversation,
    endConversation
  } = useConversation();
  return <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 my-0 mx-0 px-0">
      <ChristmasTimer />
      
      <div className="container mx-auto px-4 relative">
        {/* ElevenLabs Widget */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <elevenlabs-convai agent-id="xrfJ41NhW2YAQ44g5KXC" className="w-full h-[600px]" />
        </div>

        <ChristmasCard name="" wishes={[]} location="" isCallActive={isActive} isInitializing={isInitializing} error={error} onStartCall={startConversation} onEndCall={endConversation} />
      </div>
    </div>;
};
export default App;