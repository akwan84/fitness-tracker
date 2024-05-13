const workoutsDB = {
    workouts: require('../model/workouts.json'),
    setWorkouts: function(data) { this.workouts = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

const addWorkout = async(req, res) => {
    const user = req.user; //set by the verifyJwt middleware, should be here if no issues in middleware

    const {name, date, exercises} = req.body;
    if(!name || !date || !exercises) return res.status(400).json({ "message": "Name, date, and exercises are required" });
    /*
        Check format of exercise data. Should look like:
        [
            {
                name: string,
                date: string,
                exercises: {
                    exercise: [
                        {
                            "weight": float
                            "reps": int
                            "notes": string
                        },
                        ...
                    ],
                    ...
                }
            }
            ...
        ]
    */

    const foundUser = Object.keys(workoutsDB.workouts).find(key => key === user);
    if(!foundUser) res.status(404).json({ "message" : `User ${user} does not exist` });

    for(let key in exercises) {
        const correctFormat = exercises[key].every(set => 
            set.hasOwnProperty('weight') && 
            set.hasOwnProperty('reps') && 
            set.hasOwnProperty('notes') &&
            typeof set['weight'] === 'number' &&
            typeof set['reps'] === 'number' &&
            Number.isInteger(set['reps'])
        );
        if(!correctFormat) return res.status(400).json({ "message": "Weight, reps, and notes are required" });
    }

    const userWorkoutData = workoutsDB.workouts[user];
    userWorkoutData.push(
        {
            "id": uuid(),
            "name": name,
            "date": date,
            "exercises": exercises
        }
    );

    const workoutsCopy = workoutsDB.workouts;
    workoutsCopy[user] = userWorkoutData;
    workoutsDB.setWorkouts(workoutsCopy);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'workouts.json'),
        JSON.stringify(workoutsCopy)
    );
    res.status(201).json({ "message": `Workout added successfully`})
}

module.exports = { addWorkout };