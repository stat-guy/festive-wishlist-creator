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
  return <motion.div initial={{
    scale: 0.9,
    opacity: 0
  }} animate={{
    scale: 1,
    opacity: 1
  }} className="w-[600px] mx-auto bg-white rounded-lg overflow-hidden relative p-1">
      {/* Candy Cane Border */}
      <div className="absolute inset-0 rounded-lg" style={{
      background: 'repeating-linear-gradient(45deg, #ff0000, #ff0000 10px, #ffffff 10px, #ffffff 20px)',
      padding: '12px'
    }} />
      
      <div className="relative bg-white rounded-lg p-8 z-10">
        <h1 className="text-3xl font-festive text-red-600 text-center mb-8">My Letter to Santa</h1>
        
        <div className="space-y-6 font-handwritten text-xl leading-relaxed">
          <p>Dear Santa, my name is <span className="text-red-600 font-semibold">{name || '_______'}</span></p>
          
          <div>
            <p>These are the presents I'm wishing for:</p>
            <ul className="mt-4 space-y-3">
              {wishes && wishes.length > 0 ? wishes.map((wish, index) => <motion.li key={index} initial={{
              x: -20,
              opacity: 0
            }} animate={{
              x: 0,
              opacity: 1
            }} transition={{
              delay: index * 0.2
            }} className="flex items-center gap-3">
                    <span className="text-green-600">🎄</span>
                    <span className="text-red-600">{wish}</span>
                  </motion.li>) : <li className="text-lg">_______</li>}
            </ul>
          </div>
          
          <p>Thank you Santa!</p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">Made with ❤️ in the North Pole by Kai x ElevenLabs x Lovable.Dev x PostHog x Supabase x Anthropic(via the Github MCP Tool)</div>

        <div className="mt-6 flex justify-center">
          
        </div>
      </div>
    </motion.div>;
};
export default ChristmasCard;