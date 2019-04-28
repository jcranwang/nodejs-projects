const mongoose = require("mongoose");
const Users = require("../models/users");
const Tasks = require("../models/tasks");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-app", {
  useNewUrlParser: true,
  useCreateIndex: true
});

const newUser = new Users({
  name: "  Jay  ",
  email: "jay@gmail.com",
  password: "worldpeace",
  age: 21
});

newUser
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });

const newTask = new Tasks({
  description: "   Write code  "
});

newTask
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
