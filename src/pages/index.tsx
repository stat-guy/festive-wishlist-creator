
import React, { useEffect, useCallback } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import ChristmasTimer from '../components/ChristmasTimer';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { captureEvent } from '@/utils/analytics';
import Snowfall from 'react-snowfall';

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
            updateCardData({ 
              name,
              wishes: undefined
            });
            toast.success(`Welcome, ${name}!`);
            logInteraction('name_update', { name });
            return `Name set to ${name}`;
          },
          triggerAddItemToWishlist: ({ itemKey, itemName }: { itemKey: string, itemName: string }) => {
            updateCardData({ 
              name: undefined,
              wishes: [itemName]
            });
            toast.success(`Added ${itemName} to your wishlist!`);
            logInteraction('wishlist_update', { itemKey, itemName });
            return `Added ${itemName} to wishlist`;
          },
          emailCard: () => {
            handleEmailCard();
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
  }, [cardData.wishes, cardData.name, updateCardData, logInteraction, handleEmailCard]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    script.onload = () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        configureWidget(widget);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [configureWidget]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: "url('/lovable-uploads/2f9b7554-2fb8-4904-96e2-c1c5fa3b8f2b.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Adding a slight overlay to ensure content remains readable
      }}
    >
      {/* Snow Effect */}
      <Snowfall 
        snowflakeCount={200}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Christmas Timer */}
      <ChristmasTimer />
      
      {/* ElevenLabs Widget */}
      <elevenlabs-convai 
        agent-id="xrfJ41NhW2YAQ44g5KXC"
        className="w-full max-w-4xl h-[700px] mb-8 relative z-10"
      />
      
      {/* Christmas Card */}
      <div className="relative z-10">
        <ChristmasCard
          {...cardData}
          onEmailCard={handleEmailCard}
        />
      </div>
    </div>
  );
};

export default Index;
