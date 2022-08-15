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
  // TODO: Rendered website
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
    return res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  // TODO: Rendered website
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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    let error;
    if (err.code === 11000) error = handleDuplicateFieldsError(err, req, res);
    if (err.name === 'ValidationError')
      error = handleValidationError(err, req, res);
    sendErrorProd(error || err, req, res);
  }
};
