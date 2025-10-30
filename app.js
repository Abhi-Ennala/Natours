const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const CookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
app.set('view engine', 'pug'); // Telling express which engine we are going to use.
app.set('views', path.join(__dirname, 'views')); // Define where the views are located

//Middlewares start

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Set security Http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': [
          "'self'",
          'https://api.mapbox.com',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js'
        ],
        'style-src': [
          "'self'",
          'https://api.mapbox.com',
          'https://fonts.googleapis.com'
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'worker-src': ["'self'", 'blob:'],
        'connect-src': [
          "'self'",
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js'
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https://api.mapbox.com',
          'https://events.mapbox.com'
        ]
      }
    }
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Suck my dick, you DOS attacker'
});
app.use('/api', limiter);

// Body parser, reading data from body to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(CookieParser());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('Time of Request: ', req.requestTime);
  // console.log(req.cookies);
  next();
});
// Middlewares end
//----------------------
// Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
