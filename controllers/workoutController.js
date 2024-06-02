const mongoose = require('mongoose');
const Workout = require('../model/Workout');

/**
 * @openapi
 * /workout:
 *   post:
 *     tags:
 *       - Workout
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
 * /workout:
 *   get:
 *     tags:
 *       - Workout
 *     summary: Get all workouts of a user
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
 *                       _id: 
 *                         type: string
 *                         example: "664fe59d90ac40e2283100ae"
 *                       user:
 *                         type: string
 *                         example: "jdoe"
 *                       name:
 *                         type: string
 *                         example: "Push Day"
 *                       date:
 *                         type: string
 *                         example: "2024/05/20"
 *                       exercises:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             exercise:
 *                               type: string
 *                               example: "Bench Press"
 *                             sets:
 *                               type: number
 *                               example: 1
 *                             setInfo:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   weight:
 *                                     type: number
 *                                     example: 135
 *                                   reps:
 *                                     type: number
 *                                     example: 5
 *                                   notes:
 *                                     type: string
 *                                     example: "Felt relatively light"
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
const getWorkouts = async(req, res) => {
    const user = req.user;

    try {
        const page = parseInt(req.query.page || 1);
        const pageSize = parseInt(req.query.pageSize || 10);
        const skip = (page - 1) * pageSize;

        //Get all the workouts of the user and sort in ascending order by date
        const result = await Workout.find({ "user" : user}).sort({ date: -1 }).skip(skip).limit(pageSize).exec();

        res.status(200).json(
            {
                "page" : page,
                "pageSize" : pageSize,
                "workouts": result
            }
        );
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

/**
 * @openapi
 * /workout/{id}:
 *   get:
 *     tags:
 *       - Workout
 *     summary: Get a workout by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout
 *     responses:
 *       200:
 *         description: Success
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: 
 *                   type: string
 *                   example: "664fe59d90ac40e2283100ae"
 *                 user:
 *                   type: string
 *                   example: "jdoe"
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
 *       400:
 *         description: ID not provided
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */
const getWorkoutById = async(req, res) => {
    if(!req?.params?.id) return res.status(400).json({ 'message' : 'id is required '});

    try {
        const workout = await Workout.findOne({ _id : req.params.id }).exec();
        if(!workout) {
            return res.status(404).json({ 'message' : `No workout found with id ${req.params.id}`});
        }
        
        if(workout.user !== req.user) {
            return res.sendStatus(403);
        }
        res.status(200).json(workout);
    } catch (err) {
        res.status(500).json({ 'message' : err.message });
    }
}

/**
 * @openapi
 * /workout/{id}:
 *   put:
 *     tags:
 *       - Workout
 *     summary: Update an existing workout
 *     security: 
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout to update
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
 *       404:
 *         description: Workout not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
const updateWorkout = async(req, res) => {
    try {
        const user = req.user; //set by the verifyJwt middleware, should be here if no issues in middleware

        //get the workout with the specified ID
        if(!req?.params?.id) return res.status(400).json({ 'message' : 'id is required '});

        const workout = await Workout.findOne({ _id : req.params.id }).exec();
        if(!workout) {
            return res.status(404).json({ 'message' : `No workout found with id ${req.params.id}`});
        }

        //do not allow an edit if the workout does not belong to the user
        if(workout.user !== user) {
            return res.sendStatus(403);
        }

        //validation on the request body
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

        //update the workout
        workout.name = name;
        workout.date = date;
        workout.exercises = exercises;

        await workout.save();

        res.status(201).json({ "message": `Workout updated successfully`});
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
 * /workout/{id}:
 *   delete:
 *     tags:
 *       - Workout
 *     summary: Delete an existing workout
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: ID not provided
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */
const deleteWorkoutById = async(req, res) => {
    try {
        const user = req.user;

        //get the workout with the specified ID
        if(!req?.params?.id) return res.status(400).json({ 'message' : 'id is required '});

        //find the workout
        const workout = await Workout.findOne({ _id : req.params.id }).exec();
        if(!workout) {
            return res.status(404).json({ 'message' : `No workout found with id ${req.params.id}`});
        }

        //do not allow if the workout does not belong to the user
        if(workout.user !== user) {
            return res.sendStatus(403);
        }

        await workout.deleteOne({ _id : req.body.id });
        res.status(200).json({ "message" : "Workout deleted successfully" });
    } catch (err) {
        res.status(500).json({ "message" : err.message});
    }
}

module.exports = { addWorkout, getWorkouts, getWorkoutById, updateWorkout, deleteWorkoutById };