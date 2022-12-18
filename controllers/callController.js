const catchAsync = require("../utils/catchAsync");
const Call = require("../schemas/call");

//GET ALL CALLS
exports.getAllCalls = catchAsync(async (req, res, next) => {
  let data = await Call.find().populate({
    path: "userId",
    select: "firstName lastName offerupNick",
  });

  data = JSON.parse(JSON.stringify(data));

  for (let d of data) {
    d.customerName = d.customerName;
    d.productName = d.productName;
    d.to = d.to;
    d.notes = d.notes;
    d.firstName = d.userId.firstName;
    d.lastName = d.userId.lastName;
    d.offerupNick = d.userId.offerupNick;
    delete d.userId;
    delete d.__v;
  }
  data = data.reverse()
  res.status(200).send({ status: "success", results: data.length, data });
});

//GET CALLS BY USER ID
exports.getCallsByUserId = catchAsync(async (req, res, next) => {
  console.log(req.params);
  let calls = await Call.find({ userId: req.params.userId });
  calls = JSON.parse(JSON.stringify(calls)).reverse();

  return res.status(200).send({ status: "success", data: calls });
});

//CREATE CALL
exports.createCall = catchAsync(async (req, res) => {
  const { customerName, salesmanNote, callerNote, phone, isCalled, userId } =
    req.body;

  const call = await Call.create({
    customerName,
    salesmanNote,
    callerNote,
    phone,
    isCalled,
    userId,
  });

  res.status(201).send({ status: "success", data: call });
});

//UPDATE CALL
exports.updateCallById = catchAsync(async (req, res, next) => {
  const callId = req.params.callId;
  const call = await Call.findOneAndUpdate(
    { _id: callId },
    { ...req.body },
    { upsert: true }
  );

  res.status(204).send({ status: "success", data: call });
});

exports.getCallById = catchAsync(async (req, res, next) => {
  let call = await Call.findOne({ _id: req.params.id });
  call = JSON.parse(JSON.stringify(call));

  return res.status(201).send({ status: "success", data: call });
});
