const express = require('express');
const { logger } = require('./middleware/logger');
const app = express();

const PORT = process.env.PORT || 3500;

app.use(logger);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));