const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task_id: { type: Number, required: true, unique: true }, // Unique integer task identifier
  title: { type: String, required: true }, // Task title
  description: { type: String }, // Optional task description
  create_date: { type: Date, default: Date.now }, // Automatically set to the current date
  update_date: { type: Date, default: Date.now }, // Automatically updated
  due_date: { 
    type: Date, 
    default: null,
    required: false
  }, // Optional due date
  assigned_user_id: { 
    type: Number, 
    required: true  // Make this required
  },
  priority_id: { 
    type: Number,
    enum: [1, 2, 3, 4], // Restrict to specific values
    default: 2, // Default priority (Medium)
  },
  status_id: { 
    type: Number,
    enum: [1, 2, 3, 4, 5], // Restrict to specific values
    default: 2, // Default status (In Progress)
  },
});

// Pre-save middleware to automatically set the update_date
TaskSchema.pre('save', function (next) {
  this.update_date = Date.now();
  next();
});

TaskSchema.set('strict', false); // Be more lenient with extra fields

module.exports = mongoose.model('Task', TaskSchema);
