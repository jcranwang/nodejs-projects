const express = require("express");
const Users = require("../models/users");
const auth = require("../middleware/auth");
const userRouter = new express.Router();

//Login route
userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await Users.findByEmailAndPassword(
      req.body.email,
      req.body.password
    );
    const token = await user.createAuthToken();
    res.status(200).send({ user: user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Creation endpoint (Sign up)
userRouter.post("/users", async (req, res) => {
  try {
    const user = new Users(req.body);
    await user.save();
    const token = await user.createAuthToken();
    res.status(201).send({ user: user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read endpoints
userRouter.get("/users/me", auth, async(req, res) => {
  res.status(200).send(req.user);
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
    const user = await Users.findById(_id);
    if (!user) {
      return res.status(404).send("Error: Cannot find the user");
    }
    updateKeys.forEach(updateKey => (user[updateKey] = req.body[updateKey]));
    await user.save();
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
