const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Inquiry = require('../schemas/inquiry');
const User = require('../schemas/user');

exports.getInquiryCount = catchAsync(async (req, res) => {
  let data =
    req.query.q === undefined
      ? await Inquiry.countDocuments()
      : await Inquiry.countDocuments({
        $or: [
          { offerupNick: { $regex: '.*' + req.query.q + '.*' } },
          { customerName: { $regex: '.*' + req.query.q + '.*' } },
          { productName: { $regex: '.*' + req.query.q + '.*' } },
        ],
      });
  res.status(200).send({ status: 'success', results: data });
});

exports.getAllInquiries = catchAsync(async (req, res, next) => {
  let limit = 10;
  let query =
    req.query.q === undefined
      ? {}
      : {
        $or: [
          { offerupNick: { $regex: '.*' + req.query.q + '.*' } },
          { customerName: { $regex: '.*' + req.query.q + '.*' } },
          { productName: { $regex: '.*' + req.query.q + '.*' } },
        ],
      };

  let data = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (req.query.page - 1))
    .limit(limit);

  res.status(200).send({ status: 'success', data });
});

//GET INQUIRIES BY USER ID
exports.getInquiriesByUserId = catchAsync(async (req, res, next) => {
  let data = await Inquiry.find({ userId: req.params.userId });

  data = JSON.parse(JSON.stringify(data)).reverse();
  res.status(200).send({ status: 'success', results: data.length, data });
});

//CREATE INQUIRY
exports.createInquiry = catchAsync(async (req, res) => {
  const { customerName, productName, to, notes, region, userId } = req.body;

  const user = await User.findById(userId);
  const inquiry = await Inquiry.create({
    customerName,
    productName,
    to,
    notes,
    region,
    offerupNick: user.offerupNick,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  res.status(201).send({ status: 'success', data: inquiry });
});

//UPDATE INQUIRY
exports.updateInquiryById = catchAsync(async (req, res, next) => {
  const inquiryId = req.params.inquiryId;
  const inquiry = await Inquiry.findOneAndUpdate(
    { _id: inquiryId },
    { ...req.body },
    { upsert: true }
  );

  res.status(200).send({ status: 'success', data: inquiry });
});

exports.getInquiryById = catchAsync(async (req, res, next) => {
  console.log('params', req.params);
  let inquiry = await Inquiry.findOne({ _id: req.params.id });
  inquiry = JSON.parse(JSON.stringify(inquiry));

  return res.status(201).send({ status: 'success', data: inquiry });
});
