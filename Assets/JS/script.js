//Assign variables for selectors
var searchEl = document.querySelector('#search-bar');
var searchButton = document.querySelector('#search-button');
var buttonEl = document.querySelector('.button-div')
var futureWeather = document.querySelector('.forecast-container');
var cardContainerEl = document.querySelector('#card-container');
var dateEl = document.querySelector('#current-date');
var cardCityName = document.querySelector('#city-name');
var weatherIconEl = document.querySelector('#weather-icon');
var cardCityTemp = document.querySelector('#city-temp');
var cardCityHumid = document.querySelector('#city-humid');
var cardCityWind = document.querySelector('#city-wind');
var cardCityUv = document.querySelector('#city-uv');
var UvNumber = document.querySelector('#uv-num');

//store recent search in local storage, limited to 8 searches
var storedSearches = JSON.parse(localStorage.getItem("cities")) || [];

//function to display the current date
function displayDate() {
    var rightNow = moment().format('dddd, MMMM Do');
    dateEl.textContent = rightNow;

};

//function run when the 'search' button is clicked
searchButton.addEventListener('click', function(event){
    event.preventDefault();

    var cityName = searchEl.value; //what the user types into search parameter

    //the first url is used to get the lat/long coordinates
    fetchWeatherInfo(cityName);
    searchEl.value = ""; //clears the search field

    if(cityName === "") { //if they click search without inputting anything, alert wil pop up
        alert("Please enter a valid city name.")
    } else {
        var cityCapitalized = cityName.toLowerCase(); //converts the string to all lower case in case user used all caps
        cityCapitalized = cityCapitalized.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); //capitalizes first letter of each word
        cardCityName.textContent = cityCapitalized;
        
        //stores city search if it doesn't matach another search
        var mostRecentSearch = cityCapitalized;
        storedSearches.push(mostRecentSearch);

        //when more than 10 items in local storage, removes first item in local storage and corresponding button
        if(storedSearches.length > 11) {
                storedSearches.shift();
                buttonEl.removeChild(buttonEl.childNodes[1]);
            }

        localStorage.setItem('cities', JSON.stringify(storedSearches));

        createButton(cityCapitalized);
        console.log(buttonEl.childNodes[1]);
    }
});

buttonEl.addEventListener("click", function(event){
    if(event.target !== event.currentTarget) {
        var buttonPress = event.target.id
        cardCityName.textContent = buttonPress;
        fetchWeatherInfo(buttonPress);
    }
    event.stopPropagation();
});

//API call to pull weather information
function fetchWeatherInfo(cityName) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=22da6aaaf94bcdcc6197f3b16198b09d";
    fetch(url)
    .then(function(response){
        if(response.status !== 200) { //if they city they searched is not found, alert will pop up
            alert("Not a valid city.")
        }
        return response.json();
    })
    .then(function(data){
       var cityLat = data.coord.lat;
       var cityLon = data.coord.lon;

        //returns a new API call using the latitute and longitude collected from the first, also exludes minutely and hourly data b/c not needed
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly&appid=22da6aaaf94bcdcc6197f3b16198b09d");
    })
    .then(function(data){
        return data.json();
    })
    .then(function(response){
        console.log(response);
        var iconUrl = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon +"@2x.png";
        weatherIconEl.setAttribute('src', iconUrl);
        weatherIconEl.setAttribute('class', "visible");

        var cityTemp = response.current.temp;
        
        cardCityTemp.textContent = "Temperature: " + calculateDegreesF(cityTemp) + " \u00B0 F";

        cardCityHumid.textContent = "Humidity: " + response.current.humidity + " %";
        cardCityWind.textContent = "Wind: " + response.current.wind_speed + " MPH";
        
        var currentUVIndex = response.current.uvi;
        cardCityUv.textContent = "UV Index: ";
        var spanEl = document.createElement("span");
        spanEl.textContent = currentUVIndex;
        cardCityUv.appendChild(spanEl);
        if(currentUVIndex<6) {
            spanEl.setAttribute('style','background: green; border-radius: 10px; color: white; padding: 5px; padding-left: 10px; padding-right: 10px;')
        } else if(currentUVIndex <9) {
            spanEl.setAttribute('style','background: yellow; border-radius: 10px; color: white; padding: 5px; padding-left: 10px; padding-right: 10px;')
        } else {
            spanEl.setAttribute('style','background: red; border-radius: 10px; color: white; padding: 5px; padding-left: 10px; padding-right: 10px;')
        }
        futureWeather.setAttribute('class', 'forecast-container')
        for (var i=0; i<5; i++) {
            var dateSelector = "#date" + i
            var dateEl = document.querySelector(dateSelector);
            dateEl.textContent = moment().add(i + 1,'days').format('MM/DD');

            var iconSelector = "#icon" + i
            var iconEl = document.querySelector(iconSelector);
            var dailyIconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon +"@2x.png";
            iconEl.setAttribute('src', dailyIconUrl)

            var tempSelector = "#temp" + i
            var tempEl = document.querySelector(tempSelector);
            dailyTemp = response.daily[i].temp.day
            tempEl.textContent = "Temp: " + calculateDegreesF(dailyTemp) + " \u00B0 F";

            var humidSelector = "#humid" + i
            var humidEl = document.querySelector(humidSelector);
            humidEl.textContent = "Humidity: " + response.daily[i].humidity + " %";
        }

        
    })
}

function createButton(city) {
    var cityButton = document.createElement('button');
    cityButton.setAttribute('type', 'button');
    cityButton.setAttribute('class', 'list-group-item list-group-item-action');
    var buttonId = city;
    cityButton.setAttribute('id', buttonId);
    cityButton.textContent = city;

    buttonEl.appendChild(cityButton);
}

function calculateDegreesF(temp) {
    var tempinF = Math.floor((temp - 273.15) * (9/5) + 32);
    return tempinF;
}

function generateSavedButtons() {
    if(storedSearches.length !== 0) {
        for (i=0; i<storedSearches.length; i++) {            
            var cityButton = document.createElement('button');
            cityButton.setAttribute('type', 'button');
            cityButton.setAttribute('class', 'list-group-item list-group-item-action');
            var buttonId = storedSearches[i];
            cityButton.setAttribute('id', buttonId);
            cityButton.textContent = storedSearches[i];

            buttonEl.appendChild(cityButton);
        }
    }
}



function init () {
    displayDate();
    generateSavedButtons();
}

init();