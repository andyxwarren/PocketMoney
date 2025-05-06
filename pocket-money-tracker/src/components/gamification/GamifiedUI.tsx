import React, { useState, useEffect } from 'react';
import { useMoneyContext } from '../../context/useMoneyContext';
import Character from '../character/Character';
import CharacterSelector from '../character/CharacterSelector';
import Achievements from './Achievements';
import LevelSystem from './LevelSystem';
import Celebration from './Celebration';
import '../../styles/GamifiedUI.css';

interface GamifiedUIProps {
  showRewardsOnly?: boolean;
}

const GamifiedUI: React.FC<GamifiedUIProps> = ({ showRewardsOnly = false }) => {
  const { state, setCharacter, getLevelInfo } = useMoneyContext();
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    message: string;
    type: 'confetti' | 'coins' | 'stars';
  }>({ show: false, message: '', type: 'confetti' });
  
  // Monitor for achievement unlocks to trigger celebrations
  useEffect(() => {
    const unlockedAchievement = state.achievements.find((a: { id: string, unlocked: boolean }) => a.unlocked && 
      // Check localStorage to see if we've already celebrated this achievement
      !localStorage.getItem(`celebrated_${a.id}`));
    
    if (unlockedAchievement) {
      setCelebration({
        show: true,
        message: `Achievement Unlocked: ${unlockedAchievement.title}`,
        type: 'stars'
      });
      
      // Mark this achievement as celebrated
      localStorage.setItem(`celebrated_${unlockedAchievement.id}`, 'true');
    }
  }, [state.achievements]);
  
  // Monitor for level ups
  useEffect(() => {
    const currentLevelInfo = getLevelInfo();
    const previousLevel = localStorage.getItem('previous_level');
    
    if (previousLevel && parseInt(previousLevel) < currentLevelInfo.level) {
      setCelebration({
        show: true,
        message: `Level Up! You're now a ${currentLevelInfo.name}`,
        type: 'confetti'
      });
    }
    
    // Save current level for next comparison
    localStorage.setItem('previous_level', currentLevelInfo.level.toString());
  }, [getLevelInfo, state.currentLevel]);
  
  const handleCharacterSelect = (type: 'piggy' | 'wizard' | 'robot' | 'unicorn') => {
    setCharacter(type);
    setShowCharacterSelector(false);
  };
  
  const handleCelebrationComplete = () => {
    setCelebration({ show: false, message: '', type: 'confetti' });
  };
  
  const levelInfo = getLevelInfo();
  
  return (
    <div className="gamified-ui">
      {/* Character section - only shown in dashboard mode */}
      {!showRewardsOnly && (
        <div className="character-container">
          <div onClick={() => setShowCharacterSelector(true)} className="character-wrapper">
            <Character 
              type={state.character?.type || 'piggy'}
              mood={state.character?.mood || 'neutral'}
              message={getRandomEncouragement(state.balance, state.savingsGoals)}
            />
          </div>
          
          {showCharacterSelector && (
            <div className="character-selector-modal">
              <div className="modal-content">
                <button 
                  className="close-modal" 
                  onClick={() => setShowCharacterSelector(false)}
                >
                  ×
                </button>
                <CharacterSelector 
                  selectedType={state.character.type}
                  onSelect={handleCharacterSelect}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="gamification-panel">
        {/* Show level info only in dashboard mode */}
        {!showRewardsOnly && (
          <LevelSystem 
            currentLevel={levelInfo.level}
            currentXP={levelInfo.currentXP}
            xpForNextLevel={levelInfo.xpForNextLevel}
            levelName={levelInfo.name}
          />
        )}
        
        {/* In rewards mode, always show achievements */}
        {showRewardsOnly ? (
          <div className="rewards-only-view">
            <h3>Your Achievements</h3>
            <Achievements achievements={state.achievements} />
          </div>
        ) : (
          <>
            <button 
              className="achievements-toggle"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              {showAchievements ? 'Hide Achievements' : 'Show Achievements'}
            </button>
            
            {showAchievements && (
              <Achievements achievements={state.achievements} />
            )}
          </>
        )}
      </div>
      
      {celebration.show && (
        <Celebration 
          show={true}
          message={celebration.message}
          type={celebration.type}
          onComplete={handleCelebrationComplete}
        />
      )}
    </div>
  );
};

// Helper function for random encouraging messages
function getRandomEncouragement(balance: number, savingsGoals: {id: string; name: string; targetAmount: number; currentAmount: number; completed: boolean}[]): string {
  const messages = [
    `You have ${balance} saved up! Keep going!`,
    'Saving money today means more fun tomorrow!',
    'You\'re doing great with your savings!',
    'Every coin counts towards your dreams!',
    'Wow! Look at you saving like a pro!'
  ];
  
  // Check if they have goals and customize message
  if (savingsGoals.length > 0) {
    const incompleteGoals = savingsGoals.filter(goal => !goal.completed);
    if (incompleteGoals.length > 0) {
      const randomGoal = incompleteGoals[Math.floor(Math.random() * incompleteGoals.length)];
      messages.push(`Keep saving for your ${randomGoal.name} goal!`);
    } else if (savingsGoals.some(goal => goal.completed)) {
      messages.push('Amazing! You\'ve reached your savings goals!');
    }
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export default GamifiedUI;
