import React, { useEffect } from 'react';

// This component ensures character images are loaded properly
const CharacterLoader: React.FC = () => {
  useEffect(() => {
    // Preload character images to ensure they're available
    const characterTypes = ['piggy', 'wizard', 'robot', 'unicorn'];
    const moods = ['neutral', 'happy', 'excited'];
    
    characterTypes.forEach(type => {
      moods.forEach(mood => {
        const img = new Image();
        img.src = `/images/characters/${type}-${mood}.svg`;
      });
    });
  }, []);
  
  return null; // This component doesn't render anything
};

export default CharacterLoader;
