const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("here");
        //make sure the roles exist
        if(!req?.roles) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);

        //make sure the user fulfills at least 1 of the allowed roles
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401);

        //role has been verified with no issues
        next();
    }
}

module.exports = verifyRoles;