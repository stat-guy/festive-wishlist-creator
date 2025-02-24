import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface SantaChatProps {
  isActive: boolean;
  messages: string[];
  onClose: () => void;
}

const SantaChat: React.FC<SantaChatProps> = ({ isActive, messages, onClose }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed bottom-0 right-0 m-4 bg-white rounded-lg shadow-xl overflow-hidden max-w-md"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-red-600 text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Santa's Chat</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
              Close
            </button>
          </div>
          <div className="p-4">
            {messages.map((message, index) => (
              <p key={index} className="mb-2">
                {message}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SantaChat;
