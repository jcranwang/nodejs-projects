const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

const publicPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(express.static(publicPath));
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialPath);

app.get("", (req, res) => {
  res.render("");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/help", (req, res) => {
  res.render("help");
});

app.listen("3000", () => {
  console.log("Starting server...");
});