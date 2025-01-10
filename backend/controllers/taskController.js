const Task = require('../models/Task');

// Get all tasks by user_id
const getTasks = async (req, res) => {
  try {
    const userId = req.user.user_id; // Get user_id from the authenticated request
    const tasks = await Task.find({ assigned_user_id: userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add a new task
const addTask = async (req, res) => {
    try {
      const {
        title,
        description = '',
        due_date = null,
        priority_id = 2,
        status_id = 1,
      } = req.body;

      const formattedData = {
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
        priority_id: Number(priority_id),
        status_id: Number(status_id),
        assigned_user_id: req.user.user_id
      };

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const lastTask = await Task.findOne().sort({ task_id: -1 });
      const nextTaskId = lastTask ? lastTask.task_id + 1 : 1;

      const newTask = new Task({
        task_id: nextTaskId,
        ...formattedData,
        create_date: new Date(),
        update_date: new Date()
      });

      const savedTask = await newTask.save();
      res.json(savedTask);

    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Failed to create task: ' + err.message });
    }
};
  
//Delete a task
const deleteTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.task_id, 10);
        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Invalid task_id' });
        }

        const task = await Task.findOneAndDelete({ task_id: taskId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.task_id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task_id' });
    }

    const existingTask = await Task.findOne({ 
      task_id: taskId,
      assigned_user_id: req.user.user_id 
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const updateData = {
      ...req.body,
      update_date: new Date(),
      assigned_user_id: req.user.user_id
    };

    const task = await Task.findOneAndUpdate(
      { task_id: taskId },
      updateData,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  
  module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
  };
