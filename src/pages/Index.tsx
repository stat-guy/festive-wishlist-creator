
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
          updateChristmasCard: ({ name, wishes }: { name: string; wishes: string[] }) => {
            updateCardData({ name, wishes });
            toast.success('Christmas card updated!');

            // Log card update
            logInteraction('card_update', { name, wishes });
            return "Card updated successfully";
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

        // Log each message interaction
        logInteraction('conversation_message', {
          transcription: messageData.transcription,
          response: messageData.response,
          audio: messageData.audio
        });
      });
    }
  }, [updateCardData, logInteraction]);

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
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 gap-8">
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-4 shadow-lg mb-8">
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
