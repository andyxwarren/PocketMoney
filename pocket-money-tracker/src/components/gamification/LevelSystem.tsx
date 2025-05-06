import React from 'react';
import '../../styles/LevelSystem.css';

interface LevelSystemProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  levelName: string;
}

const levelEmojis = ['🥚', '🐣', '🐥', '🐔', '🦅', '🦸‍♀️'];

const LevelSystem: React.FC<LevelSystemProps> = ({ 
  currentLevel,
  currentXP,
  xpForNextLevel,
  levelName
}) => {
  const progressPercentage = (currentXP / xpForNextLevel) * 100;
  
  return (
    <div className="level-system">
      <div className="level-header">
        <div className="level-badge">
          <span className="level-emoji">{levelEmojis[Math.min(currentLevel, levelEmojis.length - 1)]}</span>
          <span className="level-number">{currentLevel}</span>
        </div>
        <div className="level-title">
          <h3>{levelName}</h3>
          <p className="level-xp">{currentXP} / {xpForNextLevel} XP</p>
        </div>
      </div>
      
      <div className="level-progress">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="level-info">
        <p>Keep saving to level up and unlock new rewards!</p>
      </div>
    </div>
  );
};

export default LevelSystem;
