const Workout = require('../model/Workout');
const Exercise = require('../model/Exercise');

/**
 * @openapi
 * /exercise:
 *   post:
 *     tags:
 *       - Exercise
 *     summary: Add an exercise for a user
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
 *       201:
 *         description: Success
 *       400:
 *         description: Missing exercise
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Duplicate exercise
 *       500:
 *         description: Internal server error
 */
const addExercise = async(req, res) => {
    try {
        const user = req.user;

        //get the exercise from the request body
        const { exercise } = req.body;
        if(!exercise) return res.status(400).json({ "message": "Exercise is required" });

        //get the exercises created by the user
        const exerciseData = await Exercise.findOne({ user : user}).exec();

        //check for duplicate exercises
        const duplicateExercise = exerciseData.exercises.find(element => element === exercise);
        if(duplicateExercise) return res.status(409).json({ "message": `Exercise ${exercise} already exists`});

        //update the exercise list
        const exercisesCopy = [...exerciseData.exercises, exercise];
        exerciseData.exercises = exercisesCopy;

        await exerciseData.save();

        res.status(201).json({ "message": `Exercise added successfully`});
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

/**
 * @openapi
 * /exercise:
 *   delete:
 *     tags:
 *       - Exercise
 *     summary: Delete an exercise created by a user
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
 *       201:
 *         description: Success
 *       400:
 *         description: Missing exercise
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
const deleteExercise = async(req, res) => {
    try {
        const user = req.user;

        //get the exercise from the request body
        const { exercise } = req.body;
        if(!exercise) return res.status(400).json({ "message": "Exercise is required" });

        //get the exercises created by the user
        const exerciseData = await Exercise.findOne({ user : user}).exec();

        //remove the desired exercise (doesn't matter if it exists or not)
        const newExercises = exerciseData.exercises.filter(element => element !== exercise);
        
        exerciseData.exercises = newExercises;
        await exerciseData.save();

        res.status(201).json({ "message": `Exercise removed successfully`});
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

/**
 * @openapi
 * /exercise:
 *   get:
 *     tags:
 *       - Exercise
 *     summary: Get all exercises created by a user
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
 *               type: object
 *               properties:
 *                 exercises:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Bench press"
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
const getExercises = async(req, res) => {
    try {
        const user = req.user;

        //Get all the exercises of the user
        const result = await Exercise.findOne({ "user" : user }).exec();

        res.status(200).json({ "exercises" : result.exercises });
    } catch (err) {
        res.status(500).json({ "message" : err.message });
    }
}

/**
 * @openapi
 * /exercise/history:
 *   get:
 *     tags:
 *       - Exercise
 *     summary: Get the history of an exercise
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *         default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: number
 *         default: 10
 *         description: Results per page
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
 *               type: object
 *               properties:
 *                 page:
 *                   type: number
 *                   example: 1
 *                 pageSize:
 *                   type: number
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2020-04-20T04:00:00.000Z"
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
 *                               example: 10
 *                             notes:
 *                               type: string
 *                               example: "Very hard set"
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
const getHistory = async(req, res) => {
    try {
        const user = req.user;

        //get the exercise to search for
        const exercise  = req.query.exercise;
        if(!exercise) return res.status(400).json({ "message" : "exercise is required" });
        

        //get the page and page size
        const page = parseInt(req.query.page || 1);
        const pageSize = parseInt(req.query.pageSize || 10);
        const skip = (page - 1) * pageSize;

        //get all the workouts of the user and sort in ascending order by date
        const result = await Workout.find(
            { 
                "user" : user, 
                "exercises": { $elemMatch: { exercise : exercise}} 
            })
            .sort({ date : -1 }).skip(skip).limit(pageSize).exec();

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
        res.status(200).json(
            {
                "page" : page,
                "pageSize" : pageSize,
                "data" : response
            }
        );
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { addExercise, getHistory, getExercises, deleteExercise };