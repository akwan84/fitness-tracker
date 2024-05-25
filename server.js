require('dotenv').config();
const express = require('express');
const { logger } = require('./middleware/logger');
const app = express();
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const verifyJwt = require('./middleware/verifyJwt');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { swaggerDefinition, options, swaggerSpec } = require('./swagger');

const PORT = process.env.PORT || 3500;

//Connect to MongoDB
connectDB();

app.use(logger);

app.use(credentials);

//cross origin resource sharing
app.use(cors(corsOptions));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(verifyJwt);
app.use('/workout', require('./routes/workout'));
app.use('/exercise', require('./routes/exercise'));

//listen for the 'open' event to make sure the connection is open
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB'),
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});