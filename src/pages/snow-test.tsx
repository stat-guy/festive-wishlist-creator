import React from 'react';
import Snowfall from 'react-snowfall';

const SnowTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center">
      <h1 className="text-4xl text-white mb-8 z-10 relative">Snowfall Test</h1>
      
      <Snowfall 
        snowflakeCount={300}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
};

export default SnowTest;