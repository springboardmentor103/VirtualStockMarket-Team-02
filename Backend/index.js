const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/', routes);
app.use('/auth', authRoutes);

// PORT
app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
