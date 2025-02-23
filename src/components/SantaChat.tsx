import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our card data
interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

// Types for our message handlers
interface Message {
  type: 'name' | 'wish' | 'location';
  content: string;
}

// Snowfall Animation Component
const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: string;
    animationDuration: string;
    opacity: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        opacity: Math.random(),
        size: Math.random() * 4 + 2
      }));
      setSnowflakes(flakes);
    };

    generateSnowflakes();
    const interval = setInterval(generateSnowflakes, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `fall ${flake.animationDuration} linear infinite`
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fall {
            0% { transform: translateY(-10px); }
            100% { transform: translateY(100vh); }
          }
        `
      }} />
    </div>
  );
};

// Christmas Card Component
const ChristmasCard: React.FC<CardData> = ({ name, wishes, location }) => {
  return (
    <div className="w-96 bg-white rounded-lg shadow-xl p-6 transform rotate-2">
      <div className="border-4 border-red-600 p-4 rounded-lg">
        <h2 className="text-2xl font-festive text-red-600 text-center mb-4">
          My Letter to Santa
        </h2>
        
        <div className="space-y-4">
          <div>
            <p className="font-festive text-lg">Dear Santa,</p>
            <p className="font-festive text-lg">My name is {name || '_______'}</p>
          </div>

          <div>
            <p className="font-festive text-lg">This Christmas, I wish for:</p>
            <ul className="list-disc pl-6 font-festive">
              {wishes && wishes.length > 0 ? (
                wishes.map((wish, index) => (
                  <li key={index} className="text-lg">{wish}</li>
                ))
              ) : (
                <li className="text-lg">_______</li>
              )}
            </ul>
          </div>

          {location && (
            <p className="font-festive text-lg">
              I'll be celebrating in {location}!
            </p>
          )}

          <p className="font-festive text-lg text-right mt-4">
            Thank you, Santa!
          </p>
        </div>
      </div>
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center space-x-4 text-white">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="text-center">
          <div className="bg-red-600 rounded-lg p-3 w-20">
            <span className="text-2xl font-bold">{value}</span>
          </div>
          <div className="text-sm mt-1 capitalize">{key}</div>
        </div>
      ))}
    </div>
  );
};

// Age Verification Modal
const AgeVerification: React.FC<{
  onVerify: () => void;
  onCancel: () => void;
}> = ({ onVerify, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">Age Verification</h3>
        <p className="mb-6">Please confirm that you are 18 years or older to continue.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onVerify}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            I confirm I am 18+
          </button>
        </div>
      </div>
    </div>
  );
};

// Voice Chat Interface
const VoiceChat: React.FC<{
  isListening: boolean;
  onToggle: () => void;
}> = ({ isListening, onToggle }) => {
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

// Main Santa Chat Container
interface SantaChatProps {
  cardData: CardData;
  onUpdateCard: (message: Message) => void;
}

const SantaChat: React.FC<SantaChatProps> = ({ cardData, onUpdateCard }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const christmasDate = new Date('2025-12-25');

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/output.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <Snowfall />
      
      {!isVerified && (
        <AgeVerification
          onVerify={() => setIsVerified(true)}
          onCancel={() => {/* Handle cancel */}}
        />
      )}

      <div className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-festive mb-4">Days Until Christmas</h1>
          <CountdownTimer targetDate={christmasDate} />
        </div>

        <div className="flex justify-center">
          <ChristmasCard {...cardData} />
        </div>

        <VoiceChat
          isListening={isListening}
          onToggle={() => {
            setIsListening(!isListening);
            // Handle voice chat toggle
          }}
        />
      </div>
    </div>
  );
};

export default SantaChat;