const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const loginUser = async(req, res) => {
    //Make sure username and password are provided
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ "message": "Username and password are required" });

    //Find the user
    const foundUser = usersDB.users.find(person => person.username === user);
    if(!foundUser) return res.status(404).json({ "message": `User ${user} does not exist` });

    //Make sure passwords match
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        //generate access and refresh tokens
        const accessToken = jwt.sign(
            { "username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        )

        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        )

        //store the refresh token with a user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);

        //write to file
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

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