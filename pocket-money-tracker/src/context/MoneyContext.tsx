import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types
type TransactionType = 'add' | 'remove';
export type CurrencySymbol = '£' | '$' | '€' | '¥';

interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: TransactionType;
    date: string;
}

interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    completed: boolean;
}

interface MoneyState {
    transactions: Transaction[];
    balance: number;
    totalAdded: number;
    totalSpent: number;
    currency: CurrencySymbol;
    savingsGoals: SavingsGoal[];
}

type MoneyAction =
    | { type: 'ADD_MONEY'; payload: { amount: number; description: string } }
    | { type: 'REMOVE_MONEY'; payload: { amount: number; description: string } }
    | { type: 'SET_CURRENCY'; payload: { currency: CurrencySymbol } }
    | { type: 'ADD_SAVINGS_GOAL'; payload: { name: string; targetAmount: number } }
    | { type: 'CONTRIBUTE_TO_GOAL'; payload: { goalId: string; amount: number } }
    | { type: 'REMOVE_SAVINGS_GOAL'; payload: { goalId: string } }
    | { type: 'RESET' };

interface MoneyContextType {
    state: MoneyState;
    addMoney: (amount: number, description: string) => void;
    removeMoney: (amount: number, description: string) => void;
    setCurrency: (currency: CurrencySymbol) => void;
    addSavingsGoal: (name: string, targetAmount: number) => void;
    contributeToGoal: (goalId: string, amount: number) => void;
    removeSavingsGoal: (goalId: string) => void;
    resetData: () => void;
}

// Create context
const MoneyContext = createContext<MoneyContextType | undefined>(undefined);

// Initial state
const initialState: MoneyState = {
    transactions: [],
    balance: 0,
    totalAdded: 0,
    totalSpent: 0,
    currency: '£',
    savingsGoals: [],
};

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

// Reducer function
const moneyReducer = (state: MoneyState, action: MoneyAction): MoneyState => {
    let newState: MoneyState;

    switch (action.type) {
        case 'ADD_MONEY':
            newState = {
                ...state,
                transactions: [
                    {
                        id: uuidv4(),
                        amount: action.payload.amount,
                        description: action.payload.description,
                        type: 'add',
                        date: new Date().toISOString(),
                    },
                    ...state.transactions,
                ],
                balance: state.balance + action.payload.amount,
                totalAdded: state.totalAdded + action.payload.amount,
            };
            break;

        case 'REMOVE_MONEY':
            newState = {
                ...state,
                transactions: [
                    {
                        id: uuidv4(),
                        amount: action.payload.amount,
                        description: action.payload.description,
                        type: 'remove',
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
                        type: 'remove',
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

export const MoneyProvider: React.FC<MoneyProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(moneyReducer, loadState());

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('pocketMoneyState', JSON.stringify(state));
    }, [state]);

    // Action creators
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

    return (
        <MoneyContext.Provider value={{
            state,
            addMoney,
            removeMoney,
            setCurrency,
            addSavingsGoal,
            contributeToGoal,
            removeSavingsGoal,
            resetData
        }}>
            {children}
        </MoneyContext.Provider>
    );
};

// Custom hook to use the money context
export const useMoneyContext = (): MoneyContextType => {
    const context = useContext(MoneyContext);
    if (context === undefined) {
        throw new Error('useMoneyContext must be used within a MoneyProvider');
    }
    return context;
};