const catchAsync = require("../utils/catchAsync");
const Inquiry = require("../schemas/inquiry");
const User = require("../schemas/user");

// Create Inquiry
exports.createInquiry = catchAsync(async (req, res) => {
  const { customerName, productName, to, notes, region } = req.body;
  let userId = req.userId;
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

  res.status(201).send({ status: "success", data });
});

// Get All Inquiries
exports.getAllInquiries = catchAsync(async (req, res) => {
  let { offerupNick, firstName, customerName, productName } = req.query;

  let page = req.query.page || 1;
  let limit = 30;
  let query =
    !offerupNick && !firstName && !customerName && !productName
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
            ...(productName
              ? [
                  {
                    productName: {
                      $regex: ".*" + productName + ".*",
                      $options: "i",
                    },
                  },
                ]
              : []),
          ],
        };

  let count = await Inquiry.countDocuments(query);
  let data = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: "success", count, data });
});

// Get Inquiries By User ID
exports.getInquiriesByUserId = catchAsync(async (req, res) => {
  let { customerName, productName } = req.query;
  let page = req.query.page || 1;
  let limit = 30;
  let query =
    !customerName && !productName
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
            ...(productName
              ? [
                  {
                    productName: {
                      $regex: ".*" + productName + ".*",
                      $options: "i",
                    },
                  },
                ]
              : []),
          ],
        };

  query = { ...query, "user.userId": req.userId };

  let count = await Inquiry.countDocuments(query);

  let data = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: "success", count, data });
});

// Get Inquiry By ID
exports.getInquiryById = catchAsync(async (req, res) => {
  let data = await Inquiry.findById(req.params.id);

  return res.status(201).send({ status: "success", data });
});

// Update Inquiry
exports.updateInquiryById = catchAsync(async (req, res) => {
  let data = await Inquiry.findOneAndUpdate(
    { _id: req.params.inquiryId },
    { ...req.body },
    { new: true, upsert: true }
  );

  res.status(200).send({ status: "success", data });
});

// Delete Inquiry
exports.deleteInquiryById = catchAsync(async (req, res) => {
  await Inquiry.findByIdAndDelete({ _id: req.params.inquiryId });

  return res.status(204).send({ status: "success" });
});
