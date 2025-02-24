import React from 'react';
import { motion } from 'framer-motion';

interface ChristmasCardProps {
  name: string;
  wishes: string[];
  location: string;
  isCallActive?: boolean;
  isInitializing?: boolean;
  error?: string | null;
  onStartCall?: () => void;
  onEndCall?: () => void;
  onEmailCard?: () => void;
}

const ChristmasCard: React.FC<ChristmasCardProps> = ({
  name,
  wishes,
  location,
  isCallActive = false,
  isInitializing = false,
  error = null,
  onStartCall,
  onEndCall,
  onEmailCard
}) => {
  return (
    <div className="relative z-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[600px] mx-auto bg-white rounded-lg overflow-hidden relative p-1"
      >
        {/* Candy Cane Border */}
        <div 
          className="absolute inset-0 rounded-lg" 
          style={{
            background: 'repeating-linear-gradient(45deg, #ff0000, #ff0000 10px, #ffffff 10px, #ffffff 20px)',
            padding: '12px'
          }}
        />
        
        <div className="relative bg-white rounded-lg p-8 z-10">
          <h1 className="text-3xl font-festive text-red-600 text-center mb-8">My Letter to Santa</h1>
          
          <div className="space-y-6 font-handwritten text-xl leading-relaxed">
            <p>Dear Santa, my name is <span className="text-red-600 font-semibold">{name || '_______'}</span></p>
            
            <div>
              <p>These are the presents I'm wishing for:</p>
              <ul className="mt-4 space-y-3">
                {wishes && wishes.length > 0 ? (
                  wishes.map((wish, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-green-600">🎄</span>
                      <span className="text-red-600">{wish}</span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-lg">_______</li>
                )}
              </ul>
            </div>
            
            <p>Thank you Santa!</p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            Made with ❤️ in the North Pole by ElevenLabs
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center gap-4">
            {onStartCall && onEndCall && (
              <motion.button
                onClick={isCallActive ? onEndCall : onStartCall}
                disabled={isInitializing}
                className={`relative px-6 py-2.5 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 ${
                  isInitializing ? 'bg-gray-400 cursor-not-allowed' :
                  isCallActive ? 'bg-red-600 hover:bg-red-700' : 
                  'bg-green-600 hover:bg-green-700'} text-white`}
                whileHover={!isInitializing ? { scale: 1.02 } : {}}
                whileTap={!isInitializing ? { scale: 0.98 } : {}}
              >
                {isInitializing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Connecting to Santa...</span>
                  </>
                ) : isCallActive ? (
                  <>
                    <span>End Call with Santa</span>
                    <span>📞</span>
                  </>
                ) : (
                  <>
                    <span>Talk with Santa</span>
                    <span>🎅</span>
                  </>
                )}
              </motion.button>
            )}
            
            {onEmailCard && (
              <motion.button
                onClick={onEmailCard}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Email card to yourself</span>
                <span>📧</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChristmasCard;