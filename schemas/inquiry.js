const mongoose = require('mongoose');

const InquirySchema = mongoose.Schema(
  {
    user: {
      offerupNick: String,
      firstName: String,
      lastName: String,
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
    notes: {
      type: String,
    },
    to: {
      type: String,
      enum: ['showroom', 'web'],
      default: 'web',
    },

    region: {
      type: String,
      enum: [
        'santa ana',
        'san bernardino',
        'san diego',
        'los angeles',
        'outer areas',
        'facebook'
      ],
      default: 'santa ana',
      required: true,
    },
    isImportant: {
      type: Boolean,
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
