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
                user: string
                name: string,
                date: date,
                exercises: [
                    {
                        "exercise": string,
                        "sets": integer
                        "setInfo": [
                            {
                                "weight": number,
                                "reps": number,
                                "notes": string
                            },
                            ...
                        ]
                    }
                    ...
                ]
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

    const userWorkoutData = workoutsDB.workouts;
    userWorkoutData[user] = [
        ...userWorkoutData[user], 
        {
            "id": uuid(),
            "name": name,
            "date": date,
            "exercises": exercises
        }
    ];
    workoutsDB.setWorkouts(userWorkoutData);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'workouts.json'),
        JSON.stringify(userWorkoutData)
    );
    res.status(201).json({ "message": `Workout added successfully`})
}

module.exports = { addWorkout };