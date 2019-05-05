const express = require("express");
const app = express();
const port = process.env.PORT;
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
require("./db/mongoose");

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Starting server...");
});