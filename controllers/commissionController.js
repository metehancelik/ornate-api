const catchAsync = require("../utils/catchAsync");
const Sale = require("../schemas/sale");
const User = require("../schemas/user");

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

exports.getAllCommissions = catchAsync(async (req, res) => {

  const sales = await Sale.find({ createdAt: { $gte: req.body.gte, $lt: req.body.lt } }).populate({
    path: "userId",
    select: "firstName lastName offerupNick commissionRate",
  });

  let data = sales.map(sale => sale.offerupNick = { commission: sale.price * sale.userId.commissionRate / 100, firstName: sale.userId.firstName, lastName: sale.userId.lastName, revenue: sale.price, offerupNick: sale.userId.offerupNick })

  const aggregateArray = arr => {
    return arr.reduce((acc, val) => {
      const index = acc.findIndex(obj => obj.offerupNick === val.offerupNick);
      if (index !== -1) {
        acc[index].revenue += val.revenue;
        acc[index].commission += val.commission;
      } else {
        acc.push({
          offerupNick: val.offerupNick,
          revenue: val.revenue,
          commission: val.commission,
          firstName: val.firstName,
          lastName: val.lastName,
        });
      };
      return acc;
    }, []);
  };
  data = aggregateArray(data)

  res.status(200).send({ status: "success", data, length: sales.length });
});