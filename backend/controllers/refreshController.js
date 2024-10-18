const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @openapi
 * /refresh:
 *   get:
 *     tags:
 *       - User
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Successful refresh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR4cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6ImFrdRFuODQiLCJyb2xlcyI6WzIwMDEsbnVsbCxudWxsXO0sImlhdCI6MTcxNjUxOTQwNSwiZXhwIjoxNzE2NTIxMjA1fQ.yzAu0wJYNshVhcaVhVH9qoZClrtVUrMUVBEr4i-ftSQ"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
const handleRefresh = async (req, res) => {
    //check whether the jwt cookie exists (i.e. where the refresh token is stored)
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    //look for the user with the same refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) return res.sendStatus(403); //forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            //check whether an error occurred
            //or the decoded payload from the jwt doesn't match 
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);
            //generate the new access token
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            )
            res.json({ accessToken });
        }
    )
}

module.exports = { handleRefresh };