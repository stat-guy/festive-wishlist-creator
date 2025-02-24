import React from 'react';
import ChristmasCard from './components/ChristmasCard';
import ChristmasTimer from './components/ChristmasTimer';
import { useConversation } from './hooks/useConversation';

const App: React.FC = () => {
  const { isActive, isInitializing, error, startConversation, endConversation } = useConversation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <ChristmasTimer />
      
      {/* Main content container without height constraints */}
      <div className="container mx-auto px-4 relative">
        <ChristmasCard
          name=""
          wishes={[]}
          location=""
          isCallActive={isActive}
          isInitializing={isInitializing}
          error={error}
          onStartCall={startConversation}
          onEndCall={endConversation}
        />
      </div>
    </div>
  );
};

export default App;