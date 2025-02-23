
import React from 'react';

interface VoiceChatProps {
  isListening: boolean;
  onToggle: () => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ isListening, onToggle }) => {
  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={onToggle}
        className={`rounded-full w-16 h-16 flex items-center justify-center ${
          isListening ? 'bg-red-600 animate-pulse' : 'bg-green-600'
        }`}
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    </div>
  );
};

export default VoiceChat;
