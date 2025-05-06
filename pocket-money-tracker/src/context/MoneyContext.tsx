import React, { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
    MoneyContext, 
    levels, 
    initialState 
} from './MoneyContextDefinition';
import type { 
    MoneyState, 
    CurrencySymbol, 
    CharacterType, 
    MoodType, 
    TransactionType 
} from './MoneyContextDefinition';

type MoneyAction =
    | { type: 'ADD_MONEY'; payload: { amount: number; description: string } }
    | { type: 'REMOVE_MONEY'; payload: { amount: number; description: string } }
    | { type: 'SET_CURRENCY'; payload: { currency: CurrencySymbol } }
    | { type: 'ADD_SAVINGS_GOAL'; payload: { name: string; targetAmount: number } }
    | { type: 'CONTRIBUTE_TO_GOAL'; payload: { goalId: string; amount: number } }
    | { type: 'REMOVE_SAVINGS_GOAL'; payload: { goalId: string } }
    | { type: 'SET_CHARACTER'; payload: { type: CharacterType } }
    | { type: 'SET_MOOD'; payload: { mood: MoodType } }
    | { type: 'ADD_XP'; payload: { amount: number } }
    | { type: 'UNLOCK_ACHIEVEMENT'; payload: { achievementId: string } }
    | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { achievementId: string; progress: number } }
    | { type: 'RESET' };

export interface MoneyContextType {
    state: MoneyState;
    addMoney: (amount: number, description: string) => void;
    removeMoney: (amount: number, description: string) => void;
    setCurrency: (currency: CurrencySymbol) => void;
    addSavingsGoal: (name: string, targetAmount: number) => void;
    contributeToGoal: (goalId: string, amount: number) => void;
    removeSavingsGoal: (goalId: string) => void;
    resetData: () => void;
    // Gamification methods
    setCharacter: (type: CharacterType) => void;
    setMood: (mood: MoodType) => void;
    addXP: (amount: number) => void;
    unlockAchievement: (achievementId: string) => void;
    updateAchievementProgress: (achievementId: string, progress: number) => void;
    getLevelInfo: () => { name: string; level: number; currentXP: number; xpForNextLevel: number };
}

// Load state from localStorage
const loadState = (): MoneyState => {
    try {
        const savedState = localStorage.getItem('pocketMoneyState');
        if (savedState === null) {
            return initialState;
        }
        const parsedState = JSON.parse(savedState);
        // Ensure savingsGoals is always an array
        if (!parsedState.savingsGoals) {
            parsedState.savingsGoals = [];
        }
        return parsedState;
    } catch (err) {
        console.error('Error loading state from localStorage:', err);
        return initialState;
    }
};

// Helper function to check and update achievements
const checkAchievements = (state: MoneyState): MoneyState => {
    const updatedAchievements = [...state.achievements];
    let xpGained = 0;
    let shouldUpdateMood = false;
    
    // Check first deposit achievement
    const firstDepositAchievement = updatedAchievements.find(a => a.id === 'first-deposit');
    if (firstDepositAchievement && !firstDepositAchievement.unlocked && state.totalAdded > 0) {
        firstDepositAchievement.unlocked = true;
        xpGained += 50;
        shouldUpdateMood = true;
    }
    
    // Check big saver achievement
    const bigSaverAchievement = updatedAchievements.find(a => a.id === 'big-saver');
    if (bigSaverAchievement) {
        const progress = Math.min(state.totalAdded, bigSaverAchievement.maxProgress!);
        if (progress !== bigSaverAchievement.progress) {
            bigSaverAchievement.progress = progress;
            if (progress >= bigSaverAchievement.maxProgress! && !bigSaverAchievement.unlocked) {
                bigSaverAchievement.unlocked = true;
                xpGained += 100;
                shouldUpdateMood = true;
            }
        }
    }
    
    // Check goal achiever
    const goalAchieverAchievement = updatedAchievements.find(a => a.id === 'goal-achiever');
    if (goalAchieverAchievement && !goalAchieverAchievement.unlocked && 
        state.savingsGoals.some(goal => goal.completed)) {
        goalAchieverAchievement.unlocked = true;
        xpGained += 75;
        shouldUpdateMood = true;
    }
    
    // Calculate new level based on XP
    const totalXP = state.xp + xpGained;
    let newLevel = state.currentLevel;
    for (let i = levels.length - 1; i >= 0; i--) {
        if (totalXP >= levels[i].xpRequired) {
            newLevel = levels[i].level;
            break;
        }
    }
    
    // Update mood if achievements were unlocked
    const mood = shouldUpdateMood ? 'excited' : state.character.mood;
    
    return {
        ...state,
        achievements: updatedAchievements,
        xp: totalXP,
        currentLevel: newLevel,
        character: {
            ...state.character,
            mood
        }
    };
};

// Reducer function
const moneyReducer = (state: MoneyState, action: MoneyAction): MoneyState => {
    let newState: MoneyState;

    switch (action.type) {
        case 'ADD_MONEY': {
            // Check for consecutive savings streak
            const today = new Date().toISOString().split('T')[0];
            const isConsecutive = state.lastSavingDate ? 
                new Date(state.lastSavingDate).getTime() + (24 * 60 * 60 * 1000) >= new Date(today).getTime() : 
                false;
            
            const newConsecutiveSavings = isConsecutive ? state.consecutiveSavings + 1 : 1;
            
            // Update savings streak achievement if needed
            const savingsStreakAchievement = state.achievements.find(a => a.id === 'savings-streak');
            let streakUpdatedAchievements = [...state.achievements];
            let streakXP = 0;
            
            if (savingsStreakAchievement && !savingsStreakAchievement.unlocked) {
                const newProgress = Math.min(newConsecutiveSavings, savingsStreakAchievement.maxProgress!);
                if (newProgress !== savingsStreakAchievement.progress) {
                    streakUpdatedAchievements = streakUpdatedAchievements.map(a => 
                        a.id === 'savings-streak' ? 
                            { ...a, progress: newProgress, unlocked: newProgress >= a.maxProgress! } : 
                            a
                    );
                    
                    if (newProgress >= savingsStreakAchievement.maxProgress!) {
                        streakXP = 75;
                    }
                }
            }
            
            newState = {
                ...state,
                transactions: [
                    {
                        id: uuidv4(),
                        amount: action.payload.amount,
                        description: action.payload.description,
                        type: 'income',
                        date: new Date().toISOString(),
                    },
                    ...state.transactions,
                ],
                balance: state.balance + action.payload.amount,
                totalAdded: state.totalAdded + action.payload.amount,
                xp: state.xp + 10 + streakXP, // Award XP for saving
                consecutiveSavings: newConsecutiveSavings,
                lastSavingDate: today,
                achievements: streakUpdatedAchievements,
                character: {
                    ...state.character,
                    mood: 'happy'
                }
            };
            
            // Check and update achievements
            newState = checkAchievements(newState);
            break;
        }

        case 'REMOVE_MONEY':
            newState = {
                ...state,
                transactions: [
                    {
                        id: uuidv4(),
                        amount: action.payload.amount,
                        description: action.payload.description,
                        type: 'expense',
                        date: new Date().toISOString(),
                    },
                    ...state.transactions,
                ],
                balance: state.balance - action.payload.amount,
                totalSpent: state.totalSpent + action.payload.amount,
            };
            break;

        case 'SET_CURRENCY':
            newState = {
                ...state,
                currency: action.payload.currency,
            };
            break;

        case 'ADD_SAVINGS_GOAL':
            newState = {
                ...state,
                savingsGoals: [
                    ...state.savingsGoals,
                    {
                        id: uuidv4(),
                        name: action.payload.name,
                        targetAmount: action.payload.targetAmount,
                        currentAmount: 0,
                        completed: false,
                    },
                ],
            };
            break;

        case 'CONTRIBUTE_TO_GOAL': {
            const { goalId, amount } = action.payload;
            const updatedGoals = state.savingsGoals.map(goal => {
                if (goal.id === goalId) {
                    const newAmount = goal.currentAmount + amount;
                    return {
                        ...goal,
                        currentAmount: newAmount,
                        completed: newAmount >= goal.targetAmount,
                    };
                }
                return goal;
            });

            newState = {
                ...state,
                savingsGoals: updatedGoals,
                balance: state.balance - amount,
                transactions: [
                    {
                        id: uuidv4(),
                        amount: amount,
                        description: `Contribution to goal: ${state.savingsGoals.find(g => g.id === goalId)?.name}`,
                        type: 'expense',
                        date: new Date().toISOString(),
                    },
                    ...state.transactions,
                ],
                totalSpent: state.totalSpent + amount,
            };
            break;
        }

        case 'REMOVE_SAVINGS_GOAL':
            newState = {
                ...state,
                savingsGoals: state.savingsGoals.filter(goal => goal.id !== action.payload.goalId),
            };
            break;

        case 'SET_CHARACTER':
            newState = {
                ...state,
                character: {
                    ...state.character,
                    type: action.payload.type
                }
            };
            break;
            
        case 'SET_MOOD':
            newState = {
                ...state,
                character: {
                    ...state.character,
                    mood: action.payload.mood
                }
            };
            break;
            
        case 'ADD_XP': {
            const totalXP = state.xp + action.payload.amount;
            let newLevel = state.currentLevel;
            
            // Calculate new level based on XP
            for (let i = levels.length - 1; i >= 0; i--) {
                if (totalXP >= levels[i].xpRequired) {
                    newLevel = levels[i].level;
                    break;
                }
            }
            
            newState = {
                ...state,
                xp: totalXP,
                currentLevel: newLevel
            };
            break;
        }
            
        case 'UNLOCK_ACHIEVEMENT':
            newState = {
                ...state,
                achievements: state.achievements.map(achievement => 
                    achievement.id === action.payload.achievementId ? 
                        { ...achievement, unlocked: true } : 
                        achievement
                )
            };
            break;
            
        case 'UPDATE_ACHIEVEMENT_PROGRESS': {
            const achievement = state.achievements.find(a => a.id === action.payload.achievementId);
            
            if (achievement && achievement.maxProgress) {
                const isUnlocked = action.payload.progress >= achievement.maxProgress;
                
                newState = {
                    ...state,
                    achievements: state.achievements.map(a => 
                        a.id === action.payload.achievementId ? 
                            { 
                                ...a, 
                                progress: Math.min(action.payload.progress, a.maxProgress!),
                                unlocked: isUnlocked || a.unlocked
                            } : 
                            a
                    ),
                    // Add XP if achievement was just unlocked
                    xp: isUnlocked && !achievement.unlocked ? state.xp + 50 : state.xp
                };
            } else {
                newState = state;
            }
            break;
        }
            
        case 'RESET':
            newState = initialState;
            break;

        default:
            return state;
    }

    // Ensure savingsGoals is always an array
    if (!newState.savingsGoals) {
        newState.savingsGoals = [];
    }

    // Save to localStorage
    localStorage.setItem('pocketMoneyState', JSON.stringify(newState));
    return newState;
};

// Provider component
interface MoneyProviderProps {
    children: ReactNode;
}

const MoneyProvider: React.FC<MoneyProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(moneyReducer, initialState, loadState);

    useEffect(() => {
        localStorage.setItem('pocketMoneyState', JSON.stringify(state));
    }, [state]);

    const addMoney = (amount: number, description: string) => {
        dispatch({ type: 'ADD_MONEY', payload: { amount, description } });
    };

    const removeMoney = (amount: number, description: string) => {
        dispatch({ type: 'REMOVE_MONEY', payload: { amount, description } });
    };

    const setCurrency = (currency: CurrencySymbol) => {
        dispatch({ type: 'SET_CURRENCY', payload: { currency } });
    };

    const addSavingsGoal = (name: string, targetAmount: number) => {
        dispatch({ type: 'ADD_SAVINGS_GOAL', payload: { name, targetAmount } });
    };

    const contributeToGoal = (goalId: string, amount: number) => {
        dispatch({ type: 'CONTRIBUTE_TO_GOAL', payload: { goalId, amount } });
    };

    const removeSavingsGoal = (goalId: string) => {
        dispatch({ type: 'REMOVE_SAVINGS_GOAL', payload: { goalId } });
    };

    const resetData = () => {
        dispatch({ type: 'RESET' });
    };
    
    // Gamification methods
    const setCharacter = (type: CharacterType) => {
        dispatch({ type: 'SET_CHARACTER', payload: { type } });
    };
    
    const setMood = (mood: MoodType) => {
        dispatch({ type: 'SET_MOOD', payload: { mood } });
    };
    
    const addXP = (amount: number) => {
        dispatch({ type: 'ADD_XP', payload: { amount } });
    };
    
    const unlockAchievement = (achievementId: string) => {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { achievementId } });
    };
    
    const updateAchievementProgress = (achievementId: string, progress: number) => {
        dispatch({ type: 'UPDATE_ACHIEVEMENT_PROGRESS', payload: { achievementId, progress } });
    };
    
    const getLevelInfo = () => {
        // Safely find the current level with a fallback to the first level
        const currentLevel = levels.find(l => l.level === state.currentLevel) || levels[0];
        const nextLevelIndex = levels.findIndex(l => l.level === currentLevel.level) + 1;
        const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
        
        return {
            name: currentLevel.name,
            level: currentLevel.level,
            currentXP: state.xp,
            xpForNextLevel: nextLevel ? nextLevel.xpRequired : currentLevel.xpRequired + 1000
        };
    };

    return (
        <MoneyContext.Provider
            value={{
                state,
                addMoney,
                removeMoney,
                setCurrency,
                addSavingsGoal,
                contributeToGoal,
                removeSavingsGoal,
                resetData,
                // Gamification methods
                setCharacter,
                setMood,
                addXP,
                unlockAchievement,
                updateAchievementProgress,
                getLevelInfo
            }}
        >
            {children}
        </MoneyContext.Provider>
    );
};

export { MoneyProvider };