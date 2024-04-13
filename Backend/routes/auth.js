const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    req.session.user = user;
    res.send('Login successful');
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully');
});

module.exports = router;
