
import React from 'react';
import { CardData } from '@/types/christmas';

const ChristmasCard: React.FC<CardData> = ({ name, wishes, location }) => {
  return (
    <div className="w-96 bg-white rounded-lg shadow-xl p-6 transform rotate-2">
      <div className="border-4 border-red-600 p-4 rounded-lg">
        <h2 className="text-2xl font-festive text-red-600 text-center mb-4">
          My Letter to Santa
        </h2>
        
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
