const catchAsync = require("../utils/catchAsync");
const Sale = require("../schemas/sale");
const User = require("../schemas/user");

// Create Sale
exports.createSale = catchAsync(async (req, res) => {
  const { customerName, productName, price, isShared, userId, date } = req.body;
  const { firstName, lastName, offerupNick, commissionRate, billingInfo, _id } =
    await User.findById(userId).select({
      firstName: 1,
      lastName: 1,
      offerupNick: 1,
      commissionRate: 1,
      "billingInfo.address": 1,
    });

  const data = await Sale.create({
    customerName,
    productName,
    price,
    commission: (commissionRate * price) / 100,
    isShared,
    user: {
      offerupNick,
      firstName,
      lastName,
      address: billingInfo.address,
      userId: _id.toString(),
    },
    date,
  });

  res.status(201).send({ status: "success", data });
});

// Get All Sales
exports.getAllSales = catchAsync(async (req, res) => {
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

  let count = await Sale.countDocuments(query);

  let data = await Sale.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  res.status(200).send({ status: "success", count, data });
});

// Get All Sales Without Commission
exports.getUISales = catchAsync(async (req, res) => {
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

  let count = await Sale.countDocuments(query);

  let data = await Sale.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit)
    .select({
      commission: 0,
    });

  for (let d of data) {
    delete d.commission;
    delete d.userId;
    delete d.__v;
  }

  res.status(200).send({ status: "success", count, data });
});

// Get Sales By User ID
exports.getSalesByUserId = catchAsync(async (req, res) => {
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

  query = { ...query, "user.userId": req.params.userId };

  let count = await Sale.countDocuments(query);
  let data = await Sale.find(query)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit);

  return res.status(200).send({ status: "success", count, data });
});

// Get Sale By ID
exports.getSaleById = catchAsync(async (req, res) => {
  let data = await Sale.findById(req.params.saleId);

  return res.status(201).send({ status: "success", data });
});

// Get All Sales' Total Price
exports.getTotalPrice = catchAsync(async (req, res) => {
  let data = await Sale.find().select("price");
  data = data.map((item) => item.price).reduce((a, b) => a + b);

  return res.status(200).send({ status: "success", data });
});

// Update Sale
exports.updateSaleById = catchAsync(async (req, res) => {
  const data = await Sale.findOneAndUpdate(
    { _id: req.params.saleId },
    { ...req.body },
    { upsert: true }
  );

  res.status(204).send({ status: "success" });
});

// Delete Sale
exports.deleteSaleById = catchAsync(async (req, res) => {
  await Sale.findByIdAndDelete({ _id: req.params.saleId });

  return res.status(204).send({ status: "success" });
});
