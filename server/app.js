const express = require('express');
const app = express();
const { PORT } = require('./config');

app.get('/', (req, res) => {
  res.send('Hello world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
