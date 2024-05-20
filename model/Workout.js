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
});

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
});

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
    exercises: [exerciseSchema]
});

module.exports = mongoose.model('Workout', workoutSchema);