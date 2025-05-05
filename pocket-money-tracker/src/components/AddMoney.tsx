import React, { useState } from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import '../styles/AddMoney.css';

const AddMoney: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const { state, addMoney } = useMoneyContext();

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

        // Add money
        addMoney(Number(amount), description);

        // Reset form
        setAmount('');
        setDescription('');
        setError('');

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="add-money-container">
            <h2>Add Money</h2>

            {showSuccess && (
                <div className="success-message">
                    <img src="/images/success.svg" alt="Success" />
                    <p>Money added successfully!</p>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Amount ({state.currency})</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="5.00"
                        step="0.01"
                        min="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Pocket money, Birthday gift"
                    />
                </div>

                <button type="submit" className="add-button">
                    <span>Add Money</span>
                    <img src="/images/coin.svg" alt="Coin" />
                </button>
            </form>
        </div>
    );
};

export default AddMoney;