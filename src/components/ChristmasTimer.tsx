import React, { useState, useEffect } from 'react';

const ChristmasTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const year = new Date().getMonth() >= 11 && new Date().getDate() > 25 
        ? new Date().getFullYear() + 1 
        : new Date().getFullYear();
      const christmas = new Date(year, 11, 25);
      const difference = christmas.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-8">
      <h2 className="text-white text-2xl mb-4">Days Until Christmas</h2>
      <div className="flex justify-center gap-4">
        <div className="bg-red-600 rounded-lg p-4 w-24">
          <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-sm text-white">Days</div>
        </div>
        <div className="bg-red-600 rounded-lg p-4 w-24">
          <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-sm text-white">Hours</div>
        </div>
        <div className="bg-red-600 rounded-lg p-4 w-24">
          <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-white">Minutes</div>
        </div>
        <div className="bg-red-600 rounded-lg p-4 w-24">
          <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-white">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default ChristmasTimer;