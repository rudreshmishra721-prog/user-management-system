const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('./models/userModel');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// User routes
app.use('/api/users', userRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
