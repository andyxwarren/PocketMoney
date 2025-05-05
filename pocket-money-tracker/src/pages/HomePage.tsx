import React from 'react';
import Header from '../components/Header';
import AddMoney from '../components/AddMoney';
import RemoveMoney from '../components/RemoveMoney';
import TransactionHistory from '../components/TransactionHistory';
import MoneyChart from '../components/MoneyChart';
import CurrencySelector from '../components/CurrencySelector';
import SavingsGoals from '../components/SavingsGoals';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <Header />

            <main className="main-content">
                <div className="settings-panel">
                    <CurrencySelector />
                </div>

                <div className="content-grid">
                    <div className="money-actions">
                        <AddMoney />
                        <RemoveMoney />
                    </div>

                    <div className="money-visuals">
                        <MoneyChart />
                    </div>

                    <div className="savings-section">
                        <SavingsGoals />
                    </div>

                    <div className="history-section">
                        <TransactionHistory />
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>Pocket Money Tracker - Making saving fun for kids!</p>
                <div className="footer-images">
                    <img src="/images/coins.svg" alt="Coins" />
                    <img src="/images/piggy-bank-small.svg" alt="Piggy Bank" />
                    <img src="/images/money-plant.svg" alt="Money Plant" />
                </div>
            </footer>
        </div>
    );
};

export default HomePage;