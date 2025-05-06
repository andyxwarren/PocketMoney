import { createContext } from 'react';
import type { Achievement } from '../components/gamification/Achievements';

// Define types
export type TransactionType = 'income' | 'expense';
export type CurrencySymbol = '£' | '$' | '€' | '¥';
export type CharacterType = 'piggy' | 'wizard' | 'robot' | 'unicorn';
export type MoodType = 'happy' | 'neutral' | 'excited';

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: TransactionType;
    date: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    completed: boolean;
}

export interface Level {
    level: number;
    name: string;
    xpRequired: number;
}

export interface MoneyState {
    transactions: Transaction[];
    balance: number;
    totalAdded: number;
    totalSpent: number;
    currency: CurrencySymbol;
    savingsGoals: SavingsGoal[];
    character: {
        type: CharacterType;
        mood: MoodType;
    };
    xp: number;
    currentLevel: number;
    achievements: Achievement[];
    consecutiveSavings: number;
    lastSavingDate: string | null;
}

export interface MoneyContextType {
    state: MoneyState;
    addMoney: (amount: number, description: string) => void;
    removeMoney: (amount: number, description: string) => void;
    setCurrency: (currency: CurrencySymbol) => void;
    addSavingsGoal: (name: string, targetAmount: number) => void;
    contributeToGoal: (goalId: string, amount: number) => void;
    removeSavingsGoal: (goalId: string) => void;
    resetData: () => void;
    setCharacter: (type: CharacterType) => void;
    setMood: (mood: MoodType) => void;
    addXP: (amount: number) => void;
    unlockAchievement: (achievementId: string) => void;
    updateAchievementProgress: (achievementId: string, progress: number) => void;
    getLevelInfo: () => { name: string; level: number; currentXP: number; xpForNextLevel: number };
}

// Create context
export const MoneyContext = createContext<MoneyContextType | undefined>(undefined);

// Define levels for the game
export const levels: Level[] = [
    {
        level: 1,
        name: 'Money Beginner',
        xpRequired: 0
    },
    {
        level: 2,
        name: 'Money Explorer',
        xpRequired: 100
    },
    {
        level: 3,
        name: 'Money Adventurer',
        xpRequired: 250
    },
    {
        level: 4,
        name: 'Money Captain',
        xpRequired: 500
    },
    {
        level: 5,
        name: 'Money Master',
        xpRequired: 1000
    }
];

// Default achievements
export const defaultAchievements: Achievement[] = [
    {
        id: 'first-pound',
        title: 'First Pound',
        description: 'Add your first pound',
        icon: '💰',
        unlocked: false
    },
    {
        id: 'saving-streak',
        title: 'Saving Streak',
        description: 'Add money 3 days in a row',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        maxProgress: 3
    },
    {
        id: 'big-saver',
        title: 'Big Saver',
        description: 'Save up £50 in total',
        icon: '🏦',
        unlocked: false,
        progress: 0,
        maxProgress: 50
    },
    {
        id: 'goal-achiever',
        title: 'Goal Achiever',
        description: 'Complete your first savings goal',
        icon: '🏆',
        unlocked: false
    },
    {
        id: 'budget-master',
        title: 'Budget Master',
        description: 'Have 5 or more transactions without going below 0',
        icon: '📊',
        unlocked: false,
        progress: 0,
        maxProgress: 5
    }
];

// Initial state
export const initialState: MoneyState = {
    transactions: [],
    balance: 0,
    totalAdded: 0,
    totalSpent: 0,
    currency: '£',
    savingsGoals: [],
    // Gamification initial state
    character: {
        type: 'piggy',
        mood: 'neutral'
    },
    xp: 0,
    currentLevel: 1,
    achievements: defaultAchievements,
    consecutiveSavings: 0,
    lastSavingDate: null
};
