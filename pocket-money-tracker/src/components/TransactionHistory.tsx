import React, { useState } from 'react';
import { useMoneyContext } from '../context/useMoneyContext';
import '../styles/TransactionHistory.css';

const TransactionHistory: React.FC = () => {
    const { state } = useMoneyContext();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [showCount, setShowCount] = useState<number>(10);

    // Format date to be more readable
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Filter transactions based on selected filter
    const filteredTransactions = state.transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    }).slice(0, showCount);

    return (
        <div className="transaction-history-container">
            <h2>Transaction History</h2>

            {state.transactions.length === 0 ? (
                <div className="empty-transactions">
                    <img src="/images/empty-list.svg" alt="Empty List" />
                    <p>No transactions yet. Start by adding some money!</p>
                </div>
            ) : (
                <>
                    <div className="transaction-filters">
                        <button
                            className={filter === 'all' ? 'active' : ''}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={filter === 'income' ? 'active' : ''}
                            onClick={() => setFilter('income')}
                        >
                            Money In
                        </button>
                        <button
                            className={filter === 'expense' ? 'active' : ''}
                            onClick={() => setFilter('expense')}
                        >
                            Money Out
                        </button>
                    </div>

                    <div className="transactions-list">
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className={`transaction-item ${transaction.type === 'income' ? 'add' : 'remove'}`}
                            >
                                <div className="transaction-icon">
                                    {transaction.type === 'income' ? (
                                        <img src="/images/money-in.svg" alt="Money In" />
                                    ) : (
                                        <img src="/images/money-out.svg" alt="Money Out" />
                                    )}
                                </div>

                                <div className="transaction-details">
                                    <div className="transaction-description">{transaction.description}</div>
                                    <div className="transaction-date">{formatDate(transaction.date)}</div>
                                </div>

                                <div className="transaction-amount">
                                    {transaction.type === 'income' ? '+' : '-'}{state.currency}{transaction.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {state.transactions.length > showCount && (
                        <button
                            className="load-more-button"
                            onClick={() => setShowCount(prev => prev + 10)}
                        >
                            Load More
                        </button>
                    )}
                </>
            )}

            <div className="transaction-summary">
                <div className="summary-item">
                    <span>Total Added:</span>
                    <span className="total-added">{state.currency}{state.totalAdded.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Total Spent:</span>
                    <span className="total-spent">{state.currency}{state.totalSpent.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Current Balance:</span>
                    <span className="current-balance">{state.currency}{state.balance.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;