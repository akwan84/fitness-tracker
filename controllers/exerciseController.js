const exerciseDB = {
    exercises: require('../model/exercises.json'),
    setExercises: function(data) { this.workouts = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const addExercise = async(req, res) => {
    const user = req.user;

    const { exercise } = req.body;
    if(!exercise) return res.status(400).json({ "message": "Exercise is required" });

    const duplicateExercise = exerciseDB.exercises[user].find(element => element === exercise);
    if(duplicateExercise) return res.status(409).json({ "message": `Exercise ${exercise} already exists`});

    const exercisesCopy = exerciseDB.exercises;
    exercisesCopy[user] = [...exercisesCopy[user], exercise];
    exerciseDB.setExercises(exercisesCopy);

    fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'exercises.json'),
        JSON.stringify(exercisesCopy)
    );
    res.status(201).json({ "message": `Exercise added successfully`})
}

module.exports = { addExercise };