const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    //get the username and password
    const { user, pwd } = req.body;
    
    //make sure there's no missing information
    if(!user || !pwd) return res.status(400).json({"message": "Username and password required"});

    //check for a duplicated username
    const duplicatedUser = await User.findOne({ username: user }).exec();
    if(duplicatedUser) return res.sendStatus(409); //409 indicates a duplicate resource

    try {
        //encrypt the password (number means salting rounds (idk what that means))
        const encryptedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const newUser = await User.create({ 
            "username": user, 
            "password": encryptedPwd,
        });

        //add the new user to the workout database
        /*const workoutData = require('../model/workouts.json');
        workoutData[user] = [];
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'workouts.json'),
            JSON.stringify(workoutData)
        );

        //add the new user to the exercises database
        const exerciseData = require('../model/exercises.json');
        exerciseData[user] = [];
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'exercises.json'),
            JSON.stringify(exerciseData)
        );*/

        res.status(201).json({ "message": `User ${user} has been created successfully`})
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }
}

module.exports = { handleNewUser };