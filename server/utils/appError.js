class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // helps to know if it's an error intentionally made or not

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
