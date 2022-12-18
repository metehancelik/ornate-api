const mongoose = require("mongoose");

const CallSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        type: Boolean,
        default: false
    },
    salesmanNote: String,
    callerNote: String
},
    {
        timestamps: true
    }

);

module.exports = mongoose.model("Call", CallSchema);