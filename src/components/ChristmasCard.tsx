
import React from 'react';
import { CardData } from '@/types/christmas';
import { RefreshCw } from 'lucide-react';

interface ChristmasCardProps extends CardData {
  onRestart?: () => void;
}

const ChristmasCard: React.FC<ChristmasCardProps> = ({ name, wishes, location, onRestart }) => {
  return (
    <div className="w-96 bg-white rounded-lg shadow-xl p-6 transform rotate-2">
      <div className="border-4 border-red-600 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-festive text-red-600">
            My Letter to Santa
          </h2>
          {onRestart && (
            <button
              onClick={onRestart}
              className="p-2 text-red-600 hover:text-red-700 transition-colors"
              title="Start New Letter"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-festive text-lg">Dear Santa,</p>
            <p className="font-festive text-lg">My name is {name || '_______'}</p>
          </div>

          <div>
            <p className="font-festive text-lg">This Christmas, I wish for:</p>
            <ul className="list-disc pl-6 font-festive">
              {wishes && wishes.length > 0 ? (
                wishes.map((wish, index) => (
                  <li key={index} className="text-lg">{wish}</li>
                ))
              ) : (
                <li className="text-lg">_______</li>
              )}
            </ul>
          </div>

          {location && (
            <p className="font-festive text-lg">
              I'll be celebrating in {location}!
            </p>
          )}

          <p className="font-festive text-lg text-right mt-4">
            Thank you, Santa!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChristmasCard;
