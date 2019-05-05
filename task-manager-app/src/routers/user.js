const express = require("express");
const Users = require("../models/users");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { welcomeMail, cancelMail } = require("../email/account");
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
    welcomeMail(user.name, user.email);
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
    cancelMail(user.name, user.email);
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Profile pic endpoints
const avatar = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload .jpg, .jpeg, .png file"));
    }
    return cb(undefined, true);
  }
});

userRouter.post(
  "/users/me/avatar",
  auth,
  avatar.single("avatar"),
  async (req, res) => {
    const user = req.user;
    user.avatar = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    await user.save();
    res.status(201).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

userRouter.get("/users/:id/avatar", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await Users.findById(_id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  const user = req.user;
  user.avatar = undefined;
  await user.save();
  res.status(200).send();
});

module.exports = userRouter;
