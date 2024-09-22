let apiKey = "1b279ba327e874fba9de13fa906e4a2b";
let storedCities = $("#stored-cities");
let cities = JSON.parse(localStorage.getItem("city")) || [];
const searchButton = $("#search-button");
let cityInput = $("#city-input");

function removewithfilter(arr) {
    let outputCities = arr.filler((v, i, self) => i === self.indexOf(v));
    return outputCities;
}

function saveCities(){
    localStorage.setItem("city", JSON.stringify(cities));
}

function displayPastCities () {
    const uniqueCities = removewithfilter(cities);
    $("#stored-cities").empty();
    for (var i = 0; i < Math.min(5, uniqueCities.length); i++) {
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
    const URLTest ='api.openweathermap.org/data/2.5/weather?q=London&mode=xml';
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
function currentWeatherAPI(latitude, longitude){
    const URL  ='https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial';
    fetch (URL)
    .then(response => response.json())
    .then(data => {
        $("#weather-today").empty();
        let cityTitle = $("<h4>").text(data.name);
        let cityTemp = $("<p>").text('${data.wind.speed} \u00b0f');
        let cityWind = $("<p>").text('${data.wind.speed} MPH');
        let cityHumid = $("<p>").text('${data.main.humidity}%');
        $("#weather-today").append(cityTitle, cityTemp, cityWind, cityHumid);
    });
    const URL2 = 'https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial';
    fetch(URL2)
        .then(response => response.json())
        .then(data => {
            $("#cards").empty();
            for (var i =0; i < 5; i++){
                let cardDiv = $("<div>").addClass("card-box");
                let cardDate = new Data(data.list[i * 8].dt_txt).toLocalDateString();
                let cardTemp = $("<h6>").text('${data.list[i * 8].main.temp}/u00b0f');
                let cardWind = $("<h6>").text('${data.list[i * 8].wind.speed} MPH');
                let cardHumid = $("<h6>").text('${data.list[i * 8].main.humidity} %');
                cardDiv.append($("<h3>").text(cardDate), cardTemp, cardWind, cardHumid);
            }
        });

        searchButton.on('click', function (event){
            event.preventDefault();
            let city =cityInput.val();
            if(city){
                $("#weather-today").empty();
            $("#cards").empty();
            } else {
                alert ("Please enter a city");
            }
            
        });
        
        displayPastCities();
    }
