const locationText = document.querySelector(".location");
const summaryText = document.querySelector(".summary");
const tempText = document.querySelector(".temp");
const errorText = document.querySelector(".error");

fetch("http://localhost:3000/weather?address=Adelaide")
  .then(response => {
    locationText.textContent = "Loading...";
    return response.json();
  })
  .then(({ location, summary, temp, error }) => {
    if (error) {
      locationText.textContent = "";
      errorText.textContent = error;
    } else {
      locationText.textContent = location;
      summaryText.textContent = summary;
      tempText.textContent = `Temperature: ${temp}`;
    }
  });
