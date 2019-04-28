const mongoose = require("mongoose");
const validator = require("validator");

const Users = mongoose.model("Users", {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value){
      if (!validator.isEmail(value)) {
        throw new Error("Please enter an valid email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value){
      if (value.toLowerCase().includes("password")) {
        throw new Error("Please enter a password that does not contain the word \"password\"");
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must not be smaller than 0");
      }
    }
  }
});

module.exports = Users;