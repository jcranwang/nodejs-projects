const forecast = require("./utility/forecast");
const geocode = require("./utility/geocode");

forecast(37.8267, -122.4233, (err, response) => {
  console.log(err);
  console.log(response);
});

geocode("New York", (err, response) => {
  console.log(err);
  console.log(response);
});