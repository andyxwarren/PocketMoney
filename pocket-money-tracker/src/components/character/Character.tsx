import React, { useState } from 'react';
import '../../styles/Character.css';

interface CharacterProps {
  type: 'piggy' | 'wizard' | 'robot' | 'unicorn';
  mood?: 'happy' | 'neutral' | 'excited';
  message?: string;
  onClose?: () => void;
}

const Character: React.FC<CharacterProps> = ({ 
  type = 'piggy', 
  mood = 'neutral', 
  message,
  onClose 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const getCharacterImage = () => {
    return `/images/characters/${type}-${mood}.svg`;
  };

  const handleAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className={`character-container ${isAnimating ? 'bounce' : ''}`}>
      <div className="character" onClick={handleAnimation}>
        {/* Fallback if SVG isn't available */}
        <div className={`character-emoji ${type}`}>
          {type === 'piggy' && '🐷'}
          {type === 'wizard' && '🧙'}
          {type === 'robot' && '🤖'}
          {type === 'unicorn' && '🦄'}
        </div>
        <img 
          src={getCharacterImage()} 
          alt={`${type} character`} 
          className="character-img"
          onError={(e) => {
            // If image fails to load, we'll rely on the emoji fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      
      {message && (
        <div className="speech-bubble">
          <p>{message}</p>
          {onClose && (
            <button className="close-bubble" onClick={onClose}>×</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Character;
