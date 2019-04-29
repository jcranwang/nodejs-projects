const express = require("express");
const Tasks = require("../models/tasks");
const taskRouter = new express.Router();

// Creation endpoint
taskRouter.post("/tasks", async (req, res) => {
  try {
    const newTask = new Tasks(req.body);
    const task = await newTask.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read endpoints
taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.get("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Tasks.findById(_id);
    if (!task) {
      return res.status(404).send("Error: task not found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Update endpoint
taskRouter.patch("/tasks/:id", async (req, res) => {
  try {
    const reqKeys = Object.keys(req.body);
    const allowedKeys = ["description", "completed"];
    const hasKeys = reqKeys.every(reqKey => allowedKeys.includes(reqKey));
    if (!hasKeys) {
      return res.status(400).send("Error: invalid upadte properties");
    }

    const _id = req.params.id;
    const task = await Tasks.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(404).send("Error: task not found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete endpoint
taskRouter.delete("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Tasks.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send("Error: task not Found");
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = taskRouter;
