const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/userMiddleware'); // Import middleware
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');

// Define routes and connect them to controller functions
// Protected route to get tasks
router.get('/', verifyToken, getTasks);

// Protected route to add a task
router.post('/', verifyToken, addTask);

// Protected route to update a task
router.put('/:task_id', verifyToken, updateTask);

// Protected route to delete a task
router.delete('/:task_id', verifyToken, deleteTask);

module.exports = router;
