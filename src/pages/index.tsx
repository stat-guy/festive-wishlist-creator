
import React, { useEffect, useCallback } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { captureEvent } from '@/utils/analytics';

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
            updateCardData({ name, wishes: [...cardData.wishes] });
            toast.success(`Welcome, ${name}!`);
            logInteraction('name_update', { name });
            return `Name set to ${name}`;
          },
          triggerAddItemToWishlist: ({ itemName }: { itemKey: string, itemName: string }) => {
            const updatedWishes = [...cardData.wishes, itemName];
            updateCardData({ name: cardData.name, wishes: updatedWishes });
            toast.success(`Added ${itemName} to your wishlist!`);
            logInteraction('wishlist_update', { itemName });
            return `Added ${itemName} to wishlist`;
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
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6">
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-8">
        <elevenlabs-convai 
          agent-id="xrfJ41NhW2YAQ44g5KXC"
          className="w-full h-[600px]"
        />
      </div>
      
      <div className="w-full max-w-4xl"> {/* Increased max width for the card container */}
        <ChristmasCard
          {...cardData}
          onEmailCard={handleEmailCard}
        />
      </div>
    </div>
  );
};

export default Index;
