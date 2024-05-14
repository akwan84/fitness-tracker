const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const logoutUser = async(req, res) => {
    //delete the user's refresh token
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //no token to remove
    const refreshToken = cookies.jwt;

    //find the user with the refresh token in the cookie
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) {
        //no user with the refresh token found in the cookie, so just delete the cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204);
    }

    //delete the refresh token stored in the database
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const curUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, curUser])

    //write the change to the database
    fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )

    //clear cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
    return res.sendStatus(204);
}

module.exports = { logoutUser }