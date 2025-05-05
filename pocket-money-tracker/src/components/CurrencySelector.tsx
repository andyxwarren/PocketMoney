import React from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import '../styles/CurrencySelector.css';
import type { CurrencySymbol } from '../context/MoneyContext';

const CurrencySelector: React.FC = () => {
    const { state, setCurrency } = useMoneyContext();

    const currencies: { symbol: CurrencySymbol; name: string }[] = [
        { symbol: '£', name: 'British Pound' },
        { symbol: '$', name: 'US Dollar' },
        { symbol: '€', name: 'Euro' },
        { symbol: '¥', name: 'Japanese Yen' }
    ];

    return (
        <div className="currency-selector">
            <h3>Select Currency</h3>
            <div className="currency-options">
                {currencies.map(currency => (
                    <button
                        key={currency.symbol}
                        className={state.currency === currency.symbol ? 'active' : ''}
                        onClick={() => setCurrency(currency.symbol)}
                        title={currency.name}
                    >
                        {currency.symbol}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CurrencySelector;