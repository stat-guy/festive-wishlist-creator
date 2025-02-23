
import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";

// Types for our messages and data
interface Message {
  type: 'name' | 'wish' | 'location';
  content: string;
}

interface CardData {
  name: string;
  wishes: string[];
  location: string;
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
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
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

const Index: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    wishes: [],
    location: ''
  });
  
  const christmasDate = new Date('2025-12-25');

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('wishlist, name, location')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching wishlist:', error);
        return;
      }

      if (data) {
        const wishlistData = data.wishlist as { items: string[] } | null;
        setCardData({
          name: data.name || '',
          wishes: wishlistData?.items || [],
          location: data.location || ''
        });
      }
    } catch (error) {
      console.error('Error in fetchWishlist:', error);
    }
  };

  const handleMessage = useCallback(async (message: any) => {
    console.log("Received message:", message);
    await fetchWishlist();
  }, []);

  useEffect(() => {
    if (isSpeaking) {
      fetchWishlist();
      const interval = setInterval(fetchWishlist, 2000);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  const conversation = useConversation({
    onMessage: handleMessage
  });

  const handleStartConversation = async () => {
    try {
      setIsLoading(true);
      const { data: credentials, error } = await supabase
        .from('elevenlabs_credentials')
        .select('agent_id')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Error",
          description: "Could not connect to Santa's system. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!credentials?.agent_id) {
        toast({
          title: "Configuration Error",
          description: "Santa's communication system is not properly configured.",
          variant: "destructive",
        });
        return;
      }

      await conversation.startSession({
        agentId: credentials.agent_id,
      });

      setIsSpeaking(true);
      toast({
        title: "Connected with Santa!",
        description: "You can now talk with Santa about your wishlist.",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to Santa. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsSpeaking(false);
      toast({
        title: "Conversation Ended",
        description: "Santa will be waiting for your next visit!",
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Snowfall />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-festive mb-4">Days Until Christmas</h1>
          <CountdownTimer targetDate={christmasDate} />
        </div>

        <div className="space-y-8">
          <div className="flex justify-center">
            {!isSpeaking ? (
              <button
                onClick={handleStartConversation}
                disabled={isLoading}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 text-lg font-medium shadow-lg transform hover:scale-105 transition-all"
              >
                <Volume2 className="w-6 h-6" />
                Talk to Santa
              </button>
            ) : (
              <button
                onClick={handleEndConversation}
                className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 flex items-center gap-2 text-lg font-medium shadow-lg"
              >
                <VolumeX className="w-6 h-6" />
                End Chat
              </button>
            )}
          </div>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <ChristmasCard {...cardData} />
            </motion.div>
          </AnimatePresence>
        </div>

        <VoiceChat
          isListening={isSpeaking}
          onToggle={isSpeaking ? handleEndConversation : handleStartConversation}
        />
      </div>
    </div>
  );
};

export default Index;
