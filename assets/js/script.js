//use weatherOne API - 2 different APIs
// 1. gets you all of the nitty gritty details
// 2. gets you lattitude/longitude 

var searchBtn = document.querySelector("#search-btn");
var searchHistory = [];
var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");
var cityContainerEl = document.querySelector("#city-container")
var citySearchTerm = document.querySelector("#city-search-term");
var cityButtonsEl = document.querySelector("#city-buttons");
var stateArr = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
var foundState = false;
var weatherData = document.querySelector("#weather-list");
var iconEl = document.querySelector("#current-icon");
var humidityEl = document.querySelector("#current-humidity");
var uviEl = document.querySelector("#current-uvi");
var uvIconEl = document.querySelector("#current-uv-icon");
var tempEl = document.querySelector("#current-temperature");
var windEl = document.querySelector("#current-windspeed");
var unixDateArray = [];
var formattedDateArray = [];
var forecastContainer = document.querySelector("#forecast-container");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityInput = cityInputEl.value.trim( ).toLowerCase();
    if (cityInput) { //verify that any input was entered
        console.log("A search has been initialized for the city of: " + cityInput);
        cityInputEl.value = ""; //reset input form
        var cityArr = cityInput.split(","); //split input text by comma to separate city name and state abbreviation
        // console.log(cityArr);
        var cityName = cityArr[0].trim( ); //set cityName as the first string item in the array
        if (cityName) { //check to verify variable is valid
            console.log(cityName);
        } else { //if input invalid, (ex: ", AZ" trigger user alert to re-enter)
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'"); 
        }
        var stateId = cityArr[1].trim( );
        if (stateId) { //check to verify variable is valid
            console.log(stateId);
        } else { //if input invalid, (ex: ", AZ" trigger user alert to re-enter)
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'"); 
        }
        // var stateId = cityArr[1].toUpperCase(); //set stateId to 2nd item in the array and set to uppercase
        for (i = 0; i < stateArr.length; i++) { //loop thru state abbreviation array to ensure the state ID entered is valid
            if (stateId.toUpperCase() == stateArr[i]) {
                stateId = stateArr[i]; //if valid, confirm the variable and end loop
                found = true;
                break;
            };
        }
        if (found = true) { //if invalid, trigger user alert to re-enter
            //now have cityName and stateId separated, ready to obtain coordinates and fetch weatherAPI
            // console.log(cityName + ", " + stateId);
            updateSearchHistory(cityName, stateId);
            getCoordinates(cityName, stateId);
        } else {
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'");
            location.reload(); //refresh page

        }
        //getCityDetails(city);
        //getCityForecast(city);
    } else {
        alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'");
        cityInputEl.value = ""; //reset input form
    }
};

var updateSearchHistory = function(cityName, stateId) {
    var newSearch = {
        city: cityName,
        state: stateId
    };
    if (Array.isArray(newSearch)) {
        console.log(newSearch);
    }
    searchHistory.push(newSearch);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    var searchBtnEl = document.createElement("button");
    $(searchBtnEl).addClass("btn");
    searchBtnEl.textContent = (cityName + ", " + stateId);
    searchBtnEl.setAttribute = ("data-city", cityName); 
    searchBtnEl.setAttribute = ("data-state", stateId);
    cityButtonsEl.appendChild(searchBtnEl);
};

var loadHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (!searchHistory) {
        searchHistory = [];
    } else {
        $.each(searchHistory, function (e) {
            var cityName = $(this).attr("city");
            var stateId = $(this).attr("state");
            var searchBtnEl = document.createElement("button");
            $(searchBtnEl).addClass("btn");
            searchBtnEl.textContent = (cityName + ", " + stateId);
            searchBtnEl.setAttribute = ("data-city", cityName); 
            searchBtnEl.setAttribute = ("data-state", stateId);
            cityButtonsEl.appendChild(searchBtnEl);
        });
    };
};

var getCoordinates = function(cityName, stateId) {   
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateId + ",USA&appid=" + apiKey;

    // var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "," + stateId + "&appid=" + apiKey; //this is the call for city/state/county search
    
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function(data) {
                    // console.log(data);
                    var cityLat = data[0].lat;
                    var cityLon = data[0].lon;
                    console.log("The coordinates of " + cityName + ", " + stateId + " are Latitude: " + cityLat + ", Longitude: " + cityLon);
                    var formattedCityName = (cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase());
                    citySearchTerm.textContent = formattedCityName + ", " + stateId
                    getWeather(cityLat, cityLon);
                    getForecast(cityLat, cityLon)
                });

                //define variables and pass to get weather function, then close branch
            } else {
                alert("Error: " + response.statusText);
            };
        })    
        .catch(function(error) {
            alert("Unable to connect to weather server!");
        });        
};
var getWeather = function(cityLat, cityLon) {
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                // console.log(response);
                response.json().then(function(data) {
                    // console.log(data);
                    displayCurrentWeather(data);
                });                
            } else {
                alert("Error: " + response.statusText);
            };
        })
        .catch(function(error) {
            alert("Unable to connect to weather server!");
        });
}

var displayCurrentWeather = function(data) {
    // console.log(data.current);
    var currentWeather = {
        icon: data.current.weather[0].icon,
        humidity: data.current.humidity,
        uvIndex: data.current.uvi,
        temperature: data.current.temp,
        windSpeed: data.current.wind_speed
    }
    // console.log(currentWeather);

    // weatherData.textContent = data.current.weather[0].description;
    iconEl.textContent = data.current.weather[0].description + " ";
    var conditionsIcon = document.createElement("img");
    conditionsIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png");
    citySearchTerm.appendChild(conditionsIcon);
    humidityEl.textContent = currentWeather.humidity + "%";
    // uviEl.textContent = "UV Index: "; 
    uvIconEl.textContent = currentWeather.uvIndex;
    tempEl.textContent = currentWeather.temperature + "ºF";
    windEl.textContent = currentWeather.windSpeed + "MPH";
    
    if (currentWeather.uvIndex < 3) {
        uvIconEl.classList = "bg-success text-white rounded";
    } else if (currentWeather.uvIndex >= 3 && currentWeather.uvIndex < 6) {
        uvIconEl.classList = "bg-warning text-white rounded";
    } else if (currentWeather.uvIndex >= 6) {
        uvIconEl.classList = "bg-danger text-white rounded";
    }
    
}

var getForecast = function(cityLat, cityLon) {
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                // console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    interpretForecast(data);

                });                
            } else {
                alert("Error: " + response.statusText);
            };
        })
        .catch(function(error) {
            alert("Unable to connect to weather server!");
        });
};

var interpretForecast = function(data) {
    var forecastObject = {
        // unixDateArr: [],
        formattedDateArr: [],
        iconArr: [],
        tempArr: [],
        windArr: [],
        humidityArr: []
    };

    for (var i=0; i < 5; i++) {
        // forecastObject.unixDateArr.push(data.daily[i].dt);
        unixDateArray.push(data.daily[i].dt);
        forecastObject.iconArr.push(data.daily[i].weather[0].icon);
        forecastObject.tempArr.push(data.daily[i].temp.day);
        forecastObject.windArr.push(data.daily[i].wind_speed);
        forecastObject.humidityArr.push(data.daily[i].humidity);
        //add .each function to convert and append dates?
    }
    console.log(forecastObject);
    // console.log(unixDateArray);

    // unixDateArray = forecastObject.unixDateArr;
    dateConverter(unixDateArray);
    forecastObject.formattedDateArr = formattedDateArray;
    console.log(forecastObject);
    //now to append everything to the page
    displayForecast(forecastObject);
};

var dateConverter = function () {
    console.log(unixDateArray); //why is this now undefined?
    for (i=0; i < 5; i++) {
        var toMilliseconds = parseInt(unixDateArray[i]) * 1000;
        var dateObject = new Date (toMilliseconds);
        var formattedDate = dateObject.toLocaleString('en-us') //.split(",")[0] here?
        formattedDateArray.push(formattedDate);
    }
    console.log(formattedDateArray);
    return
};

var displayForecast = function(forecastObject) {
    // var dayCard1 = document.createElement("div");
    // var dayCard2 = document.createElement("div");
    // var dayCard3 = document.createElement("div");
    // var dayCard4 = document.createElement("div");
    // var dayCard5 = document.createElement("div");
    for (var i=0; i < 5; i++) {
        var dayCard = document.createElement("div");
        dayCard.setAttribute("id", `dayCard${(i+1)}`);
        dayCard.classList = ("card forecast");
        forecastContainer.appendChild(dayCard);
        var dayDateEl = document.createElement("p");
        dayDateEl.setAttribute("id", `dayDateEl${(i+1)}`);
        var dayIconEl = document.createElement("img");
        dayIconEl.setAttribute("id", `dayIconEl${(i+1)}`);
        var dayTempEl = document.createElement("p");
        dayTempEl.setAttribute("id", `dayTempEl${(i+1)}`);
        var dayWindEl = document.createElement("p");
        dayWindEl.setAttribute("id", `dayWindEl${(i+1)}`);
        var dayHumidityEl = document.createElement("p");
        dayHumidityEl.setAttribute("id", `dayHumidityEl${(i+1)}`);

        var dayDate = forecastObject.formattedDateArr[i];
        var dayIcon = forecastObject.iconArr[i];
        var dayTemp = forecastObject.tempArr[i];
        var dayWind = forecastObject.windArr[i];
        var dayHumidity = forecastObject.humidityArr[i];

        dayDateEl.textContent = dayDate.slice(0, -12);
        dayIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + dayIcon + "@2x.png");        
        dayTempEl.textContent = "Temp: " + dayTemp + "ºF";
        dayWindEl.textContent = "Wind: " + dayWind + "MPH";
        dayHumidityEl.textContent = "Humidity: " + dayHumidity + "%";
        dayCard.appendChild(dayDateEl);
        dayCard.appendChild(dayIconEl);
        dayCard.appendChild(dayTempEl);
        dayCard.appendChild(dayWindEl);
        dayCard.appendChild(dayHumidityEl);

        // dayCard.textContent = "Temp: " + dayTemp;
    }
}

searchFormEl.addEventListener("submit", formSubmitHandler);
loadHistory();

// var conditionsIcon = document.createElement("img");
//     conditionsIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png");