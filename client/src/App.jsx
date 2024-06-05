import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('credit');
  const [showTransactions, setShowTransactions] = useState(false); // State to track if transactions should be shown

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://0.0.0.0:3000/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addTransaction = async () => {
    if (!amount || !description) {
      alert('Please enter valid amount and description.');
      return;
    }

    try {
      await axios.post('http://0.0.0.0:3000/transactions', {
        amount: parseFloat(amount),
        description: description.trim(),
        debit: type === 'debit'
      });
      setAmount('');
      setDescription('');
      fetchTransactions(); // Refresh transactions after adding a new one
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://0.0.0.0:3000/transactions/${id}`);
      fetchTransactions(); // Refresh transactions after deleting one
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

  const balance = transactions.reduce((total, transaction) => {
    return transaction.debit ? total - transaction.amount : total + transaction.amount;
  }, 0);

  return (
    <div>
      <h1>Expense Tracker</h1>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="type">Type:</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <button onClick={addTransaction}>Add Transaction</button>
        <button onClick={() => setShowTransactions(!showTransactions)}>
          {showTransactions ? 'Hide Transactions' : 'Show Transactions'}
        </button>
      </div>
      {showTransactions && (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction._id}>
              {transaction.description} - {transaction.debit ? '-' : '+'} ₹{transaction.amount.toFixed(2)}
              <button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <p>Balance: ₹{balance.toFixed(2)}</p>
    </div>
  );
}

export default ExpenseTracker;
