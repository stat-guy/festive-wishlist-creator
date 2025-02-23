import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Snowflake, Gift, TreePine, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";

const Index = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [wishlistItem, setWishlistItem] = useState("");
  const [wishlist, setWishlist] = useState<Array<{ key: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [location, setLocation] = useState<string>("");
  const conversation = useConversation();

  const handleMessage = useCallback((message: any) => {
    console.log("Received message:", message);
    
    // Check if the message contains a wish
    if (message.content && message.role === "user") {
      // Simple wish detection - look for phrases like "I want" or "I wish"
      const wishPhrases = ["i want", "i wish", "i would like", "can i have"];
      const contentLower = message.content.toLowerCase();
      
      for (const phrase of wishPhrases) {
        if (contentLower.includes(phrase)) {
          const startIndex = contentLower.indexOf(phrase) + phrase.length;
          let wish = message.content.slice(startIndex).trim();
          // Remove common filler words
          wish = wish.replace(/^(a |an |the |to |for )/i, "").trim();
          
          // Add to wishlist if it's not already there
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
    }

    // Check if the message contains a location
    if (message.content && message.role === "user" && 
        (message.content.toLowerCase().includes("going to") || 
         message.content.toLowerCase().includes("visit"))) {
      const locationMatches = message.content.match(/(?:going to|visit)\s+([^,.!?]+)/i);
      if (locationMatches && locationMatches[1]) {
        setLocation(locationMatches[1].trim());
      }
    }
  }, []);

  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to chat with Santa.",
          variant: "destructive",
        });
      }
    };

    requestMicrophoneAccess();
  }, []);

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
      
      // Start ElevenLabs conversation
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

  const handleRemoveFromWishlist = async (itemKey: string) => {
    try {
      setIsLoading(true);
      setWishlist(wishlist.filter(item => item.key !== itemKey));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 mb-6">
            <TreePine className="text-green-600 w-8 h-8" />
            <Snowflake className="text-blue-400 w-8 h-8 animate-spin-slow" />
            <Gift className="text-red-600 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Santa's Interactive Wishlist</h1>
          <p className="text-xl text-gray-600">Share your Christmas wishes with Santa!</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              What's your name?
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Wishlist:</h3>
            {wishlist.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow animate-fade-in"
              >
                <span className="text-gray-700">{item.name}</span>
                <button
                  onClick={() => handleRemoveFromWishlist(item.key)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            {wishlist.length === 0 && (
              <p className="text-gray-500 text-center italic">Your wishlist is empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
