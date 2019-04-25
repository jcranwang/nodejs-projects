const form = document.querySelector("form");
const searchBar = document.querySelector(".search");
const locationText = document.querySelector(".location");
const summaryText = document.querySelector(".summary");
const tempText = document.querySelector(".temp");
const errorText = document.querySelector(".error");

form.addEventListener("submit", e => {
  e.preventDefault();
  const searchTerm = searchBar.value;
  locationText.textContent = "Loading...";
  summaryText.textContent = "";
  tempText.textContent = "";
  errorText.textContent = "";

  fetch(`http://localhost:3000/weather?address=${searchTerm}`)
    .then(response => response.json())
    .then(({ location, summary, temp, error }) => {
      if (error) {
        locationText.textContent = "";
        errorText.textContent = error;
      } else {
        locationText.textContent = location;
        summaryText.textContent = summary;
        tempText.textContent = `Temperature: ${temp}°C`;
      }
    });
});
