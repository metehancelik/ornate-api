const mongoose = require("mongoose");

const SaleSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        default: false
    },
    price: Number,
    date: Date
},
    {
        timestamps: true
    }

);

module.exports = mongoose.model("Sale", SaleSchema);