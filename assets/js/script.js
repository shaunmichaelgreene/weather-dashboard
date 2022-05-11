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
    forecastContainer.textContent="";
    var cityInput = cityInputEl.value.trim( ).toLowerCase();
    if (cityInput.includes(',')) { //verify that any input was entered, and that it includes a comma
        console.log("A search has been initialized for the city of: " + cityInput);
        cityInputEl.value = ""; 
        var cityArr = cityInput.split(","); //split input text by comma to separate city name and state abbreviation
        var cityName = cityArr[0].trim( ); //set cityName as the first string item in the array
        if (cityName) { //check to verify variable is valid
        } else { //if input invalid, (ex: ", AZ" trigger user alert to re-enter)
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'"); 
        }
        var stateId = cityArr[1].trim( );
        if (stateId) { //check to verify variable is valid
        } else { //if input invalid, (ex: ", AZ") trigger user alert to re-enter
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'"); 
        }
        for (i = 0; i < stateArr.length; i++) { //loop thru state abbreviation array to ensure the state ID entered is valid
            if (stateId.toUpperCase() == stateArr[i]) {
                stateId = stateArr[i]; //if valid, confirm the variable and end loop
                found = true;
                break;
            };
        }
        if (found = true) { //if invalid, trigger user alert to re-enter
            updateSearchHistory(cityName, stateId); //pass city/state to search history
            getCoordinates(cityName, stateId); //pass city/state to function to retrieve coordinates
        } else {
            alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'");
            location.reload(); 

        }
    } else {
        alert("Please re-enter your search term in City, ST format (Ex:'Phoenix, AZ'");
        cityInputEl.value = ""; 
    }
};

var updateSearchHistory = function(cityName, stateId) { //function to add search parameter to localStorage
    var newSearch = { //create object with city and state name
        city: cityName,
        state: stateId
    };
    // if (Array.isArray(newSearch)) { 
    //     console.log(newSearch);
    // } else {console.log(newSearch + "is not an array!")};

    searchHistory.push(newSearch); 
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); //set search history in localStorage
    var searchBtnEl = document.createElement("button"); 
    $(searchBtnEl).addClass("btn");
    searchBtnEl.textContent = (cityName + ", " + stateId); 
    var searchBtnElId = cityName.concat(",",stateId); //concatenate cityName & stateId with a comman between them
    searchBtnEl.setAttribute("id", searchBtnElId); 
    // searchBtnEl.setAttribute = ("id", `${searchBtnElId}`);
    // searchBtnEl.setAttribute = ("id", `${cityName},${stateId}`); 
    cityButtonsEl.appendChild(searchBtnEl); 
};
var loadHistory = function() { //function to retrieve search history from local storage and add them as buttons to the page
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")); 
    if (!searchHistory) { 
        searchHistory = []; //reset global variable 
    } else {
        $.each(searchHistory, function (e) { //loop thru local storage and make a new button for each entry
            var cityName = $(this).attr("city"); //assign city value of the current item to cityName variable
            var stateId = $(this).attr("state"); //assign state value of current item to stateId variable
            var searchBtnEl = document.createElement("button"); 
            $(searchBtnEl).addClass("btn");
            var searchBtnElId = cityName.concat(",",stateId); //concatenate cityName & stateId with a comman between them
            searchBtnEl.textContent = (cityName + ", " + stateId); //use the new variables as text content
            searchBtnEl.setAttribute("id", searchBtnElId); //set unique ID for each button, being the concatenated cityName,ST as a single string (makes for easier searching later)
            // searchBtnEl.setAttribute = ("id", `${cityName},${stateId}`); 
            cityButtonsEl.appendChild(searchBtnEl); 
        });
    };
};

var getCoordinates = function(cityName, stateId) {  //function to identify the coordinates of the selected search term 
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateId + ",USA&appid=" + apiKey; //retrieves latitude and longitude of destination
    
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) { 
                response.json().then(function(data) { 
                    // console.log(data);
                    var cityLat = data[0].lat; 
                    var cityLon = data[0].lon; 
                    console.log("The coordinates of " + cityName + ", " + stateId + " are Latitude: " + cityLat + ", Longitude: " + cityLon);
                    var formattedCityName = (cityName.charAt(0).toUpperCase() + cityName.substr(1).toLowerCase()); //format city name to title case
                    citySearchTerm.textContent = formattedCityName + ", " + stateId 
                    getWeather(cityLat, cityLon); //pass coordinates to function to get current weather conditions
                    getForecast(cityLat, cityLon) //pass coordinates to function to get 5-day forecast
                });
            } else {
                alert("Error: " + response.statusText);
            };
        })    
        .catch(function(error) {
            alert("Unable to connect to weather server!");
        });        
};
var getWeather = function(cityLat, cityLon) { //function to use new API to get weather using location latitude and longitude
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + apiKey; //retrieves current weather data
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) { 
                    displayCurrentWeather(data); //pass new data to function to interpret current weather data in meaningful way
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
    var currentWeather = { //define new object variable to store the weather data from the response
        icon: data.current.weather[0].icon,
        humidity: data.current.humidity,
        uvIndex: data.current.uvi,
        temperature: data.current.temp,
        windSpeed: data.current.wind_speed
    }
    //update text content of html elements to display current weather data
    iconEl.textContent = data.current.weather[0].description + " "; 
    var conditionsIcon = document.createElement("img");
    conditionsIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png");
    citySearchTerm.appendChild(conditionsIcon); 
    humidityEl.textContent = currentWeather.humidity + "%";
    uvIconEl.textContent = currentWeather.uvIndex;
    tempEl.textContent = currentWeather.temperature + "ºF";
    windEl.textContent = currentWeather.windSpeed + "MPH";
    
    if (currentWeather.uvIndex < 3) { //conditional to determine color of UV index icon
        uvIconEl.classList = "bg-success text-white rounded";
    } else if (currentWeather.uvIndex >= 3 && currentWeather.uvIndex < 6) {
        uvIconEl.classList = "bg-warning text-white rounded";
    } else if (currentWeather.uvIndex >= 6) {
        uvIconEl.classList = "bg-danger text-white rounded";
    }
    
}

var getForecast = function(cityLat, cityLon) {
    formattedDateArray = []; //reset global variable
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey; //modified api URL to return daily forecast
    
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) { 
                response.json().then(function(data) { 
                    // console.log(data);
                    interpretForecast(data); //pass new data to function to interpret 5-day forecast in meaningful way

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
    unixDateArray = []; //reset array to empty
    var forecastObject = { //create new object of arrays to hold all of the data for all 5 days
        // unixDateArr: [],
        formattedDateArr: [],
        iconArr: [],
        tempArr: [],
        windArr: [],
        humidityArr: []
    };

    for (var i=0; i < 5; i++) {
        unixDateArray.push(data.daily[i].dt);
        forecastObject.iconArr.push(data.daily[i].weather[0].icon);
        forecastObject.tempArr.push(data.daily[i].temp.day);
        forecastObject.windArr.push(data.daily[i].wind_speed);
        forecastObject.humidityArr.push(data.daily[i].humidity);
    }
    console.log(forecastObject);
    // console.log(unixDateArray);

    // unixDateArray = forecastObject.unixDateArr;
    dateConverter(unixDateArray);
    forecastObject.formattedDateArr = formattedDateArray; //take local data and assign to global variable
    console.log(forecastObject);
    displayForecast(forecastObject); //pass forecastObject data to display forecast function to append everything to page
};

var dateConverter = function () { //function to convert the date response data from unix to human-readable format
    for (i=0; i < 5; i++) { 
        var toMilliseconds = parseInt(unixDateArray[i]) * 1000;
        var dateObject = new Date (toMilliseconds);
        var formattedDate = dateObject.toLocaleString('en-us') //convert to standard US format
        formattedDateArray.push(formattedDate); //add newly formatted date string to formattedDateArray
    }
    // console.log(formattedDateArray);
    return
};

var displayForecast = function(forecastObject) { //function to dynamically display 5-day forecast on page 
    for (var i=0; i < 5; i++) {  
        var dayCard = document.createElement("div");
        dayCard.setAttribute("id", `dayCard${(i+1)}`); //assign each div a unique id with interpolation
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
        //create new variables for the forecast data to be displayed in each card, pulling their values from the corresponding arrays
        var dayDate = forecastObject.formattedDateArr[i];
        var dayIcon = forecastObject.iconArr[i];
        var dayTemp = forecastObject.tempArr[i];
        var dayWind = forecastObject.windArr[i];
        var dayHumidity = forecastObject.humidityArr[i];

        dayDateEl.textContent = dayDate.slice(0, -12); //remove additional timestamp from date value
        dayIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + dayIcon + "@2x.png"); 
        dayTempEl.textContent = "Temp: " + dayTemp + "ºF";
        dayWindEl.textContent = "Wind: " + dayWind + "MPH";
        dayHumidityEl.textContent = "Humidity: " + dayHumidity + "%";
        //append all new elements to the dayCard container
        dayCard.appendChild(dayDateEl);
        dayCard.appendChild(dayIconEl);
        dayCard.appendChild(dayTempEl);
        dayCard.appendChild(dayWindEl);
        dayCard.appendChild(dayHumidityEl);
    };
};

searchFormEl.addEventListener("submit", formSubmitHandler); //event listener for initial search button

var buttonClickHandler = function(event) { //function called by event listener for search history buttons
    var buttonClicked = event.target.getAttribute("id") //pull the iD from the button clicked (in format of city,ST)
    var cityName = buttonClicked.split(",")[0]; //split at comma, assign first value of array to cityName
    var stateId = buttonClicked.split(",")[1]; //assign 2nd value to stateID
    forecastContainer.textContent=""; 
    getCoordinates(cityName, stateId); //pass new search parameters back to getCoordinates function to repeat search
};

loadHistory(); //call function to load search history from local storage

cityButtonsEl.addEventListener("click", buttonClickHandler) //eventListener for search history buttons
