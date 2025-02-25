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

  // Create a responsive timer box component to reduce duplication
  const TimerBox = ({ value, label, color }: { value: number, label: string, color: "red" | "green" }) => (
    <motion.div 
      className={`bg-gradient-to-b ${color === "red" ? "from-red-500 to-red-700 border-red-400" : "from-green-500 to-green-700 border-green-400"} 
                 rounded-xl p-2 sm:p-3 lg:p-4 w-16 sm:w-20 lg:w-24 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-80 border`}
      whileHover="hover"
      variants={timerBoxVariants}
    >
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs sm:text-sm text-white font-medium">{label}</div>
    </motion.div>
  );

  return (
    <div className="text-center mb-6 sm:mb-8 w-full">
      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-shadow">Time Until Christmas</h2>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mx-auto max-w-6xl">
        <TimerBox value={timeLeft.months} label="Months" color="red" />
        <TimerBox value={timeLeft.weeks} label="Weeks" color="green" />
        <TimerBox value={timeLeft.days} label="Days" color="red" />
        <TimerBox value={timeLeft.hours} label="Hours" color="green" />
        <TimerBox value={timeLeft.minutes} label="Minutes" color="red" />
        <TimerBox value={timeLeft.seconds} label="Seconds" color="green" />
      </div>
    </div>
  );
};

export default ChristmasTimer;