const catchAsync = require('../utils/catchAsync');
const Inquiry = require('../schemas/inquiry');
const User = require('../schemas/user');

// Create Inquiry
exports.createInquiry = catchAsync(async (req, res) => {
  const { customerName, productName, to, notes, region, userId } = req.body;

  const { firstName, lastName, offerupNick, _id } = await User.findById(
    userId
  ).select({
    firstName: 1,
    lastName: 1,
    offerupNick: 1,
  });

  const data = await Inquiry.create({
    customerName,
    productName,
    to,
    notes,
    region,
    user: {
      offerupNick,
      firstName,
      lastName,
      userId: _id.toString(),
    },
  });

  res.status(201).send({ status: 'success', data });
});

// Get All Inquiries
exports.getAllInquiries = catchAsync(async (req, res) => {
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
            customerName: { $regex: '.*' + queryParam + '.*', $options: 'i' },
          },
          {
            productName: { $regex: '.*' + queryParam + '.*', $options: 'i' },
          },
        ],
      };

  let count = await Inquiry.countDocuments(query);
  let data = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: 'success', count, data });
});

// Get Inquiries By User ID
exports.getInquiriesByUserId = catchAsync(async (req, res) => {
  let page = req.query.page || 1;
  let limit = 30;

  let count = await Inquiry.countDocuments({
    'user.userId': req.params.userId,
  });

  let data = await Inquiry.find({ 'user.userId': req.params.userId })
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: 'success', count, data });
});

// Get Inquiry By ID
exports.getInquiryById = catchAsync(async (req, res) => {
  let data = await Inquiry.findById(req.params.id);

  return res.status(201).send({ status: 'success', data });
});

// Update Inquiry
exports.updateInquiryById = catchAsync(async (req, res) => {
  let data = await Inquiry.findOneAndUpdate(
    { _id: req.params.inquiryId },
    { ...req.body },
    { new: true, upsert: true }
  );

  res.status(200).send({ status: 'success', data });
});

// Delete Inquiry
exports.deleteInquiryById = catchAsync(async (req, res) => {
  await Inquiry.findByIdAndDelete({ _id: req.params.inquiryId });

  return res.status(204).send({ status: 'success' });
});
