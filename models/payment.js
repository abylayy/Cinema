const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Payment', paymentSchema);