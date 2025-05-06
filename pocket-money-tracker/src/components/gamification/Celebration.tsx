import React, { useEffect, useState } from 'react';
import '../../styles/Celebration.css';

interface CelebrationProps {
  show: boolean;
  message: string;
  onComplete?: () => void;
  type?: 'confetti' | 'coins' | 'stars';
  duration?: number;
}

const Celebration: React.FC<CelebrationProps> = ({
  show,
  message,
  onComplete,
  type = 'confetti',
  duration = 4000
}) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (show) {
      // Create particles
      const newParticles: JSX.Element[] = [];
      const particleCount = type === 'confetti' ? 100 : type === 'coins' ? 20 : 30;
      
      for (let i = 0; i < particleCount; i++) {
        const left = Math.random() * 100;
        const animDuration = 0.5 + Math.random() * 1.5;
        const size = type === 'coins' ? 30 + Math.random() * 10 : 6 + Math.random() * 8;
        const delay = Math.random() * 0.4;
        
        if (type === 'confetti') {
          const colors = ['#FF5722', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const rotation = Math.random() * 360;
          
          newParticles.push(
            <div 
              key={i}
              className="celebration-particle confetti"
              style={{
                left: `${left}%`,
                backgroundColor: color,
                width: `${size}px`,
                height: `${size / 2}px`,
                animationDuration: `${animDuration}s`,
                animationDelay: `${delay}s`,
                transform: `rotate(${rotation}deg)`
              }}
            />
          );
        } else if (type === 'coins') {
          newParticles.push(
            <div 
              key={i}
              className="celebration-particle coin"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${animDuration}s`,
                animationDelay: `${delay}s`
              }}
            >
              💰
            </div>
          );
        } else if (type === 'stars') {
          newParticles.push(
            <div 
              key={i}
              className="celebration-particle star"
              style={{
                left: `${left}%`,
                fontSize: `${size * 2}px`,
                animationDuration: `${animDuration}s`,
                animationDelay: `${delay}s`
              }}
            >
              ⭐
            </div>
          );
        }
      }
      
      setParticles(newParticles);
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, type, duration, onComplete]);
  
  if (!show) return null;
  
  return (
    <div className="celebration-container">
      <div className="celebration-particles">
        {particles}
      </div>
      <div className="celebration-message">
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default Celebration;
