const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
            
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Log in an existing user
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
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR4cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6ImFrdRFuODQiLCJyb2xlcyI6WzIwMDEsbnVsbCxudWxsXO0sImlhdCI6MTcxNjUxOTQwNSwiZXhwIjoxNzE2NTIxMjA1fQ.yzAu0wJYNshVhcaVhVH9qoZClrtVUrMUVBEr4i-ftSQ"
 *       400:
 *         description: Bad request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
const loginUser = async(req, res) => {
    //Make sure username and password are provided
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ "message": "Username and password are required" });

    //Find the user
    const foundUser = await User.findOne({ username: user }).exec()
    if(!foundUser) return res.status(404).json({ "message": `User ${user} does not exist` });

    //Make sure passwords match
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles);
        //generate access and refresh tokens
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        )

        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )

        //store the refresh token with a user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        //store the refresh token in a cookie which will be passed to every http request
        //important when we need to refresh the access token
        //  httpOnly: Only accessible through http requests
        //  sameSite: Allows cookies to be sent in cross-origin requests
        //  secure: Cookies should only be sent over secure connections
        //  maxAge: When the cookie will expire
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

        //return the access token upon successful login
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { loginUser }