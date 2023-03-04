const mongoose = require('mongoose');

const CallSchema = mongoose.Schema(
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
    phone: {
      type: String,
      required: true,
    },
    isCalled: {
      type: String,
      enum: ['pending', 'in progress', 'done'],
      default: 'pending',
    },
    salesmanNote: String,
    callerNote: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Call', CallSchema);
