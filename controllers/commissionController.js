const catchAsync = require('../utils/catchAsync');
const Sale = require('../schemas/sale');

// Get All Commissions
exports.getAllCommissions = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 30;
  const sales = await Sale.find({
    createdAt: { $gte: req.body.dateGte, $lt: req.body.dateLt },
  }).select({
    price: 1,
    commission: 1,
    'user.firstName': 1,
    'user.lastName': 1,
    'user.offerupNick': 1,
    'user.address': 1,
  });

  let data = sales.map(
    (sale) =>
    (sale.offerupNick = {
      commission: sale.commission,
      firstName: sale.user.firstName,
      lastName: sale.user.lastName,
      revenue: sale.price,
      offerupNick: sale.user.offerupNick,
      address: sale.user.address,
    })
  );

  const aggregateArray = (arr) => {
    return arr.reduce((acc, val) => {
      const index = acc.findIndex((obj) => obj.offerupNick === val.offerupNick);
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
          address: val.address,
        });
      }
      return acc;
    }, []);
  };
  data = aggregateArray(data).slice(page - 1 * limit, page * limit);

  res.status(200).send({ status: 'success', data, count: data.length });
});
