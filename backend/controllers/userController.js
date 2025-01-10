const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate inputs
      if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Find the highest user_id
      const lastUser = await User.findOne().sort({ user_id: -1 });
      const nextUserId = lastUser ? lastUser.user_id + 1 : 1;
  
      // Save the user
      const newUser = new User({
        user_id: nextUserId,
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.json({ message: 'User registered successfully' });
    } catch (err) {
      if (err.code === 11000) {
        // Handle duplicate key errors
        if (err.keyValue.username) {
          return res.status(400).json({ error: 'Username already taken' });
        } else if (err.keyValue.email) {
          return res.status(400).json({ error: 'Email already taken' });
        }
      }
  
      // Handle other errors
      console.error('Error during registration:', err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
// Login a user
const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate inputs
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
  
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
  
      // Generate JWT with user info
      const token = jwt.sign(
        { 
          user_id: user.user_id,
          username: user.username,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Return token and user details
      res.json({
        token,
        user: {
          username: user.username,
          email: user.email,
          user_id: user.user_id,
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  };
  

module.exports = {
  registerUser,
  loginUser,
};
