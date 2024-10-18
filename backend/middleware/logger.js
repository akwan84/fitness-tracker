const { v4: uuid} = require('uuid');
const { format } = require('date-fns');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

//log a message to a specified file
const logRequest = async(req, fileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const message = `${dateTime}\t${uuid()}\t${req.method} ${req.path}\n`;

    try{
        //check whether or not the log directory exists
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        //append the message to the log file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), message);
    } catch (err) {
        console.log(err);
    }
}

//logger to log information about requests
const logger = (req, res, next) => {
    logRequest(req, 'reqLog.txt'); //log request to the file
    console.log(`${req.method} ${req.path}`); //log the request method and path to the console
    next();
}

module.exports = { logger }