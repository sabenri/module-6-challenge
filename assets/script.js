let apiKey ="";
let storedCities = $("#stored-cities");
let cities = JSON.parse(localStorage.getItem("city")) || [];
let outputCities = [];
const searchButton = $("#search-button");
let cityInput =$("city-input");