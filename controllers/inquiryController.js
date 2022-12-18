const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Inquiry = require("../schemas/inquiry");

exports.getAllInquiries = catchAsync(async (req, res, next) => {
  let data = await Inquiry.find().populate({
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

//GET INQUIRIES BY USER ID
exports.getInquiriesByUserId = catchAsync(async (req, res, next) => {
  let data = await Inquiry.find({ userId: req.params.userId });

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

//CREATE INQUIRY
exports.createInquiry = catchAsync(async (req, res) => {
  const { customerName, productName, to, notes, region, userId } = req.body;

  const inquiry = await Inquiry.create({
    customerName,
    productName,
    to,
    notes,
    region,
    userId,
  });

  res.status(201).send({ status: "success", data: inquiry });
});

//UPDATE INQUIRY
exports.updateInquiryById = catchAsync(async (req, res, next) => {
  const inquiryId = req.params.inquiryId;
  const inquiry = await Inquiry.findOneAndUpdate(
    { _id: inquiryId },
    { ...req.body },
    { upsert: true }
  );

  res.status(200).send({ status: "success", data: inquiry });
});

exports.getInquiryById = catchAsync(async (req, res, next) => {
  console.log("params", req.params);
  let inquiry = await Inquiry.findOne({ _id: req.params.id });
  inquiry = JSON.parse(JSON.stringify(inquiry));

  return res.status(201).send({ status: "success", data: inquiry });
});
