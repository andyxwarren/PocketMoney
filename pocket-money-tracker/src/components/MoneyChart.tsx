import React, { useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useMoneyContext } from '../context/MoneyContext';
import '../styles/MoneyChart.css';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

const MoneyChart: React.FC = () => {
    const { state } = useMoneyContext();
    const [chartType, setChartType] = useState<'doughnut' | 'line'>('doughnut');

    // Prepare data for the doughnut chart
    const doughnutData = {
        labels: ['Money Saved', 'Money Spent'],
        datasets: [
            {
                data: [state.balance, state.totalSpent],
                backgroundColor: ['#4CAF50', '#FF5252'],
                borderColor: ['#388E3C', '#D32F2F'],
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for the line chart - balance history
    const getLineChartData = () => {
        // Get last 10 transactions in chronological order
        const transactions = [...state.transactions].slice(0, 10).reverse();

        // Calculate running balance for each transaction
        let runningBalance = state.balance;
        const balanceHistory = transactions.map(t => {
            if (t.type === 'remove') {
                runningBalance += t.amount;
            } else {
                runningBalance -= t.amount;
            }
            return runningBalance;
        }).reverse();

        // Add current balance to the end
        balanceHistory.push(state.balance);

        // Create labels (dates or transaction numbers)
        const labels = transactions.map((t, index) =>
            `Tx ${transactions.length - index}`
        );
        labels.push('Current');

        return {
            labels,
            datasets: [
                {
                    label: `Balance (${state.currency})`,
                    data: balanceHistory,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#388E3C',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    };

    const lineData = getLineChartData();

    // Options for the line chart
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Balance History',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `Amount (${state.currency})`,
                }
            }
        }
    };

    // Options for the doughnut chart
    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Money Saved vs Spent',
            },
        },
    };

    // Check if there's data to display
    const hasData = state.balance > 0 || state.totalSpent > 0;
    const hasTransactions = state.transactions.length > 0;

    return (
        <div className="money-chart-container">
            <h2>Money Tracker</h2>

            {!hasData && (
                <div className="empty-chart">
                    <img src="/images/chart-placeholder.svg" alt="Empty Chart" />
                    <p>Add some money to see your charts!</p>
                </div>
            )}

            {hasData && (
                <>
                    <div className="chart-type-selector">
                        <button
                            className={chartType === 'doughnut' ? 'active' : ''}
                            onClick={() => setChartType('doughnut')}
                        >
                            Pie Chart
                        </button>
                        <button
                            className={chartType === 'line' ? 'active' : ''}
                            onClick={() => setChartType('line')}
                            disabled={!hasTransactions}
                        >
                            Line Chart
                        </button>
                    </div>

                    <div className="chart-container">
                        {chartType === 'doughnut' ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            hasTransactions ? (
                                <Line data={lineData} options={lineOptions} />
                            ) : (
                                <div className="empty-chart">
                                    <p>No transactions to display in line chart</p>
                                </div>
                            )
                        )}
                    </div>

                    <div className="chart-summary">
                        <div className="summary-item">
                            <div className="color-box saved"></div>
                            <span>Saved: {state.currency}{state.balance.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                            <div className="color-box spent"></div>
                            <span>Spent: {state.currency}{state.totalSpent.toFixed(2)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MoneyChart;