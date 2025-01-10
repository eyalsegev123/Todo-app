const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true }, // Optional
  password: { type: String, required: true }, // Encrypted
  create_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
