//use weatherOne API - 2 different APIs
// 1. gets you all of the nitty gritty details
// 2. gets you lattitude/longitude 

var searchBtn = document.querySelector("#search-btn");

var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");
var cityContainerEl = document.querySelector("#city-container")
var citySearchTerm = document.querySelector("#city-search-term");
var cityButtonsEl = document.querySelector("#city-buttons");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim().toLowerCase();
    if (city) {
        console.log("A search has been initialized for the city of: " + city);
        cityInputEl.value = "";
        //getCityDetails(city);
        //getCityForecast(city);
    } else {
        alert("Please enter a city name!");
    }
};

var getCityDetails = function(city) {
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    console.log(apiKey);
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,daily,alerts&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    //displayCurrentWeather(data);
                });                
            } else {
                alert("Error: " + response.statusText);
            };
        })
        .catch(function(error) {
            alert("Unable to connect to weather server!");
        });
}


var getCoordinates = function(city) {

    //may need to move this functionality to formSubmitHandler for error handling purposes
    var cityArr = $(city).split(",");
    var stateArr = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
    var cityName = cityArr[0];
    if (cityName) {
        console.log(cityName);
    }
    var stateId = cityArr[1].toUpperCase();
    for (i = 0; i < stateArr.length; i++) {
        if (stateId == stateArr[i]) {
            stateId = stateArr[i];
            break;
        } else {
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'");
            //refresh page
        }
    }
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateId + "&limit=5&appid=" + apiKey;
    
    fetch(apiUrl);

};

searchFormEl.addEventListener("submit", formSubmitHandler);