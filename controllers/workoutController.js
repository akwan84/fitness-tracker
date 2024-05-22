const mongoose = require('mongoose');
const Workout = require('../model/Workout');

/*
    Format of the data should look like:
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
*/

const addWorkout = async(req, res) => {
    const user = req.user; //set by the verifyJwt middleware, should be here if no issues in middleware

    const {name, date, exercises} = req.body;
    if(!name || !date || !exercises) return res.status(400).json({ "message": "Name, date, and exercises are required" });
   
    //make sure the set number matches the size of setInfo
    let missingFields = true;
    let mismatchingSize = true;
    exercises.forEach((exercise) => {
        if(!exercise.sets || !exercise.setInfo) {
            missingFields = false;
            return;
        } 
        if(exercise.sets !== exercise.setInfo.length) {
            mismatchingSize = false;
            return;
        } 
    });
    
    if(!missingFields) return res.status(400).json({ "message": "sets and setInfo are required" });
    if(!mismatchingSize) return res.status(400).json({ "message": "set count does not match setInfo size" });

    try {
        //add the workout to the database
        await Workout.create({
            user: user,
            name: name,
            date: date,
            exercises: exercises
        });
        res.status(201).json({ "message": `Workout added successfully`});
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            //validation error
            res.status(422).json({ "message": err.message });
        } else {
            //any other error
            res.status(500).json({ "message": err.message });
        }
    }
}

const getWorkouts = async(req, res) => {
    const user = req.user;

    try {
        const result = await Workout.find({ "user" : user}).sort({ date: 1 });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { addWorkout, getWorkouts };