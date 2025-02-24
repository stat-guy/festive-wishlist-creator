
import React, { useState, useEffect } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: string;
    animationDuration: string;
    opacity: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        opacity: Math.random(),
        size: Math.random() * 4 + 2
      }));
      setSnowflakes(flakes);
    };

    generateSnowflakes();
    const interval = setInterval(generateSnowflakes, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `fall ${flake.animationDuration} linear infinite`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
