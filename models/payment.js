const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;