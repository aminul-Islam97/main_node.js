const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Person = require('./../models/Person');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

// GET all persons (Public or protect with jwtAuthMiddleware if needed)
router.get('/',jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await Person.find().select('-password'); // Exclude passwords
    console.log('Data fetched');
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Profile route 
router.get('/profile',jwtAuthMiddleware, async (req, res) => {
  try {
    const userData =req.user;
    console.log('user Data: ', userData);

    const userId = userData.id;
    const user = await Person.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//  POST /signup - Register new user
router.post('/signup', async (req, res) => {
  try {
    const { username, password, ...otherFields } = req.body;

    const existingUser = await Person.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPerson = new Person({
      username,
      password: hashedPassword,
      ...otherFields,
    });

    const savedUser = await newPerson.save();

    const payload = { id: savedUser._id, username: savedUser.username };
    const token = generateToken(payload);

    res.status(201).json({
      user: { id: savedUser._id, username: savedUser.username },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /login - Login and return token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login request:', username, password); // DEBUG

    const user = await Person.findOne({ username });

    if (!user || (await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = { id: user._id, username: user.username };
    const token = generateToken(payload);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, username: user.username },
      token,
    });
  } catch (err) {
    console.error('Login error:', err); // DEBUG
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// PUT /:id - Update user (JWT protected)
router.put('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedData = req.body;

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const updatedPerson = await Person.findByIdAndUpdate(personId, updatedData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedPerson) {
      return res.status(404).json({ error: 'Person not found' });
    }

    res.status(200).json(updatedPerson);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  DELETE /:id - Delete user (JWT protected)
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    const personId = req.params.id;

    const deletedPerson = await Person.findByIdAndDelete(personId);
    if (!deletedPerson) {
      return res.status(404).json({ error: 'Person not found' });
    }

    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;