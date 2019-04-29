const express = require("express");
const Users = require("../models/users");
const userRouter = new express.Router();

// Creation endpoint
userRouter.post("/users", async (req, res) => {
  try {
    const newUser = new Users(req.body);
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read endpoints
userRouter.get("/users", async (req, res) => {
  try {
    const users = await Users.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Sorry, user not found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Update endpoint
userRouter.patch("/users/:id", async (req, res) => {
  try {
    const updateKeys = Object.keys(req.body);
    const allowKeys = ["name", "email", "password", "age"];
    const hasKeys = updateKeys.every(updateKey =>
      allowKeys.includes(updateKey)
    );
    if (!hasKeys) {
      return res.status(400).send("Error: contain invalid update information");
    }

    const _id = req.params.id;
    const user = await Users.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send("Error: Cannot find the user");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete endpoint
userRouter.delete("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Users.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send("Error: user not found");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = userRouter;
