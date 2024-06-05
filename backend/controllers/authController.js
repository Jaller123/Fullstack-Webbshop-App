const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config(); // Load environment variables from .env file

const secret = process.env.JWT_SECRET; // Use the secret from the environment variable

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send({ message: 'User already exists' });
    }

    user = new User({ username, password: bcrypt.hashSync(password, 8) });
    await user.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send({ message: 'User not found' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ token: null, message: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 }); 
    res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports = { register, login };
