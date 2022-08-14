const express = require('express');
const app = express();
const { PORT } = require('./config');

const itemRouter = require('./routes/itemsRoutes');

app.get('/', (req, res) => {
  res.send('Hello world!');
});

// API routes
app.use('/api/v1/items', itemRouter);

// TODO: add error handler

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
