const request = require("request");
const url = "https://api.darksky.net/forecast/49142c32eb649786bcb43dd3150c5af6/37.8267,-122.4233";

request.get({url:url, json: true}, (err, response) => {
  if (err) {
    console.log("Please check your network connection");
  } else if (response.error) {
    console.log("Please input correct coordinates");
  } else {
    console.log(response.body.currently.summary);
  }
});