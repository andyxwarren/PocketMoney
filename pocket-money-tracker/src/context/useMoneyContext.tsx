import { useContext } from 'react';
import { MoneyContext } from './MoneyContextDefinition';
import type { MoneyContextType } from './MoneyContextDefinition';

// Custom hook to use the money context
export const useMoneyContext = (): MoneyContextType => {
  const context = useContext(MoneyContext);
  if (context === undefined) {
    throw new Error('useMoneyContext must be used within a MoneyProvider');
  }
  return context;
};
