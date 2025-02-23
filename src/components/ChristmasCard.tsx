import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ChristmasCardProps {
  name: string;
  wishes: string[];
  location: string;
  isCallActive?: boolean;
  onStartCall?: () => void;
  onEndCall?: () => void;
  onEmailCard?: () => void;
}

const ChristmasCard: React.FC<ChristmasCardProps> = ({
  name,
  wishes,
  location,
  isCallActive = false,
  onStartCall,
  onEndCall,
  onEmailCard
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-transparent border-2 border-red-600 text-red-600 hover:text-white px-8 py-4 rounded-full font-festive text-2xl overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>✉️</span>
            <span>Open Your Letter to Santa</span>
          </span>
          <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </button>
      </motion.div>
    );
  }

  return (
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
          <p>Dear Santa, my name is <span className="text-red-600 font-semibold">{name}</span></p>
          
          <div>
            <p>These are the presents I'm wishing for:</p>
            <ul className="mt-4 space-y-3">
              {wishes.map((wish, index) => (
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
              ))}
            </ul>
          </div>
          
          <p>Thank you Santa!</p>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          Made with ❤️ in the North Pole by ElevenLabs
        </div>

        <div className="mt-6 flex justify-between items-center gap-4">
          <button
            onClick={isCallActive ? onEndCall : onStartCall}
            className={`px-6 py-2.5 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 ${isCallActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            {isCallActive ? (
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
          </button>
          
          <button
            onClick={onEmailCard}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <span>Email card to yourself</span>
            <span>📧</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChristmasCard;