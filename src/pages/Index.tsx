
import React, { useEffect, useCallback } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { toast } from 'sonner';

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

  const configureWidget = useCallback((widget: Element) => {
    if (widget) {
      widget.addEventListener('elevenlabs-convai:call', (event: any) => {
        event.detail.config.clientTools = {
          updateChristmasCard: ({ name, wishes }: { name: string; wishes: string[] }) => {
            updateCardData({ name, wishes });
            toast.success('Christmas card updated!');
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
        console.log('Message received:', event.detail);
      });
    }
  }, [updateCardData]);

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
