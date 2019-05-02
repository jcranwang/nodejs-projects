const express = require("express");
const Users = require("../models/users");
const auth = require("../middleware/auth");
const userRouter = new express.Router();

//Login endpoint
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

// Log out endpoints
userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter(token => token.token !== req.token);
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

userRouter.post("/users/logoutall", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
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
userRouter.get("/users/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

// Update endpoint
userRouter.patch("/users/me", auth, async (req, res) => {
  try {
    const updateKeys = Object.keys(req.body);
    const allowKeys = ["name", "email", "password", "age"];
    const hasKeys = updateKeys.every(updateKey =>
      allowKeys.includes(updateKey)
    );
    if (!hasKeys) {
      return res.status(400).send("Error: contain invalid update information");
    }

    const user = req.user;
    updateKeys.forEach(updateKey => (user[updateKey] = req.body[updateKey]));
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete endpoint
userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    const user = req.user;
    await user.remove();
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = userRouter;
