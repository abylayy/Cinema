const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boughtSeatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, ref: 'Movie', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    seats: [{ type: String, required: true }]
});

module.exports = mongoose.model('BoughtSeat', boughtSeatSchema);
