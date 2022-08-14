const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config({
  path: './config.env',
});

const itemRouter = require('./routes/itemsRoutes');

// Connecting to DB
mongoose
  .connect(process.env.DB.replace('<password>', process.env.DB_PASS))
  .then(() => {
    console.log('Connection to DB has been established! ✅');
  })
  .catch((err) => {
    console.log('Connection to DB has failed ❌❌❌');
    console.log(err);
  });

// API routes
app.use('/api/v1/items', itemRouter);

// TODO: add error handler

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT} ✅`);
});
