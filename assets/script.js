let apiKey = "61ff1a450ef17abc947601ca47ebe0d2";
let storedCities = $("#stored-cities");
let cities = JSON.parse(localStorage.getItem("city")) || [];
const searchButton = $("#search-button");
let cityInput = $("#city-input");

function removewithfilter(arr) {
    let outputCities = arr.filter((v, i, self) => i === self.indexOf(v));
    return outputCities;
}

function saveCities() {
    localStorage.setItem("city", JSON.stringify(cities));
}

function displayPastCities() {
    const uniqueCities = removewithfilter(cities);
    $("#stored-cities").empty();
    for (let i = 0; i < Math.min(5, uniqueCities.length); i++) {
        let pastCity = $("<button>").text(uniqueCities[i]);
        pastCity.addClass("past-cities");
        $("#stored-cities").append(pastCity);
        pastCity.on('click', function(event) {
            event.preventDefault();
            getCitiesLonlat(uniqueCities[i]);
        });
    }
}

function getCitiesLonlat(cityName) {
    const URLTest = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(URLTest)
        .then(response => {
            if (!response.ok) throw new Error('Sorry, no city was found');
            return response.json();
        })
        .then(data => {
            cities.push(data.name);
            cities = removewithfilter(cities);
            saveCities();
            displayPastCities();
            cityInput.val("");
            currentWeatherAPI(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            alert(error.message);
        });
}

function currentWeatherAPI(latitude, longitude) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            $("#weather-today").empty();
            let cityTitle = $("<h4>").text(data.name);
            let cityTemp = $("<p>").text(`${data.main.temp} °F`);
            let cityWind = $("<p>").text(`${data.wind.speed} MPH`);
            let cityHumid = $("<p>").text(`${data.main.humidity} %`);
            $("#weather-today").append(cityTitle, cityTemp, cityWind, cityHumid);
        });

    const URL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    fetch(URL2)
        .then(response => response.json())
        .then(data => {
            $("#cards").empty();
            for (let i = 0; i < 5; i++) {
                let cardDiv = $("<div>").addClass("card-box");
                let cardDate = new Date(data.list[i * 8].dt_txt).toLocaleDateString();
                let cardTemp = $("<h6>").text(`${data.list[i * 8].main.temp} °F`);
                let cardWind = $("<h6>").text(`${data.list[i * 8].wind.speed} MPH`);
                let cardHumid = $("<h6>").text(`${data.list[i * 8].main.humidity} %`);
                cardDiv.append($("<h3>").text(cardDate), cardTemp, cardWind, cardHumid);
                $("#cards").append(cardDiv);
            }
        });
}

searchButton.on('click', function(event) {
    event.preventDefault();
    let city = cityInput.val();
    if (city) {
        getCitiesLonlat(city);
        $("#weather-today").empty();
        $("#cards").empty();
    } else {
        alert("Please enter a city");
    }
});

displayPastCities();
