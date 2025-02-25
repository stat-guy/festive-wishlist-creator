import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ChristmasTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const year = now.getMonth() >= 11 && now.getDate() > 25 
        ? now.getFullYear() + 1 
        : now.getFullYear();
      
      const christmas = new Date(year, 11, 25); // Month is 0-indexed, so 11 is December
      const difference = christmas.getTime() - now.getTime();

      if (difference > 0) {
        // Calculate total days first to derive months and weeks
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        // Calculate months (approximate - using 30 days per month)
        const months = Math.floor(totalDays / 30);
        
        // Calculate weeks from remaining days after removing months
        const daysAfterMonths = totalDays - (months * 30);
        const weeks = Math.floor(daysAfterMonths / 7);
        
        // Calculate remaining days after removing weeks
        const days = daysAfterMonths % 7;
        
        setTimeLeft({
          months,
          weeks,
          days,
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

  const timerBoxVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="text-center mb-8 w-full">
      <h2 className="text-white text-3xl font-bold mb-6 text-shadow">Time Until Christmas</h2>
      <div className="flex flex-wrap justify-center gap-4 mx-auto max-w-6xl">
        <motion.div 
          className="bg-gradient-to-b from-red-500 to-red-700 rounded-xl p-4 w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border border-red-400"
          whileHover="hover"
          variants={timerBoxVariants}
        >
          <div className="text-3xl font-bold text-white">{timeLeft.months}</div>
          <div className="text-sm text-white font-medium">Months</div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-b from-green-500 to-green-700 rounded-xl p-4 w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border border-green-400"
          whileHover="hover"
          variants={timerBoxVariants}
        >
          <div className="text-3xl font-bold text-white">{timeLeft.weeks}</div>
          <div className="text-sm text-white font-medium">Weeks</div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-b from-red-500 to-red-700 rounded-xl p-4 w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border border-red-400"
          whileHover="hover"
          variants={timerBoxVariants}
        >
          <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-sm text-white font-medium">Days</div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-b from-green-500 to-green-700 rounded-xl p-4 w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border border-green-400"
          whileHover="hover"
          variants={timerBoxVariants}
        >
          <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-sm text-white font-medium">Hours</div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-b from-red-500 to-red-700 rounded-xl p-4 w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border border-red-400"
          whileHover="hover"
          variants={timerBoxVariants}
        >
          <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-white font-medium">Minutes</div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-b from-green-500 to-green-700 rounded-xl p-4 w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border border-green-400"
          whileHover="hover"
          variants={timerBoxVariants}
        >
          <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-white font-medium">Seconds</div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChristmasTimer;