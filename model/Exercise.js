const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    exercises: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);