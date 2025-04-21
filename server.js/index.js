const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const EmployeeModel = require('./models/Employee');
const TaskModel = require('./models/Task');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userExists = await EmployeeModel.findOne({ email });
    if (userExists)
      return res.status(409).json({ message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new EmployeeModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error("❌ Error during registration:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please provide both email and password" });

    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "No record found with this email" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add task
app.post('/tasks', async (req, res) => {
  try {
    const { title, desc, completed, pinned, date, time } = req.body;

    if (!title || !desc)
      return res.status(400).json({ message: "Title and description are required" });

    const newTask = new TaskModel({
      title,
      desc,
      completed: completed || false,
      pinned: pinned || false,
      date: date || "",
      time: time || ""
    });

    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (err) {
    console.error("❌ Error adding task:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, completed, pinned, dateTime } = req.body;

    const task = await TaskModel.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = title || task.title;
    task.desc = desc || task.desc;
    if (completed !== undefined) task.completed = completed;
    if (pinned !== undefined) task.pinned = pinned;
    if (dateTime) task.dateTime = new Date(dateTime);

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Toggle Pin/Unpin
app.put('/tasks/togglePin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.pinned = !task.pinned;
    await task.save();

    res.status(200).json({ message: `Task ${task.pinned ? "pinned" : "unpinned"} successfully`, task });
  } catch (err) {
    console.error("❌ Error toggling pin:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("✅ Server is running on http://localhost:3001");
});
