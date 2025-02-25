import React from 'react';
import { motion } from 'framer-motion';

interface ChristmasCardProps {
  name: string;
  wishes: string[];
  location: string;
  onEmailCard?: () => void;
}

const ChristmasCard: React.FC<ChristmasCardProps> = ({
  name,
  wishes,
  location,
  onEmailCard
}) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className="w-full max-w-[600px] mx-auto overflow-hidden relative p-2"
    >
      {/* Glossy Christmas Card with Candy Cane Border */}
      <div 
        className="absolute inset-0 rounded-xl shadow-2xl" 
        style={{
          background: 'repeating-linear-gradient(45deg, #ff0000, #ff0000 10px, #ffffff 10px, #ffffff 20px)',
          padding: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }}
      />
      
      {/* Card Content with Glossy Effect */}
      <div 
        className="relative bg-gradient-to-br from-white to-gray-100 rounded-lg p-8 z-10 border border-white/50"
        style={{
          backdropFilter: 'blur(10px)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 5px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Holiday Decorations */}
        <div className="absolute top-2 left-2 w-16 h-16 bg-contain bg-no-repeat opacity-80" style={{ backgroundImage: "url('/holly-small.png')" }}></div>
        <div className="absolute top-2 right-2 w-16 h-16 bg-contain bg-no-repeat opacity-80" style={{ backgroundImage: "url('/ornament-small.png')" }}></div>
        
        {/* Title with Festive Styling */}
        <h1 className="text-3xl sm:text-4xl font-festive text-center mb-6 sm:mb-8 christmas-gradient font-bold text-glow">My Letter to Santa</h1>
        
        <div className="space-y-4 sm:space-y-6 font-handwritten text-lg sm:text-xl leading-relaxed">
          <p className="text-gray-800">Dear Santa, my name is <span className="text-red-600 font-semibold text-shadow">{name || '_______'}</span></p>
          
          <div>
            <p className="text-gray-800">These are the presents I'm wishing for:</p>
            <ul className="mt-4 space-y-3">
              {wishes && wishes.length > 0 ? wishes.map((wish, index) => (
                <motion.li 
                  key={index} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-3 bg-white/50 p-2 rounded-lg shadow-sm"
                >
                  <motion.span 
                    className="text-green-600"
                    animate={{ 
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    🎄
                  </motion.span>
                  <span className="text-red-600 font-semibold">{wish}</span>
                </motion.li>
              )) : (
                <li className="text-lg bg-white/50 p-2 rounded-lg">_______</li>
              )}
            </ul>
          </div>
          
          <p className="text-gray-800">Thank you Santa!</p>
          
          {/* Signature Line */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-right italic text-gray-600">With holiday cheer,<br />{name || '________'}</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Made with ❤️ in the North Pole by Kai x ElevenLabs x Lovable.Dev x PostHog x Supabase x Anthropic
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button 
            onClick={onEmailCard} 
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-green-600 text-white rounded-lg font-medium text-sm shadow-lg" 
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
            }} 
            whileTap={{
              scale: 0.98
            }}
          >
            <span>Email card to yourself</span>
            <span>📧</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChristmasCard;