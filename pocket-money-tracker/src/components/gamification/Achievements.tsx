import React from 'react';
import '../../styles/Achievements.css';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <div className="achievements-container">
      <h3>Your Achievements</h3>
      <div className="achievements-list">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">
              {achievement.unlocked ? (
                <span className="achievement-emoji">{achievement.icon}</span>
              ) : (
                <span className="achievement-emoji locked">🔒</span>
              )}
            </div>
            <div className="achievement-info">
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              {achievement.maxProgress && (
                <div className="achievement-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(achievement.progress! / achievement.maxProgress) * 100}%` }}
                  ></div>
                  <div className="progress-text">
                    {achievement.progress} / {achievement.maxProgress}
                  </div>
                </div>
              )}
            </div>
            {achievement.unlocked && (
              <div className="achievement-unlocked-badge">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
