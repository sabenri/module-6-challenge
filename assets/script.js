let apiKey ="1b279ba327e874fba9de13fa906e4a2b";
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

function getCitiesLonlat(cityName) {
    const URLTest ='https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}';
    fetch(URLTest)
        .then(response => {
            if(!response.ok) throw new Error('Sorry, No city was found');
            return response.json();
        })
        .then (data => {
            cities.push(data[0].name);
            cities = removewithfilter(cities);
            saveCities();
            displayPastCities();
            cityInput.val("");
            currentWeatherAPI(data[0].lat, data[0].lon);
        })
        .catch(error => {
            alert(error.message);
        });
}