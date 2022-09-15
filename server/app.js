const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config({
  path: './config.env',
});
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const itemRouter = require('./routes/itemsRoutes');
const orderRouter = require('./routes/ordersRoutes');
const viewRouter = require('./routes/viewsRoutes');

// Enable all cors reqs
app.use(cors());

// Setting up the views
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// Parses incoming requests - information will be on req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    // Allowed filter duplicates
    whitelist: ['price', 'defaultQuantity'],
  })
);

// Security HTTP headers
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 100, // Limit each IP to 100 requests per `window` ,
  message: 'Too many request from this IP, please try again in 30 mins!', // Error message
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

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

// Serve static files
app.use(express.static(`${__dirname}/public`));

// API routes
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/orders', orderRouter);

// Website routes
app.use('/', viewRouter);

// Run for all methods - url not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}.`, 404));
});

// Error handler
app.use(errorController);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT} ✅`);
});
