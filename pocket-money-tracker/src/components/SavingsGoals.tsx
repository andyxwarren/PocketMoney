import React, { useState } from 'react';
import { useMoneyContext } from '../context/useMoneyContext';
import '../styles/SavingsGoals.css';

const SavingsGoals: React.FC = () => {
    const { state, addSavingsGoal, contributeToGoal, removeSavingsGoal } = useMoneyContext();
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [contributionAmount, setContributionAmount] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();

        if (!goalName.trim()) {
            setError('Please enter a goal name');
            return;
        }

        const amount = parseFloat(goalAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        addSavingsGoal(goalName, amount);
        setGoalName('');
        setGoalAmount('');
        setError('');
    };

    const handleContribute = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedGoalId) {
            setError('Please select a goal');
            return;
        }

        const amount = parseFloat(contributionAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (amount > state.balance) {
            setError('Not enough money in your balance');
            return;
        }

        contributeToGoal(selectedGoalId, amount);
        setContributionAmount('');
        setSelectedGoalId(null);
        setError('');
    };

    const calculateProgress = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    return (
        <div className="savings-goals-container">
            <h2>Savings Goals</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="add-goal-form">
                <h3>Add New Goal</h3>
                <form onSubmit={handleAddGoal}>
                    <div className="form-group">
                        <label htmlFor="goal-name">Goal Name</label>
                        <input
                            type="text"
                            id="goal-name"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            placeholder="e.g., Toy Car, Video Game"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="goal-amount">Target Amount ({state.currency})</label>
                        <input
                            type="number"
                            id="goal-amount"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            placeholder="20.00"
                            step="0.01"
                            min="0.01"
                        />
                    </div>

                    <button type="submit" className="add-goal-button">
                        Add Goal
                    </button>
                </form>
            </div>

            {state.savingsGoals?.length > 0 ? (
                <>
                    <div className="goals-list">
                        <h3>Your Goals</h3>
                        {state.savingsGoals?.map((goal) => (
                            <div
                                key={goal.id}
                                className={`goal-item ${goal.completed ? 'completed' : ''}`}
                            >
                                <div className="goal-info">
                                    <h4>{goal.name}</h4>
                                    <div className="goal-progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                                        ></div>
                                    </div>
                                    <div className="goal-amounts">
                                        <span>
                                            {state.currency}{goal.currentAmount.toFixed(2)} / {state.currency}{goal.targetAmount.toFixed(2)}
                                        </span>
                                        <span className="goal-percentage">
                                            {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="goal-actions">
                                    {!goal.completed && (
                                        <button
                                            className="select-goal-button"
                                            onClick={() => setSelectedGoalId(goal.id)}
                                        >
                                            Select
                                        </button>
                                    )}
                                    <button
                                        className="remove-goal-button"
                                        onClick={() => removeSavingsGoal(goal.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {state.balance > 0 && (
                        <div className="contribute-form">
                            <h3>Contribute to Goal</h3>
                            <form onSubmit={handleContribute}>
                                <div className="form-group">
                                    <label htmlFor="contribution-amount">Amount ({state.currency})</label>
                                    <input
                                        type="number"
                                        id="contribution-amount"
                                        value={contributionAmount}
                                        onChange={(e) => setContributionAmount(e.target.value)}
                                        placeholder="5.00"
                                        step="0.01"
                                        min="0.01"
                                        max={state.balance}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="contribute-button"
                                    disabled={!selectedGoalId}
                                >
                                    {selectedGoalId
                                        ? `Contribute to ${state.savingsGoals?.find(g => g.id === selectedGoalId)?.name}`
                                        : 'Select a goal first'}
                                </button>
                            </form>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-goals">
                    <p>You don't have any savings goals yet. Add one to start saving!</p>
                </div>
            )}
        </div>
    );
};

export default SavingsGoals;