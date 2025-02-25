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
            if (!cardData.wishes.includes(itemName)) {
              updateCardData({ wishes: [itemName] }); // Send as single-item array
              toast.success(`Added ${itemName} to your wishlist!`);
              logInteraction('wishlist_update', { 
                itemKey, 
                itemName,
                currentWishCount: cardData.wishes.length + 1 
              });
              return `Added ${itemName} to wishlist. You now have ${cardData.wishes.length + 1} ${cardData.wishes.length === 0 ? 'item' : 'items'} on your list!`;
            } else {
              toast.info(`${itemName} is already on your wishlist!`);
              return `${itemName} is already on your wishlist. You have ${cardData.wishes.length} ${cardData.wishes.length === 1 ? 'item' : 'items'} listed.`;
            }
          },
          emailCard: () => {
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
  }, [cardData.wishes, updateCardData, logInteraction]);

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
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/christmas-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/20 backdrop-filter backdrop-blur-sm z-0"></div>
      
      {/* Decorative Holiday Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-contain bg-no-repeat bg-[url('/holly-decoration.png')] z-10 opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-contain bg-no-repeat bg-[url('/ornament-decoration.png')] z-10 opacity-80"></div>
      
      {/* Enhanced Snow Effect */}
      <Snowfall 
        snowflakeCount={300}
        radius={[0.5, 3.0]}
        speed={[0.5, 3.0]}
        wind={[-0.5, 2.0]}
        images={[
          "/snowflake1.png",
          "/snowflake2.png",
          "/snowflake3.png"
        ]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 20,
        }}
      />

      {/* Content Container with Glassmorphism */}
      <div className="relative z-30 w-full max-w-7xl mx-auto bg-white/10 backdrop-filter backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
        {/* Christmas Timer */}
        <ChristmasTimer />
        
        {/* ElevenLabs Widget */}
        <elevenlabs-convai 
          agent-id="xrfJ41NhW2YAQ44g5KXC"
          className="w-full max-w-4xl h-[700px] mb-8 mx-auto relative"
        />
        
        {/* Christmas Card */}
        <div className="relative">
          <ChristmasCard
            {...cardData}
            onEmailCard={handleEmailCard}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;