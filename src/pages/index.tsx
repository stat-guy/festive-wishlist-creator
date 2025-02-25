import React, { useEffect, useCallback, useState } from 'react';
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
  const [snowflakeCount, setSnowflakeCount] = useState(300);
  
  // Adjust snowflake count based on screen size
  useEffect(() => {
    const handleResize = () => {
      setSnowflakeCount(window.innerWidth < 768 ? 150 : 300);
    };
    
    // Set initial count
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            // Check if item already exists
            const itemExists = cardData.wishes.includes(itemName);
            const currentCount = cardData.wishes.length;
            const newCount = itemExists ? currentCount : currentCount + 1;
            const itemText = newCount === 1 ? 'item' : 'items';
            
            if (!itemExists) {
              // Add new item
              updateCardData({ wishes: [itemName] }); // Send as single-item array
              toast.success(`Added ${itemName} to your wishlist!`);
              logInteraction('wishlist_update', { itemKey, itemName, currentWishCount: newCount });
              return `Added ${itemName} to wishlist. You now have ${newCount} ${itemText} on your list!`;
            } else {
              // Item already exists
              toast.info(`${itemName} is already on your wishlist!`);
              return `${itemName} is already on your wishlist. You have ${currentCount} ${itemText} listed.`;
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
    // Check if script is already loaded to avoid duplicates
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        const widget = document.querySelector('elevenlabs-convai');
        if (widget) {
          configureWidget(widget);
        }
      };
      
      document.body.appendChild(script);
      
      return () => {
        // Only remove if it exists
        const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
        }
      };
    } else {
      // Script already exists, just configure widget
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        configureWidget(widget);
      }
    }
  }, [configureWidget]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/christmas-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/20 backdrop-filter backdrop-blur-sm z-0"></div>
      
      {/* Decorative Holiday Elements - Responsive sizes */}
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-contain bg-no-repeat bg-[url('/holly-decoration.png')] z-10 opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-contain bg-no-repeat bg-[url('/ornament-decoration.png')] z-10 opacity-80"></div>
      
      {/* Enhanced Snow Effect - Responsive snowflake count based on screen size */}
      <Snowfall 
        snowflakeCount={snowflakeCount}
        speed={[0.5, 2.0]} 
        wind={[-0.5, 1.0]}
        radius={[0.5, 2.5]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 20,
        }}
      />

      {/* Timer at the top of the page */}
      <div className="relative z-30 mb-8 w-full max-w-4xl mx-auto">
        <ChristmasTimer />
      </div>
      
      {/* Vertical stacked layout with all components centered */}
      <div className="relative z-30 w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Christmas Card - No glassmorphic border */}
        <div className="w-full">
          <ChristmasCard
            {...cardData}
            onEmailCard={handleEmailCard}
          />
        </div>
        
        {/* ElevenLabs Widget - No glassmorphic border */}
        <div className="w-full mb-8">
          <elevenlabs-convai 
            agent-id="xrfJ41NhW2YAQ44g5KXC"
            className="w-full h-[350px] sm:h-[375px] md:h-[400px] mx-auto relative"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;