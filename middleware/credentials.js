const allowedOrigins = ['http://localhost:3000'];

const credentials = (req, res, next) => {
    //check if the origin of the request is "whitelisted"
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)) {
        //Header used to permit the cross-origin request from this origin
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    //Header used to determine which methods are allowed to be used by the indicated origin
    res.setHeader('Access-Controll-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    //Header used to determine which headers can be used by the indicated origin
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    //Header used to determine whether credentials can be included in the request
    //Things like cookies, HTTP authentication...
    //Can be indicated in the request whether or not credentials are included or not
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
}

module.exports = credentials;