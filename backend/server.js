const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const tasksRoutes = require('./routes/tasks');
const usersRoutes = require('./routes/users');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect Database
connectDB();

// Routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/users', usersRoutes);


// Start the server
const PORT = process.env.PORT || 5001; // Use a different port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
