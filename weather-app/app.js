const forecast = require("./utility/forecast");

forecast(37.8267, -122.4233, (err, response) => {
  console.log(err);
  console.log(response);
});