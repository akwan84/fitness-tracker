const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setSchema = new Schema({
    weight: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    notes: String
}, { _id: false });

const exerciseSchema = new Schema({
    exercise: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    setInfo: [setSchema]
}, { _id: false });

const workoutSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    exercises: {
        type: [exerciseSchema],
        required: true
    }
});

module.exports = mongoose.model('Workout', workoutSchema);