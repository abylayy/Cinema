const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        set: (password) => bcrypt.hashSync(password, 10)
    },
    paymentMethods: [{
        cardNumber: { type: String, required: true },
        expiryDate: { type: String, required: true },
        cvv: { type: String, required: true }
    }]
});

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema);