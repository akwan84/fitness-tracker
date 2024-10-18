const User = require('../model/User');

/**
 * @openapi
 * /logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Log out the user
 *     responses:
 *       204:
 *         description: Successful logout
 *       500:
 *         description: Internal server error
 */
const logoutUser = async(req, res) => {
    try {
        //delete the user's refresh token
        const cookies = req.cookies;
        if(!cookies?.jwt) return res.sendStatus(204); //no token to remove
        const refreshToken = cookies.jwt;

        //find the user with the refresh token in the cookie
        const foundUser = await User.findOne({ refreshToken })
        if(!foundUser) {
            //no user with the refresh token found in the cookie, so just delete the cookie
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
            return res.sendStatus(204);
        }

        //delete the refresh token stored in the database
        foundUser.refreshToken = '';
        await foundUser.save();

        //clear cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ "message" : err.message });
    }
}

module.exports = { logoutUser }