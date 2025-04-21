const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  completed: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  dateTime: { type: Date, default: null },
  email: { type: String, default: "" } 
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
