const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');
const passport = require('./auth');
const bodyParser = require('body-parser');

// Initialize Passport
app.use(passport.initialize());

// Body Parser Middleware
app.use(bodyParser.json());

// Logger Middleware
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request to: ${req.originalUrl}`);
  next();
};
app.use(logRequest);

// Home Route
app.get('/', (req, res) => {
  res.send('I am not okay brother');
});

// Import Routes
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Auth Route 
/*app.use('/person', passport.authenticate('local', { session: false }), (req, res) => {
  // you can optionally return a token here or user info
  res.json({ message: 'Login successful', user: req.user });
});*/
const localAuthMiddleware = passport.authenticate('local',{session:false});


// Use Routers
app.use('/person', personRoutes); // Public or protect using your own middleware
app.use('/menu', menuRoutes);     // Public or protect

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});