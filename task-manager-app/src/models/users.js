const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./tasks");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
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
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(
          'Please enter a password that does not contain the word "password"'
        );
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();
  delete userObj.tokens;
  delete userObj.password;
  return userObj;
};

userSchema.methods.createAuthToken = async function() {
  const currentUser = this;
  const token = jwt.sign({ _id: currentUser._id.toString() }, "nodeisawesome");
  currentUser.tokens = currentUser.tokens.concat({ token: token });
  await currentUser.save();
  return token;
};

userSchema.statics.findByEmailAndPassword = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("Please provide correct email/password");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Please provide correct email/password");
  }
  return user;
};

userSchema.pre("save", async function(next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    currentUser.password = await bcrypt.hash(currentUser.password, 8);
  }
  next();
});

userSchema.pre("remove", async function(next) {
  const currentUser = this;
  await Tasks.deleteMany({ owner: currentUser._id });
  next();
});

userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "owner"
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
