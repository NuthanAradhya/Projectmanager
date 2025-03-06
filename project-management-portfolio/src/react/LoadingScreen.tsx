import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  // Workflow phases representing product development lifecycle
  const phases = [
    "Define a Business Outcome",
    "Discover",
    "Validate",
    "Build",
    "Launch",
    "Evaluate",
    "Iterate",
    "Guys I'm Updated are you?",
  ];

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        
        // Update the current phase based on progress
        const newPhase = Math.floor((newProgress / 100) * phases.length);
        if (newPhase !== currentPhase && newPhase < phases.length) {
          setCurrentPhase(newPhase);
        }
        
        // If loading is complete, call the callback
        if (newProgress >= 100) {
          clearInterval(timer);
          if (onLoadingComplete) {
            setTimeout(() => {
              onLoadingComplete();
            }, 500); // Small delay before transition
          }
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [currentPhase, phases.length, onLoadingComplete]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#000',
      fontFamily: 'Arial, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      {/* Animated project dashboard icon */}
      <div style={{
        marginBottom: '40px'
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect 
            x="20" 
            y="20" 
            width="80" 
            height="80" 
            rx="8" 
            fill="#3498db" 
            opacity={progress / 100}
          />
          <circle 
            cx="60" 
            cy="40" 
            r="12" 
            fill="#fff" 
            opacity={Math.min(progress / 50, 1)}
          />
          <rect 
            x="35" 
            y="65" 
            width={50 * (progress / 100)} 
            height="8" 
            rx="4" 
            fill="#fff"
          />
          <rect 
            x="35" 
            y="80" 
            width={30 * (progress / 100)} 
            height="8" 
            rx="4" 
            fill="#fff"
          />
        </svg>
      </div>

      {/* Current phase display */}
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
        margin: '0 0 20px 0'
      }}>
        {phases[currentPhase]}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '280px',
        height: '4px',
        backgroundColor: '#333',
        borderRadius: '4px',
        overflow: 'hidden',
        margin: '20px 0'
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#3498db',
          borderRadius: '4px',
          transition: 'width 0.2s ease-in-out'
        }} />
      </div>

      {/* Progress percentage */}
      <div style={{
        fontSize: '14px',
        color: '#ccc'
      }}>
        {`${progress}% Complete`}
      </div>

      {/* Product lifecycle visualization */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '30px',
        width: '320px'
      }}>
        {phases.map((phase, index) => (
          <div key={phase} style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: index <= currentPhase ? '#3498db' : '#333',
            margin: '0 5px',
            transition: 'background-color 0.3s ease',
            transform: index === currentPhase ? 'scale(1.3)' : 'scale(1)',
            boxShadow: index === currentPhase ? '0 0 8px rgba(52, 152, 219, 0.6)' : 'none'
          }} />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;