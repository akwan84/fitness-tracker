const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}

const bcrypt = require('bcrypt');

const loginUser = async(req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ "message": "Username and password are required" });

    const foundUser = usersDB.users.find(person => person.username === user);
    if(!foundUser) return res.status(404).json({ "message": `User ${user} does not exist` });

    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match) {
        res.status(200).json({"message": `Welcome ${user}`})
    } else {
        res.sendStatus(401);
    }
}

module.exports = { loginUser }