
import React, { useEffect, useCallback } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { captureEvent } from '@/utils/analytics';
import Snowfall from '../components/Snowfall';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
      };
    }
  }
}

const Index: React.FC = () => {
  const { cardData, updateCardData } = useMessageHandler();

  const handleEmailCard = useCallback(() => {
    toast.info('Email functionality coming soon!');
    console.log('Email card functionality coming soon');
  }, []);

  const logInteraction = useCallback(async (type: string, content: any) => {
    try {
      // Log to Supabase
      const { error } = await supabase
        .from('voice_interactions')
        .insert([
          {
            interaction_type: type,
            transcription: content.transcription || null,
            response_text: content.response || null,
            audio_metadata: content.audio || null
          }
        ]);

      if (error) {
        console.error('Error logging to Supabase:', error);
      }

      // Log to PostHog
      captureEvent('voice_interaction', {
        interaction_type: type,
        content: content
      });
    } catch (err) {
      console.error('Error logging interaction:', err);
    }
  }, []);

  const configureWidget = useCallback((widget: Element) => {
    if (widget) {
      widget.addEventListener('elevenlabs-convai:call', (event: any) => {
        event.detail.config.clientTools = {
          triggerName: ({ name }: { name: string }) => {
            updateCardData({ name, wishes: cardData.wishes });
            toast.success(`Welcome, ${name}!`);
            logInteraction('name_update', { name });
            return `Name set to ${name}`;
          },
          triggerAddItemToWishlist: ({ itemKey, itemName }: { itemKey: string, itemName: string }) => {
            const updatedWishes = [...cardData.wishes, itemName];
            updateCardData({ name: cardData.name, wishes: updatedWishes });
            toast.success(`Added ${itemName} to your wishlist!`);
            logInteraction('wishlist_update', { itemKey, itemName });
            return `Added ${itemName} to wishlist`;
          },
          emailCard: () => {
            console.log('Email functionality coming soon');
            toast.info('Email feature coming soon!');
            return "Email feature is under development";
          }
        };
      });

      widget.addEventListener('elevenlabs-convai:message', (event: any) => {
        const messageData = event.detail;
        console.log('Message received:', messageData);

        logInteraction('conversation_message', {
          transcription: messageData.transcription,
          response: messageData.response,
          audio: messageData.audio
        });
      });
    }
  }, [cardData.wishes, cardData.name, updateCardData, logInteraction]);

  useEffect(() => {
    const widget = document.querySelector('elevenlabs-convai');
    if (widget) {
      configureWidget(widget);
    }
  }, [configureWidget]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: "url('/lovable-uploads/9d0f9600-8e69-4c7a-8588-ff2018826146.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Snowfall />
      
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-8">
        <elevenlabs-convai 
          agent-id="xrfJ41NhW2YAQ44g5KXC"
          className="w-full h-[600px]"
        ></elevenlabs-convai>
      </div>
      
      <ChristmasCard
        {...cardData}
        onEmailCard={handleEmailCard}
      />
    </div>
  );
};

export default Index;
