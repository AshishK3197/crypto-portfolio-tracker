const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/v3/coins/:id/price-chart', (req, res) => {
  const url = `https://api.coingecko.com/api/v3/coins/${req.params.id}/ohlc?vs_currency=usd&days=30`;
  
  console.log("called");
  axios.get(url, {
    params: req.query,
    headers: {
      'X-CoinAPI-Key': 'CG-HvbLxHKBi2emUj1vwhHBXdx7'
    }
  })
  .then(response => {
    res.json(response.data);
  })
  .catch(error => {
    res.send(error.message);
  });
});

app.listen(3001, () => console.log('Proxy server running on port 3001'));
