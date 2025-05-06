import React, { useState } from 'react';
import Character from './Character';
import '../../styles/CharacterSelector.css';

interface CharacterSelectorProps {
  onSelect: (type: 'piggy' | 'wizard' | 'robot' | 'unicorn') => void;
  selectedType: 'piggy' | 'wizard' | 'robot' | 'unicorn';
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onSelect, selectedType }) => {
  const characterTypes = ['piggy', 'wizard', 'robot', 'unicorn'] as const;
  
  return (
    <div className="character-selector">
      <h3>Choose Your Money Buddy</h3>
      <div className="character-options">
        {characterTypes.map((type) => (
          <div 
            key={type} 
            className={`character-option ${selectedType === type ? 'selected' : ''}`}
            onClick={() => onSelect(type)}
          >
            <Character type={type} />
            <p className="character-name">
              {type === 'piggy' && 'Penny Piggy'}
              {type === 'wizard' && 'Money Wizard'}
              {type === 'robot' && 'Savings Bot'}
              {type === 'unicorn' && 'Cash Unicorn'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelector;
