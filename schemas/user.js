const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    offerupNick: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
    commissionRate: {
      type: Number,
      default: 6,
      required: true,
    },
    billingInfo: {
      fullName: String,
      email: String,
      address: String,
      iban: String,
      swift: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

module.exports = mongoose.model('User', UserSchema);
