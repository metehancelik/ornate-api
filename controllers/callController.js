const catchAsync = require('../utils/catchAsync');
const Call = require('../schemas/call');
const User = require('../schemas/user');

// Create Call
exports.createCall = catchAsync(async (req, res) => {
  const { customerName, salesmanNote, callerNote, phone, isCalled, userId } =
    req.body;

  const { firstName, lastName, offerupNick, _id } = await User.findById(
    userId
  ).select({
    firstName: 1,
    lastName: 1,
    offerupNick: 1,
  });

  const data = await Call.create({
    customerName,
    salesmanNote,
    callerNote,
    phone,
    isCalled,
    user: {
      offerupNick,
      firstName,
      lastName,
      userId: _id.toString(),
    },
  });

  res.status(201).send({ status: 'success', data });
});

// Get All Calls
exports.getAllCalls = catchAsync(async (req, res, next) => {
  let queryParam = req.query.q;
  let page = req.query.page || 1;
  let limit = 30;
  let query =
    queryParam === undefined
      ? {}
      : {
        $or: [
          {
            'user.offerupNick': {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
          {
            customerName: {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
        ],
      };
  if (req.query.isCalled) {
    let isCall = req.query.isCalled === 'true' ? true : false;
    query = { ...query, isCalled: isCall };
  }

  let count = await Call.countDocuments(query);
  let data = await Call.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: 'success', count, data });
});

// Get Calls By User ID
exports.getCallsByUserId = catchAsync(async (req, res) => {
  let queryParam = req.query.q;
  let page = req.query.page || 1;
  let limit = 30;
  let query =
    queryParam === undefined
      ? {}
      : {
        $or: [
          {
            'user.offerupNick': {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
          {
            customerName: {
              $regex: '.*' + queryParam + '.*',
              $options: 'i',
            },
          },
        ],
      };
  if (req.query.isCalled) {
    let isCall = req.query.isCalled === 'true' ? true : false;
    query = { ...query, isCalled: isCall };
  }
  query = { ...query, 'user.userId': req.userId };

  let count = await Call.countDocuments(query);
  let data = await Call.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  return res.status(200).send({ status: 'success', count, data });
});

// Get Call By ID
exports.getCallById = catchAsync(async (req, res) => {
  let data = await Call.findById(req.params.id);

  return res.status(201).send({ status: 'success', data });
});

// Update Call
exports.updateCallById = catchAsync(async (req, res) => {
  let data = await Call.findOneAndUpdate(
    { _id: req.params.callId },
    { ...req.body },
    { new: true, upsert: true }
  );

  res.status(204).send({ status: 'success', data });
});

// Delete Inquiry
exports.deleteCallById = catchAsync(async (req, res) => {
  await Call.findByIdAndDelete({ _id: req.params.callId });

  return res.status(204).send({ status: 'success' });
});
