const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const User = require('./models/user');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route
app.get('/', (req, res) => {
  res.send('Getting Start Page');
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.json({ message: 'Login successful' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

