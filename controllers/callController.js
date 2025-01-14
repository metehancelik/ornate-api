const catchAsync = require("../utils/catchAsync");
const Call = require("../schemas/call");
const User = require("../schemas/user");

// Create Call
exports.createCall = catchAsync(async (req, res) => {
  const { customerName, salesmanNote, callerNote, phone, isCalled } = req.body;
  let userId = req.userId;

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

  res.status(201).send({ status: "success", data });
});

// Get All Calls
exports.getAllCalls = catchAsync(async (req, res, next) => {
  let { offerupNick, firstName, customerName } = req.query;

  let page = req.query.page || 1;
  let limit = 30;
  let query =
    !offerupNick && !firstName && !customerName
      ? {}
      : {
          $and: [
            ...(offerupNick
              ? [
                  {
                    "user.offerupNick": {
                      $regex: ".*" + offerupNick + ".*",
                      $options: "i",
                    },
                  },
                ]
              : []),
            ...(firstName
              ? [
                  {
                    "user.firstName": {
                      $regex: ".*" + firstName + ".*",
                      $options: "i",
                    },
                  },
                ]
              : []),
            ...(customerName
              ? [
                  {
                    customerName: {
                      $regex: ".*" + customerName + ".*",
                      $options: "i",
                    },
                  },
                ]
              : []),
          ],
        };

  // Todo: check after isCalled property change (enum)
  if (req.query.isCalled) query = { ...query, isCalled: req.query.isCalled };

  let count = await Call.countDocuments(query);
  let data = await Call.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: "success", count, data });
});

// Get Calls By User ID
exports.getCallsByUserId = catchAsync(async (req, res) => {
  let { customerName } = req.query;
  let page = req.query.page || 1;
  let limit = 30;
  let query =
    !customerName
      ? {}
      : {
          $and: [
            ...(customerName
              ? [
                  {
                    customerName: {
                      $regex: ".*" + customerName + ".*",
                      $options: "i",
                    },
                  },
                ]
              : []),
          ],
        };

  // Todo: check after isCalled property change (enum)
  if (req.query.isCalled) query = { ...query, isCalled: req.query.isCalled };

  query = { ...query, "user.userId": req.userId };

  let count = await Call.countDocuments(query);
  let data = await Call.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  return res.status(200).send({ status: "success", count, data });
});

// Get Call By ID
exports.getCallById = catchAsync(async (req, res) => {
  let data = await Call.findById(req.params.id);

  return res.status(201).send({ status: "success", data });
});

// Update Call
exports.updateCallById = catchAsync(async (req, res) => {
  let data = await Call.findOneAndUpdate(
    { _id: req.params.callId },
    { ...req.body },
    { new: true, upsert: true }
  );

  res.status(204).send({ status: "success", data });
});

// Delete Inquiry
exports.deleteCallById = catchAsync(async (req, res) => {
  await Call.findByIdAndDelete({ _id: req.params.callId });

  return res.status(204).send({ status: "success" });
});
