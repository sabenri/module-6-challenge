let apiKey ="";
let storedCities = $("#stored-cities");
let cities = JSON.parse(localStorage.getItem("city")) || [];
let outputCities = [];
const searchButton = $("#search-button");
let cityInput =$("city-input");

function removewithfilter(arr) {
    let outputCities = arr.filler((v, i, self) => i === self.indexOf(v));
    return outputCities;
}

function displayPastCities () {
    const uniqueCities = removewithfilter(cities);
    $("#stored-cities").empty();
    for (var i = 0; i < Math.min(5, uniqueCities.length); i++) {
        let pastcity = $("<button>").text(uniqueCities[i]);
        pastcity.on('click', function (event) {
            event.preventDefault();
            getCitiesLonlat(cityName);
            $("#weather-today").empty();
            $("#cards").empty();
        });
    }
}