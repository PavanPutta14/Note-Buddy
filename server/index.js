
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/.env' });

const EmployeeModel = require('./models/Employee');
const TaskModel = require('./models/Task');

const app = express();
app.use(express.json());

// ✅ CORS fix: allow Vercel frontend
app.use(cors({
  origin: 'https://note-buddy-ten.vercel.app',
  credentials: true
}));

mongoose.set('debug', true);

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

// Register API
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const userExists = await EmployeeModel.findOne({ email });
    if (userExists)
      return res.status(409).json({ message: 'User already exists' });

    const newUser = new EmployeeModel({ name, email, password });
    await newUser.save();

    console.log("✅ User saved:", newUser);
    res.status(201).json({ message: 'Registered', user: { name, email } });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No such user' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Add a task
app.post('/tasks', async (req, res) => {
  try {
    const { title, desc, completed, pinned, dateTime, email } = req.body;

    const newTask = new TaskModel({
      title,
      desc,
      completed: completed || false,
      pinned: pinned || false,
      dateTime: dateTime || null,
      email: email || ""
    });

    await newTask.save();
    res.status(201).json({ message: 'Task added', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error adding task' });
  }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Toggle pin
app.put('/tasks/togglePin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.pinned = !task.pinned;
    await task.save();
    res.status(200).json({ message: 'Pin toggled', task });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling pin' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TaskModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello! Home server is working.');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
