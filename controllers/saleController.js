const catchAsync = require("../utils/catchAsync");
const Sale = require("../schemas/sale");

const pdf = require('html-pdf');
const pdfTemplate = require('../utils/pdfTemplate');


//GET ALL SALES
exports.getAllSales = catchAsync(async (req, res, next) => {
  let data = await Sale.find().populate({
    path: "userId",
    select: "firstName lastName offerupNick commissionRate",
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
    d.commission = d.userId.commissionRate * d.price / 100
    delete d.userId;
    delete d.__v;
  }

  data = data.reverse()
  res.status(200).send({ status: "success", results: data.length, data });
});

//GET ALL SALES WITHOUT COMMISSIONS
exports.getUISales = catchAsync(async (req, res, next) => {
  let data = await Sale.find().populate({
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



//GET SALES BY USER ID
exports.getSalesByUserId = catchAsync(async (req, res, next) => {
  let sales = await Sale.find({ userId: req.params.userId });
  sales = JSON.parse(JSON.stringify(sales)).reverse();


  // Buralar okey
  for (let d of sales) {
    d.customerName = d.customerName;
    d.productName = d.productName;
    d.firstName = d.userId.firstName;
    d.lastName = d.userId.lastName;
    d.commission = d.userId.commissionRate * d.price / 100
    delete d.userId;
    delete d.__v;
  }
  //

  return res.status(200).send({ status: "success", data: sales });
});


//GET SALE BY ID
exports.getSaleById = catchAsync(async (req, res) => {
  let d = await Sale.findById(req.params.saleId).populate({
    path: "userId",
    select: "firstName lastName commissionRate",
  });

  d = JSON.parse(JSON.stringify(d));

  d.customerName = d.customerName;
  d.productName = d.productName;
  d.firstName = d.userId.firstName;
  d.lastName = d.userId.lastName;
  d.commission = d.userId.commissionRate * d.price / 100
  d.userId = undefined;
  d.__v = undefined;

  return res.status(200).send({ status: "success", data: d });
});

//GET ALL SALES' TOTAL PRICE
exports.getTotalPrice = catchAsync(async (req, res) => {
  let data = await Sale.find().select('price')
  totalPrice = data.map(item => item.price).reduce((a, b) => a + b)

  return res.status(200).send({ status: "success", data: totalPrice })
})

//CREATE SALE
exports.createSale = catchAsync(async (req, res) => {
  const { customerName, productName, price, isShared, userId, date } = req.body;

  const sale = await Sale.create({
    customerName,
    productName,
    price,
    isShared,
    userId,
    date
  });

  res.status(201).send({ status: "success", data: sale });
});

//UPDATE SALE
exports.updateSaleById = catchAsync(async (req, res, next) => {

  const saleId = req.params.saleId
  const sale = await Sale.findOneAndUpdate(
    { _id: saleId },
    { ...req.body },
    { upsert: true }
  )

  res.status(204).send({ status: "success", data: sale });
});

//DELETE SALE
exports.deleteSaleById = catchAsync(async (req, res, next) => {
  await Sale.findByIdAndDelete({ _id: req.params.saleId });

  return res.status(204).send({ status: "success" });
});
