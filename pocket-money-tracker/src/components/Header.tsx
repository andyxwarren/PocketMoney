import React from 'react';
import { useMoneyContext } from '../context/useMoneyContext';
import '../styles/Header.css';

const Header: React.FC = () => {
    const { state } = useMoneyContext();

    return (
        <header className="header">
            <div className="logo">
                <h1>Pocket Money Tracker</h1>
                <img src="/images/piggy-bank.svg" alt="Piggy Bank" className="logo-image" />
            </div>
            <div className="balance-container">
                <h2>Current Balance</h2>
                <div className="balance">£{state.balance.toFixed(2)}</div>
            </div>
        </header>
    );
};

export default Header;