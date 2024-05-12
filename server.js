const express = require('express');
const { logger } = require('./middleware/logger');
const app = express();
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;

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
app.use('/workout', require('./routes/workout'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));