export const errorHandler = (error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
    // stack: process.env.NODE_ENV === 'development'? error.stack : null
  });
};
