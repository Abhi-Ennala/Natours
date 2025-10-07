const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_RECIPE, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)Check if the email and password exists in the body
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //2)Find the user from the database using the email and password. We need to explicity select the password because we set the password visility(select) to false in the userModel. Here we get the whole user document
  const user = await User.findOne({ email }).select('+password');
  // console.log(user);
  //3)If everything is ok, send token to the client
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting the token and check if it's present
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to access', 401)
    );
  }
  //2)Verifying token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_RECIPE
  );
  //3)Check if the user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token doesn not exist!', 401)
    );
  }
  //4)Check if user changed password after the token was issued
  // console.log(decoded.iat);
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The user password has been changed. Please login again',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});
