const mongoose = require('mongoose');
const Workout = require('../model/Workout');

/**
 * @openapi
 * /workout/add-workout:
 *   post:
 *     tags:
 *       - Workout Controller
 *     summary: Create a new workout
 *     security: 
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Push Day"
 *               date:
 *                 type: string
 *                 example: "2024/05/20"
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       example: "Bench Press"
 *                     sets:
 *                       type: number
 *                       example: 1
 *                     setInfo:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           weight:
 *                             type: number
 *                             example: 135
 *                           reps:
 *                             type: number
 *                             example: 5
 *                           notes:
 *                             type: string
 *                             example: "Felt relatively light"
 *     responses:
 *       201:
 *         description: Workout created successfully
 *       400:
 *         description: Invalid request body
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
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

/**
 * @openapi
 * /workout/get-workout:
 *   get:
 *     tags:
 *       - Workout Controller
 *     summary: Get all workouts of a user
 *     responses:
 *       200:
 *         description: Success
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Push Day"
 *                 date:
 *                   type: string
 *                   example: "2024/05/20"
 *                 exercises:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exercise:
 *                         type: string
 *                         example: "Bench Press"
 *                       sets:
 *                         type: number
 *                         example: 1
 *                       setInfo:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             weight:
 *                               type: number
 *                               example: 135
 *                             reps:
 *                               type: number
 *                               example: 5
 *                             notes:
 *                               type: string
 *                               example: "Felt relatively light"
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
const getWorkouts = async(req, res) => {
    const user = req.user;

    try {
        //Get all the workouts of the user and sort in ascending order by date
        const result = await Workout.find({ "user" : user}).sort({ date: 1 });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

/**
 * @openapi
 * /workout/get-history:
 *   get:
 *     tags:
 *       - Workout Controller
 *     summary: Get the history of an exercise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exercise:
 *                 type: string
 *                 example: "Bench Press"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: "2020-04-20T04:00:00.000Z"
 *                   sets:
 *                     type: number
 *                     example: 1
 *                   setInfo:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         weight:
 *                           type: number
 *                           example: 135
 *                         reps:
 *                           type: number
 *                           example: 10
 *                         notes:
 *                           type: string
 *                           example: "Very hard set"
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
const getHistory = async(req, res) => {
    const user = req.user;

    try {
        //Get the exercise to search for
        const { exercise } = req.body;
        if(!exercise) return res.status(400).json({ "message" : "exercise is required" });

        //Get all the workouts of the user and sort in ascending order by date
        const result = await Workout.find({ "user" : user }).sort({ date : 1 });

        const response = [];

        //iterate through all each workout 
        result.forEach((workout) => {
            //get just the desired exercise out of the exercise list
            const exercises = workout.exercises;
            const filteredExercise = exercises.filter((exerciseRecord) => exerciseRecord.exercise === exercise);

            //pull out just the sets and set info
            filteredExercise.forEach((exerciseInfo) => {
                const resObj = {
                    "date" : workout.date,
                    "sets" : exerciseInfo.sets,
                    "setInfo" : exerciseInfo.setInfo
                };
                response.push(resObj);
            });
        });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { addWorkout, getWorkouts, getHistory };