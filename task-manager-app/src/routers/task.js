const express = require("express");
const Tasks = require("../models/tasks");
const auth = require("../middleware/auth");
const taskRouter = new express.Router();

// Creation endpoint
taskRouter.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Tasks({
      ...req.body,
      owner: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read endpoints
taskRouter.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const sortInfo = req.query.sortBy.split(":");
    sort[sortInfo[0]] = sortInfo[1] === "desc" ? -1 : 1;
  }
  try {
    const user = req.user;
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.status(200).send(user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.get("/tasks/:id", auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const user = req.user;
    const task = await Tasks.findOne({ _id: taskId, owner: user._id });
    if (!task) {
      return res.status(404).send("Error: task not found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Update endpoint
taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const reqKeys = Object.keys(req.body);
    const allowedKeys = ["description", "completed"];
    const hasKeys = reqKeys.every(reqKey => allowedKeys.includes(reqKey));
    if (!hasKeys) {
      return res.status(400).send("Error: invalid upadte properties");
    }

    const taskId = req.params.id;
    const user = req.user;
    const task = await Tasks.findOne({ _id: taskId, owner: user._id });
    if (!task) {
      return res.status(404).send("Error: task not found");
    }
    reqKeys.forEach(reqKey => (task[reqKey] = req.body[reqKey]));
    task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete endpoint
taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const user = req.user;
    const task = await Tasks.findOneAndDelete({ _id: taskId, owner: user._id });
    if (!task) {
      return res.status(404).send("Error: task not Found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = taskRouter;
