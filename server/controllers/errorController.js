const AppError = require('./../utils/appError');

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: 'error',
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // If the error is intentionally made - with AppError class
    if (err.isOperational)
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });

    // Programming or other unknown errors
    console.log(`🔥🔥🔥 Error:`, err);
    return res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleDuplicateFieldsError = (err, req, res) => {
  return new AppError(
    `Duplicate field value: ${
      err.keyValue.name || err.keyValue.image
    }. Please enter another value!`,
    err.statusCode
  );
};

const handleValidationError = (err, req, res) => {
  const errors = [];
  for (const error in err.errors) {
    errors.push(err.errors[error].message);
  }
  return new AppError(`Invalid data. ${errors.join(' ')}`, 400);
};

const handleCastError = (err, req, res) => {
  return new AppError(
    `Invalid ${err.path}: ${err.value}. Please try again!`,
    400
  );
};

const handleParseFailedError = (err, req, res) => {
  return new AppError(err.message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    let error;
    if (err.code === 11000) error = handleDuplicateFieldsError(err, req, res);
    if (err.name === 'ValidationError')
      error = handleValidationError(err, req, res);
    if (err.name === 'CastError') error = handleCastError(err, req, res);
    if (err.type === 'entity.parse.failed')
      error = handleParseFailedError(err, req, res);

    sendErrorProd(error || err, req, res);
  }
};
