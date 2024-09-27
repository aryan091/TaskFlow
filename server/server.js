const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors(

));
app.use(express.json());

const PORT = process.env.PORT  || 5000;

// Simulated delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data stores for users and tasks
let users =   [];
let tasks =  [];

console.log("users :",users)
console.log("tasks :",tasks)

// Helper functions
const getUserByEmail = (email) => users.find(user => user.email === email);
const getTasksByUserId = (userId) => tasks.filter(task => task.userId === userId);

// API Endpoints
app.post('/sync-tasks', (req, res) => {
  const { userId, newTasks, updatedTasks, deletedTaskIds } = req.body;

  // Add new tasks to the backend
  newTasks.forEach(task => {
    tasks.push({ ...task, isSynced: true });
  });

  // Update existing tasks in the backend
  updatedTasks.forEach(updatedTask => {
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask, isSynced: true };
    }
  });

  // Delete tasks from the backend
  deletedTaskIds.forEach(id => {
    tasks = tasks.filter(task => task.id !== id);
  });

  res.json({ success: true, tasks });
});

// User Registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  await delay(500);

  if (getUserByEmail(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  console.log("users :",users)
  res.status(201).json({users, newUser});
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  await delay(500);

  const user = getUserByEmail(email);
  console.log("user in login backend :",user)
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  console.log("user in login backend :",user)
  res.status(200).json({
    users,
    user
  });
});

// Get Tasks for a User
app.get('/tasks', async (req, res) => {
  const { userId } = req.query;
  console.log(" User Id in backend :",userId)

  await delay(500);

  const userTasks = getTasksByUserId(parseInt(userId));

  console.log("userTasks in backend :",userTasks)

  res.status(200).json({userTasks});
});

// Add a New Task
app.post('/tasks', async (req, res) => {
  const {id, title, checklist, userId,createdAt } = req.body;

  await delay(500);

  const newTask = { id, title, checklist, userId , createdAt}
  tasks.push(newTask);
  console.log("New task in backend :",newTask)
  console.log("tasks in backend :",tasks)
  res.status(201).json({
    tasks,
    newTask
  });
});

// Update a Task
app.put('/tasks/:id', async (req, res) => {
  const { id: paramId } = req.params; // Get the ID from the request parameters
  const { title, checklist, userId, createdAt } = req.body; // Get the new task data from the request body

  console.log("Updated task data in backend:", req.body); // Log the incoming task data

  await delay(500);

  // Find the task index by comparing string IDs
  const taskIndex = tasks.findIndex(task => task.id === paramId);
  
  // Check if the task exists
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update the task with new data
  const currentTask = tasks[taskIndex];
  const updatedTask = { ...currentTask, title, checklist, userId, createdAt }; 
  tasks[taskIndex] = updatedTask;

  res.status(200).json({
    tasks,
    updatedTask
  });
});


// Delete a Task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  await delay(500);

  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ tasks});
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});
