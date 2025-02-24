
import React, { useEffect } from 'react';
import ChristmasCard from '../components/ChristmasCard';
import { useMessageHandler } from '../hooks/useMessageHandler';
import { toast } from 'sonner';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string;
        'avatar-orb-color-1'?: string;
        'avatar-orb-color-2'?: string;
        'override-config'?: string;
        'dynamic-variables'?: string;
        'variant'?: 'expanded' | 'full' | 'expandable';
        'speaking-text'?: string;
        'listening-text'?: string;
      };
    }
  }
}

const Index: React.FC = () => {
  const { cardData, updateCardData } = useMessageHandler();

  useEffect(() => {
    // Add the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Configure widget once it's loaded
    const configureWidget = () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        // Listen for widget calls to set up client tools
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

        // Listen for conversation messages
        widget.addEventListener('elevenlabs-convai:message', (event: any) => {
          console.log('Message received:', event.detail);
        });
      }
    };

    script.onload = configureWidget;

    return () => {
      document.body.removeChild(script);
    };
  }, [updateCardData]);

  const handleEmailCard = () => {
    toast.info('Email functionality coming soon!');
    console.log('Email card functionality coming soon');
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 gap-8">
      {/* ElevenLabs Widget */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-4 shadow-lg mb-8">
        <elevenlabs-convai 
          agent-id="xrfJ41NhW2YAQ44g5KXC"
          className="w-full h-[600px]"
          variant="full"
          avatar-orb-color-1="#ff0000"
          avatar-orb-color-2="#00ff00"
          speaking-text="Santa is speaking..."
          listening-text="Santa is listening..."
          override-config={JSON.stringify({
            agent: {
              prompt: {
                prompt: "You are Santa Claus, helping children write their Christmas letters. Extract their name and wishes, then use the updateChristmasCard client tool to update the card with this information."
              },
              first_message: "Ho ho ho! Merry Christmas! I'm Santa Claus. What's your name, and what would you like for Christmas?",
              language: "en"
            }
          })}
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
