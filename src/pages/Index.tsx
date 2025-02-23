import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";
import { captureEvent } from "@/utils/analytics";
import { CardData, Wishlist } from "@/types/christmas";
import Snowfall from "@/components/Snowfall";
import ChristmasCard from "@/components/ChristmasCard";
import CountdownTimer from "@/components/CountdownTimer";
import VoiceChat from "@/components/VoiceChat";
import { MessageHandler, type Message } from '../services/messageHandler';

const Index: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    wishes: [],
    location: ''
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const christmasDate = new Date(new Date().getFullYear(), 11, 25); // December 25th

  const {
    start: startConversation,
    end: endConversation,
    messages,
    isLoading: isElevenLabsLoading,
    error,
  } = useConversation();

  useEffect(() => {
    if (error) {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Voice Error",
        description: "Failed to initialize voice. Please check your connection.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleMessage = useCallback((text: string) => {
    if (text.trim() === '') return;

    const message: Message = {
      source: 'user',
      message: text,
    };

    const updates = MessageHandler.processMessage(message);
    if (updates) {
      setCardData(prev => ({
        ...prev,
        ...updates,
        wishes: updates.wishes ? [...new Set([...prev.wishes, ...updates.wishes])] : prev.wishes
      }));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        handleMessage(lastMessage.content);
      }
    }
  }, [messages, handleMessage]);

  const handleStartConversation = async () => {
    try {
      setIsLoading(true);
      await captureEvent('letter_start_attempt');

      const { data: credentials, error } = await supabase
        .from('elevenlabs_credentials')
        .select('agent_id')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        await captureEvent('letter_start_error', { error: error.message });
        toast({
          title: "Error",
          description: "Could not connect to Santa's system. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!credentials?.agent_id) {
        await captureEvent('letter_start_config_error', { error: 'Missing agent ID' });
        toast({
          title: "Configuration Error",
          description: "Santa's communication system is not properly configured.",
          variant: "destructive",
        });
        return;
      }

      await startConversation({
        agentId: credentials.agent_id,
      });

      setIsSpeaking(true);
      await captureEvent('letter_started_successfully');
      toast({
        title: "Connected to Santa!",
        description: "You can now tell Santa your wishes.",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      await captureEvent('letter_start_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: "Error",
        description: "Could not connect to Santa. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = async () => {
    try {
      setIsLoading(true);
      await endConversation();
      setIsSpeaking(false);
      await captureEvent('letter_ended_successfully');
      toast({
        title: "Disconnected",
        description: "You've ended your chat with Santa.",
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
      await captureEvent('letter_end_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: "Error",
        description: "Could not end the chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      setIsLoading(true);
      await captureEvent('letter_restart_attempt');

      // Reset card data
      setCardData({
        name: '',
        wishes: [],
        location: ''
      });

      // Start new conversation
      const { data: credentials, error } = await supabase
        .from('elevenlabs_credentials')
        .select('agent_id')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        await captureEvent('letter_restart_error', { error: error.message });
        toast({
          title: "Error",
          description: "Could not connect to Santa's system. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!credentials?.agent_id) {
        await captureEvent('letter_restart_config_error', { error: 'Missing agent ID' });
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
      await captureEvent('letter_restarted_successfully');
      toast({
        title: "Started New Letter!",
        description: "You can now tell Santa your new wishes.",
      });
    } catch (error) {
      console.error('Error restarting letter:', error);
      await captureEvent('letter_restart_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: "Error",
        description: "Could not start a new letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving card:', cardData);
  };

  const handleVideoSave = () => {
    // Implement video save functionality
    console.log('Saving card with video:', cardData);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 opacity-70 blur-lg"></div>
      <Snowfall />
      
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
              <ChristmasCard 
                {...cardData} 
                onRestart={handleRestart}
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
