//use weatherOne API - 2 different APIs
// 1. gets you all of the nitty gritty details
// 2. gets you lattitude/longitude 

var searchBtn = document.querySelector("#search-btn");

var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");
var cityContainerEl = document.querySelector("#city-container")
var citySearchTerm = document.querySelector("#city-search-term");
var cityButtonsEl = document.querySelector("#city-buttons");
var stateArr = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
var foundState = false;

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
            //now have cityName and stateID separated, ready to obtain coordinates and fetch weatherAPI
            // console.log(cityName + ", " + stateId);
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

var getCoordinates = function(cityName, stateId) {   
    var apiKey = "769cf24c651333f06b49474b8dc504e4";
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "," + stateId + ",USA&appid=" + apiKey;

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
                    getWeather(cityLat, cityLon);
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



searchFormEl.addEventListener("submit", formSubmitHandler);