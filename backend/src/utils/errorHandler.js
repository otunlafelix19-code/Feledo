class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid JSON Web Token';
    err = new AppError(message, 400);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired';
    err = new AppError(message, 400);
  }

  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    error: err.name || 'ERROR'
  });
};

module.exports = { AppError, errorHandler };
