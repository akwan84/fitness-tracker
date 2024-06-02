const User = require('../model/User');
const Exercise = require('../model/Exercise');
const bcrypt = require('bcrypt');

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: jdoe
 *               pwd:
 *                 type: string
 *                 example: abc123
 *     responses:
 *       201:
 *         description: Successful success
 *       400:
 *         description: Bad request body
 *       409:
 *         description: Duplicate user
 *       500:
 *         description: Internal server error
 */
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
        await User.create({ 
            "username": user, 
            "password": encryptedPwd,
        });

        //create the new user in the exercises collection
        await Exercise.create({
            "user": user,
            "exercises": []
        });

        res.status(201).json({ "message": `User ${user} has been created successfully`})
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }
}

module.exports = { handleNewUser };