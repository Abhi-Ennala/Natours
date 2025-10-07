const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

// const user = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, id) => {
//   id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// }

const filterObj = (userObj, ...fields) => {
  const obj = {};
  Object.keys(userObj).forEach(el => {
    if (fields.includes(el)) {
      obj[el] = userObj[el];
    }
  });

  return obj;
};

exports.getAllusers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};

exports.updateMyData = async (req, res, next) => {
  console.log(req.body);
  if (req.body.password || req.body.confirmPassword) {
    console.log('here');
    return next(
      new AppError(
        'This is not path where you change your password, kindly remove password from your body'
      ),
      400
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
