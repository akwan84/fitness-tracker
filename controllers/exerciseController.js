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
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: Duplicate exercise
 *       500:
 *         description: Internal server error
 */
const addExercise = async(req, res) => {
    try {
        const user = req.user;

        const { exercise } = req.body;
        if(!exercise) return res.status(400).json({ "message": "Exercise is required" });

        const exerciseData = await Exercise.findOne({ user : user}).exec();
        if(!exerciseData) {
            return res.status(404).json({ 'message' : 'No exercises found' });
        }

        const duplicateExercise = exerciseData.exercises.find(element => element === exercise);
        if(duplicateExercise) return res.status(409).json({ "message": `Exercise ${exercise} already exists`});

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
 * /exercise/history:
 *   get:
 *     tags:
 *       - Exercise
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

module.exports = { addExercise, getHistory };