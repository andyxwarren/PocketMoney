import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AddMoney from '../components/AddMoney';
import RemoveMoney from '../components/RemoveMoney';
import TransactionHistory from '../components/TransactionHistory';
import MoneyChart from '../components/MoneyChart';
import CurrencySelector from '../components/CurrencySelector';
import SavingsGoals from '../components/SavingsGoals';
import GamifiedUI from '../components/gamification/GamifiedUI';
import Celebration from '../components/gamification/Celebration';
import { useMoneyContext } from '../context/useMoneyContext';
import CustomSidebarLayout from '../components/CustomSidebarLayout';
import CustomSidebar from '../components/CustomSidebar';
import CustomSidebarContent from '../components/CustomSidebarContent';
import '../styles/HomePage.css';
import '../styles/animations.css';

const HomePage: React.FC = () => {
    const { state } = useMoneyContext();
    const [showCoinAnimation, setShowCoinAnimation] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    
    // Track when money is added for coin animation
    useEffect(() => {
        const handleTransactionAdded = () => {
            // Check if the latest transaction is an 'income' type
            if (state.transactions.length > 0 && state.transactions[0].type === 'income') {
                setShowCoinAnimation(true);
                
                // Hide animation after it plays
                setTimeout(() => {
                    setShowCoinAnimation(false);
                }, 3000);
            }
        };
        
        handleTransactionAdded();
        // Using both transactions array and length as dependencies
    }, [state.transactions, state.transactions.length]);
    
    const handleNavClick = (section: string) => {
        setActiveSection(section);
    };
    
    return (
        <CustomSidebarLayout>
            <CustomSidebar>
                <nav className="sidebar-nav">
                    <a 
                        href="#" 
                        className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavClick('dashboard')}
                    >
                        <img src="/images/home.svg" alt="Dashboard" className="nav-icon" />
                        My Dashboard
                    </a>
                    <a 
                        href="#" 
                        className={`nav-item ${activeSection === 'money' ? 'active' : ''}`}
                        onClick={() => handleNavClick('money')}
                    >
                        <img src="/images/coins.svg" alt="Money" className="nav-icon" />
                        Add/Spend Money
                    </a>
                    <a 
                        href="#" 
                        className={`nav-item ${activeSection === 'savings' ? 'active' : ''}`}
                        onClick={() => handleNavClick('savings')}
                    >
                        <img src="/images/piggy-bank-small.svg" alt="Savings" className="nav-icon" />
                        My Savings Goals
                    </a>
                    <a 
                        href="#" 
                        className={`nav-item ${activeSection === 'history' ? 'active' : ''}`}
                        onClick={() => handleNavClick('history')}
                    >
                        <img src="/images/history.svg" alt="History" className="nav-icon" />
                        Money History
                    </a>
                    <a 
                        href="#" 
                        className={`nav-item ${activeSection === 'rewards' ? 'active' : ''}`}
                        onClick={() => handleNavClick('rewards')}
                    >
                        <img src="/images/star.svg" alt="Rewards" className="nav-icon" />
                        My Rewards
                    </a>
                </nav>
                
                <div className="sidebar-footer">
                    <CurrencySelector />
                </div>
            </CustomSidebar>
            
            <CustomSidebarContent>
                <div className="home-page">
                    <Header />

                    <main className="main-content">
                        {activeSection === 'dashboard' && (
                            <div className="dashboard-section">
                                <h2 className="section-title">My Money Dashboard</h2>
                                <div className="dashboard-grid">
                                    <div className="money-visuals">
                                        <MoneyChart />
                                    </div>
                                    <div className="gamify-container">
                                        <GamifiedUI />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeSection === 'money' && (
                            <div className="money-section">
                                <h2 className="section-title">Add or Spend Money</h2>
                                <div className="money-actions-container">
                                    <div className="money-action-card">
                                        <h3>Add Money</h3>
                                        <AddMoney />
                                    </div>
                                    <div className="money-action-card">
                                        <h3>Spend Money</h3>
                                        <RemoveMoney />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeSection === 'savings' && (
                            <div className="savings-container">
                                <h2 className="section-title">My Savings Goals</h2>
                                <div className="savings-content">
                                    <SavingsGoals />
                                </div>
                            </div>
                        )}
                        
                        {activeSection === 'history' && (
                            <div className="history-container">
                                <h2 className="section-title">My Money History</h2>
                                <div className="history-content">
                                    <TransactionHistory />
                                </div>
                            </div>
                        )}
                        
                        {activeSection === 'rewards' && (
                            <div className="rewards-container">
                                <h2 className="section-title">My Rewards</h2>
                                <div className="rewards-content">
                                    <GamifiedUI showRewardsOnly={true} />
                                </div>
                            </div>
                        )}
                    </main>

                    <footer className="footer">
                        <p>Pocket Money Tracker - Making saving fun for kids!</p>
                        <div className="footer-images">
                            <img src="/images/coins.svg" alt="Coins" />
                            <img src="/images/piggy-bank-small.svg" alt="Piggy Bank" />
                            <img src="/images/money-plant.svg" alt="Money Plant" />
                        </div>
                    </footer>
                    
                    {/* Coin animation when money is added */}
                    {showCoinAnimation && (
                        <Celebration 
                            show={true}
                            message="Money Added!"
                            type="coins"
                            onComplete={() => setShowCoinAnimation(false)}
                            duration={3000}
                        />
                    )}
                </div>
            </CustomSidebarContent>
        </CustomSidebarLayout>
    );
};

export default HomePage;