const bcrypt = require('bcryptjs');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../schemas/user');

// Get All Users
exports.getAllUsers = catchAsync(async (req, res) => {
  let queryParam = req.query.q;
  let page = req.query.page || 1;
  let limit = 10;
  let query =
    queryParam == undefined
      ? {}
      : {
        $or: [
          {
            offerupNick: {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
          {
            firstName: {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
          {
            lastName: {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
        ],
      };

  let count = await User.countDocuments(query);

  let data = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: 'success', count, data });
});

// Get User By ID
exports.getUserById = catchAsync(async (req, res) => {
  const data = await User.findById(req.params.userId);

  res.status(200).send({ status: 'success', data });
});

// Get Me
exports.getMe = catchAsync(async (req, res) => {
  const data = await User.findById(req.userId).select({
    password: 0,
    _id: 0,
    role: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  });
  res.status(200).send({ status: 'success', data });
});

// Update User Info
exports.updateUserProfile = catchAsync(async (req, res) => {
  const data = await User.findOneAndUpdate(
    { _id: req.params.userId },
    { ...req.body },
    { upsert: true }
  );

  res.status(204).send({ status: 'success' });
});

// Update My Profile
exports.updateMyProfile = catchAsync(async (req, res) => {
  const { offerupNick, firstName, lastName, billingInfo } = req.body
  await User.findOneAndUpdate(
    { _id: req.userId },
    { offerupNick, firstName, lastName, billingInfo }
  );

  res.status(204).send({ status: 'success' });
});

// Update User Password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, password, passwordConfirm } = req.body;

  // check if old password exists and is correct
  if (!oldPassword) {
    return next(new AppError(400, 'Current password must be provided!'));
  }
  const user = await User.findById(req.userId).select({ password: 1 });

  var passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
  if (!passwordIsValid) {
    return next(new AppError(400, 'Current password is incorrect!'));
  }
  // check if password and passwordConfirm match
  if (password !== passwordConfirm) {
    return next(new AppError(400, 'Passwords do not match!'));
  }
  // update password
  await User.findOneAndUpdate({ _id: req.userId },
    {
      password: bcrypt.hashSync(
        password,
        Number(process.env.PASSWORD_HASH_CYCLE)
      ),
    }
  );
  // send success message to client
  res.status(200).send({
    status: 'success',
    data: 'Password updated successfully!',
  });
});
