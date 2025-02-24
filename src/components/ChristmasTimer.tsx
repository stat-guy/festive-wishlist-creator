import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ChristmasTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const year = new Date().getFullYear();
      const christmas = new Date(year, 11, 25); // Month is 0-based, so 11 = December
      
      // If we've passed Christmas, get time until next year's Christmas
      if (new Date() > christmas) {
        christmas.setFullYear(year + 1);
      }

      const difference = +christmas - +new Date();
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 rounded-lg p-4 text-white">
      <h2 className="text-xl font-festive mb-2 text-center">Days Until Christmas</h2>
      <div className="flex space-x-4 justify-center">
        <div className="text-center">
          <div className="bg-red-700 rounded px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold">{timeLeft.days}</span>
          </div>
          <div className="text-sm mt-1">Days</div>
        </div>
        <div className="text-center">
          <div className="bg-red-700 rounded px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold">{timeLeft.hours}</span>
          </div>
          <div className="text-sm mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="bg-red-700 rounded px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold">{timeLeft.minutes}</span>
          </div>
          <div className="text-sm mt-1">Minutes</div>
        </div>
        <div className="text-center">
          <div className="bg-red-700 rounded px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold">{timeLeft.seconds}</span>
          </div>
          <div className="text-sm mt-1">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default ChristmasTimer;