const express = require('express');
const { logger } = require('./middleware/logger');
const app = express();

const PORT = process.env.PORT || 3500;

app.use(logger);

//built-in middleware for json
app.use(express.json());

app.use('/register', require('./routes/register'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));