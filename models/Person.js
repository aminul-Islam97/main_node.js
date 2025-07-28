const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Person Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving (only if modified)
personSchema.pre("save", async function (next) {
  const person = this;

  if (!person.isModified('password')) return next(); 

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(person.password, salt);
    person.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare passwords
personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

const Person = mongoose.model("Person", personSchema);
module.exports = Person;