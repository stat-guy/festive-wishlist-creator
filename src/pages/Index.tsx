import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";
import { captureEvent } from "@/utils/analytics";
import { CardData } from "@/types/christmas";
import Snowfall from "@/components/Snowfall";
import ChristmasCard from "@/components/ChristmasCard";
import CountdownTimer from "@/components/CountdownTimer";
import VoiceChat from "@/components/VoiceChat";

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
        .select(`
          wishlist,
          name,
          location,
          voice_interactions (
            transcription,
            response_text
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching wishlist:', error);
        await captureEvent('wishlist_fetch_error', { error: error.message });
        return;
      }

      if (data) {
        const wishlistData = data.wishlist as { items: string[] } | null;
        const newCardData = {
          name: data.name || '',
          wishes: wishlistData?.items || [],
          location: data.location || ''
        };
        
        setCardData(newCardData);
        await captureEvent('wishlist_updated', { 
          has_name: !!newCardData.name,
          wishes_count: newCardData.wishes.length,
          has_location: !!newCardData.location
        });
      }
    } catch (error) {
      console.error('Error in fetchWishlist:', error);
      await captureEvent('wishlist_fetch_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const handleMessage = useCallback(async (message: any) => {
    console.log("Received message:", message);
    await captureEvent('message_received', { 
      message_type: message?.type,
      has_content: !!message?.content
    });
    
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
      await captureEvent('conversation_start_attempt');

      const { data: credentials, error } = await supabase
        .from('elevenlabs_credentials')
        .select('agent_id')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        await captureEvent('conversation_start_error', { error: error.message });
        toast({
          title: "Error",
          description: "Could not connect to Santa's system. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!credentials?.agent_id) {
        await captureEvent('conversation_config_error', { error: 'Missing agent ID' });
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
      await captureEvent('conversation_started_successfully');
      toast({
        title: "Connected with Santa!",
        description: "You can now talk with Santa about your wishlist.",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      await captureEvent('conversation_start_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
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
      await captureEvent('conversation_ended_successfully');
      toast({
        title: "Conversation Ended",
        description: "Santa will be waiting for your next visit!",
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
      await captureEvent('conversation_end_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("/lovable-uploads/63449d69-bda2-427d-bfd2-5293f81e7ce2.png")'
        }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Snowfall on top of background */}
      <Snowfall />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-festive mb-4 text-white drop-shadow-lg">Days Until Christmas</h1>
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
