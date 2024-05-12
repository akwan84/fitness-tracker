const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefresh = (req, res) => {
    //check whether the jwt cookie exists (i.e. where the refresh token is stored)
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    //look for the user with the same refresh token
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) return res.sendStatus(403); //forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            //check whether an error occurred
            //or the decoded payload from the jwt doesn't match 
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);

            //generate the new access token
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            )
            res.json({ accessToken });
        }
    )
}

module.exports = { handleRefresh };