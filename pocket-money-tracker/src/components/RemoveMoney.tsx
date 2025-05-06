import React, { useState } from 'react';
import { useMoneyContext } from '../context/useMoneyContext';
import '../styles/RemoveMoney.css';

const RemoveMoney: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const { state, removeMoney } = useMoneyContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate input
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!description.trim()) {
            setError('Please enter a description');
            return;
        }

        // Check if there's enough balance
        if (Number(amount) > state.balance) {
            setError('Not enough money in your piggy bank!');
            return;
        }

        // Remove money
        removeMoney(Number(amount), description);

        // Reset form
        setAmount('');
        setDescription('');
        setError('');

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="remove-money-container">
            <h2>Spend Money</h2>

            {showSuccess && (
                <div className="success-message">
                    <img src="/images/shopping.svg" alt="Shopping" />
                    <p>Money spent successfully!</p>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="remove-amount">Amount ({state.currency})</label>
                    <input
                        type="number"
                        id="remove-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10.00"
                        step="0.01"
                        min="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="remove-description">What did you buy?</label>
                    <input
                        type="text"
                        id="remove-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Toy, Book, Game"
                    />
                </div>

                <button
                    type="submit"
                    className="spend-button"
                    disabled={state.balance <= 0}
                >
                    <span>Spend Money</span>
                    <img src="/images/shopping-cart.svg" alt="Shopping Cart" />
                </button>
            </form>

            {state.balance <= 0 && (
                <div className="empty-balance-message">
                    <p>Your piggy bank is empty! Add some money first.</p>
                    <img src="/images/empty-piggy.svg" alt="Empty Piggy Bank" />
                </div>
            )}
        </div>
    );
};

export default RemoveMoney;