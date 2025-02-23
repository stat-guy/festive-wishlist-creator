import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Snowflake, Gift, TreePine, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";

// Snowfall Animation Component
const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes = [];
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          opacity: Math.random(),
          size: Math.random() * 4 + 2
        });
      }
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
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

// Christmas Card Component
const ChristmasCard = ({ name, wishes, location }) => {
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
              {wishes?.map((wish, index) => (
                <li key={index} className="text-lg">{wish}</li>
              )) || <li className="text-lg">_______</li>}
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
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
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

// Voice Chat Interface
const VoiceChat = ({ isListening, onToggle }) => {
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

const Index = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [wishlist, setWishlist] = useState<Array<{ key: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [location, setLocation] = useState<string>("");
  const christmasDate = new Date('2025-12-25');

  const handleMessage = useCallback((message: any) => {
    console.log("Received message:", message);
    
    if (message.content && message.role === "user") {
      // Wish detection
      const wishPhrases = ["i want", "i wish", "i would like", "can i have"];
      const contentLower = message.content.toLowerCase();
      
      for (const phrase of wishPhrases) {
        if (contentLower.includes(phrase)) {
          const startIndex = contentLower.indexOf(phrase) + phrase.length;
          let wish = message.content.slice(startIndex).trim();
          wish = wish.replace(/^(a |an |the |to |for )/i, "").trim();
          
          const itemKey = Date.now().toString();
          setWishlist(prev => {
            if (!prev.some(item => item.name.toLowerCase() === wish.toLowerCase())) {
              return [...prev, { key: itemKey, name: wish }];
            }
            return prev;
          });
          break;
        }
      }

      // Location detection
      if (contentLower.includes("going to") || contentLower.includes("visit")) {
        const locationMatches = message.content.match(/(?:going to|visit)\s+([^,.!?]+)/i);
        if (locationMatches && locationMatches[1]) {
          setLocation(locationMatches[1].trim());
        }
      }
    }
  }, []);

  const conversation = useConversation({
    onMessage: handleMessage
  });

  const handleStartConversation = async () => {
    if (!name.trim()) return;
    
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

      await supabase.rpc('triggername', { name: name.trim() });
      
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Snowfall />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-festive mb-4">Days Until Christmas</h1>
          <CountdownTimer targetDate={christmasDate} />
        </div>

        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                What's your name?
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
                  placeholder="Enter your name"
                  disabled={isSpeaking}
                />
                {!isSpeaking ? (
                  <button
                    onClick={handleStartConversation}
                    disabled={isLoading || !name.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    Talk to Santa
                  </button>
                ) : (
                  <button
                    onClick={handleEndConversation}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
                  >
                    <VolumeX className="w-4 h-4" />
                    End Chat
                  </button>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <ChristmasCard
                name={name}
                wishes={wishlist.map(item => item.name)}
                location={location}
              />
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
