const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  completed: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  date: { type: String, default: "" },    // If you're storing date as string
  time: { type: String, default: "" },    // If you're storing time as string
  email: { type: String, default: "" }    // Email of user who owns the task
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
