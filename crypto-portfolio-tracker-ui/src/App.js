// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const App = () => {
  const [coinData, setCoinData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [selectedGraphs, setSelectedGraphs] = useState(getSavedGraphs(selectedCoin));

  useEffect(() => {
    fetchData(selectedCoin);
    saveGraphs(selectedCoin, selectedGraphs);
  }, [selectedCoin]);

  const fetchData = async (coin) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=30`);
      const formattedData = response?.data?.map((item) => ({
        timestamp: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4]
      }));
      setCoinData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleCoinChange = (event) => {
    const coin = event.target.value;
    setSelectedCoin(coin);
    setSelectedGraphs(getSavedGraphs(coin));
  };

  const handleGraphToggle = (graph) => {
    setSelectedGraphs({ ...selectedGraphs, [graph]: !selectedGraphs[graph] });
    saveGraphs(selectedCoin, { ...selectedGraphs, [graph]: !selectedGraphs[graph] });
  };

  return (
    <div className="container">
      <h1>Cryptocurrency Price Charts</h1>
      <div className="controls">
        <label htmlFor="coin-select">Select a coin: </label>
        <select id="coin-select" onChange={handleCoinChange} value={selectedCoin}>
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
        </select>
        <div className="checkboxes">
          {Object.keys(selectedGraphs).map((graph) => (
            <label key={graph}>
              <input
                type="checkbox"
                checked={selectedGraphs[graph]}
                onChange={() => handleGraphToggle(graph)}
              />
              {graph.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={coinData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(selectedGraphs).map((graph) =>
              selectedGraphs[graph] && (
                <Line
                  type="monotone"
                  dataKey={graph}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  key={graph}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper function to save selected graphs to local storage
const saveGraphs = (coin, graphs) => {
  localStorage.setItem(coin, JSON.stringify(graphs));
};

// Helper function to get saved selected graphs from local storage
const getSavedGraphs = (coin) => {
  const savedGraphs = localStorage.getItem(coin);
  return savedGraphs ? JSON.parse(savedGraphs) : { open: true, high: true, low: true, close: true };
};

export default App;
