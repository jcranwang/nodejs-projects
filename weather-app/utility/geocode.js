const request = require("request");

const geocode = (searchTerm, callback) => {
  const apiToken =
    "pk.eyJ1Ijoic2ltb25raW5nMSIsImEiOiJjanV2OHNicncwMnFhM3ptb3JwbHBnZTZnIn0.CXHGz8I-gEEN85r-wxVqIw";
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    searchTerm
  )}.json?access_token=${apiToken}`;

  request.get({ url, json: true }, (error, response) => {
    if (error) {
      callback("Connection failed", undefined);
    } else if (response.body.message) {
      callback(response.body.message, undefined);
    } else if (response.body.features.length === 0) {
      callback("location Not Found", undefined);
    } else {
      callback(undefined, {
        coordinate: response.body.features[0].center
      });
    }
  });
};

module.exports = geocode;
