"use client"

import { useState } from 'react';

export default function Budget() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([{ category: '', amount: '' }]);
  const [result, setResult] = useState(null);

  const addExpense = () => {
    setExpenses([...expenses, { category: '', amount: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/budget-management', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income, expenses }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Budget Management</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Income:</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <div>
          <h3>Expenses:</h3>
          {expenses.map((expense, index) => (
            <div key={index}>
              <select
                value={expense.category}
                onChange={(e) =>
                  setExpenses(
                    expenses.map((ex, i) =>
                      i === index ? { ...ex, category: e.target.value } : ex
                    )
                  )
                }
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transport">Transport</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) =>
                  setExpenses(
                    expenses.map((ex, i) =>
                      i === index ? { ...ex, amount: e.target.value } : ex
                    )
                  )
                }
              />
            </div>
          ))}
          <button type="button" onClick={addExpense}>
            Add Expense
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>

      {result && (
        <div>
          <h2>Analysis</h2>
          <p>{result.analysis}</p>
          <h2>Recommendations</h2>
          <p>{result.recommendations}</p>
        </div>
      )}
    </div>
  );
}
