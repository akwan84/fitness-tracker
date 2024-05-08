const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}

const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

const handleNewUser = async(req, res) => {
    //get the username and password
    const { user, pwd } = req.body;
    
    //make sure there's no missing information
    if(!user || !pwd) return res.status(400).json({"message": "Username and password required"});

    //check for a duplicated username
    const duplicatedUser = usersDB.users.find(person => person.username === username);
    if(duplicatedUser) res.sendStatus(409); //409 indicates a duplicate resource

    try {
        //encrypt the password (number means salting rounds (idk what that means))
        const encryptedPwd = await bcrypt.hash(pwd, 10);

        //create the new user
        const newUser = { "username": user, "password": encryptedPwd }

        //add the new user to the database
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.status(201).json({ "message": `User ${user} has been created successfully`})
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }
}

module.exports = { handleNewUser };