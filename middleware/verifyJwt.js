const jwt = require('jsonwebtoken');
require('dotenv').config;

const verifyJwt = (req, res, next) => {
    //Get the authorization header
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);

    //Authorization token will be given in the format: <Bearer> <Token>
    //We only want the token portion (i.e. access token)
    const token = authHeader.split(' ')[1];

    //verify the access token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            
            //set req.user so that JWT protected endpoints will know which user
            //is performing the action
            req.user = decoded.username;
            next();
        }
    )
}

module.exports = verifyJwt;