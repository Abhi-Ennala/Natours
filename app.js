const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Middlewares start
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});
// Middlewares end

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('*', function(req, res, next) {
 
  // next();
  // const err = new Error(`Can't find the ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // Whenever you provide an argument (which should be error btw) to the next(), it automatically skips all the middlewares in the stack and goes to the error handling middleware
  next(new AppError(`Can't find the ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
