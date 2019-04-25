const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/49142c32eb649786bcb43dd3150c5af6/${latitude},${longitude}?units=si`;
  request.get({ url: url, json: true }, (err, response) => {
    if (err) {
      callback("Connection failed", undefined);
    } else if (response.body.error) {
      callback("Location not found", undefined);
    } else {
      callback(undefined, {
        summary: response.body.currently.summary,
        temp: response.body.currently.temperature
      });
    }
  });
};

module.exports = forecast;
