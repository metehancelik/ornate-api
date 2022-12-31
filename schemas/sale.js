const mongoose = require('mongoose');

const SaleSchema = mongoose.Schema(
  {
    user: {
      firstName: String,
      lastName: String,
      offerupNick: String,
      userId: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    price: Number,
    commission: Number,
    date: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sale', SaleSchema);
