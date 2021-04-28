//Assign variables for selectors
var searchEl = document.querySelector('#search-bar');
var searchButton = document.querySelector('#search-button');
var cardContainerEl = document.querySelector('#card-container')
var dateEl = document.querySelector('#current-date');
var cardCityName = document.querySelector('#city-name');
var weatherIconEl = document.querySelector('#weather-icon');
var cardCityTemp = document.querySelector('#city-temp');
var cardCityHumid = document.querySelector('#city-humid');
var cardCityWind = document.querySelector('#city-wind');
var cardCityUv = document.querySelector('#city-uv');



function displayDate() {
    var rightNow = moment().format('dddd, MMMM Do');
    dateEl.textContent = rightNow;

};

//function run when the 'search' button is clicked
searchButton.addEventListener('click', function(event){
    event.preventDefault();
    
    var cityName = searchEl.value; //what the user types into search parameter
    //the first url is used to get the lat/long coordinates
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=22da6aaaf94bcdcc6197f3b16198b09d";
    searchEl.value = ""; //clears the search field

    if(cityName === "") { //if they click search without inputting anything, alert wil pop up
        alert("Please enter a valid city name.")
    } else {
        var cityCapitalized = cityName.toLowerCase(); //converts the string to all lower case in case user used all caps
        cityCapitalized = cityCapitalized.charAt(0).toUpperCase() + cityCapitalized.slice(1); //capitalizes first letter of string
        cardCityName.textContent = cityCapitalized;
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
                cardCityUv.textContent = "UV Index: " + response.current.uvi;

                var dateEl = document.querySelector("#date0");
                dateEl.textContent = moment().add(1,'days').format('MM/DD');

                var iconEl = document.querySelector("#icon0");
                var dailyIconUrl = "http://openweathermap.org/img/wn/" + response.daily[0].weather[0].icon +"@2x.png";
                iconEl.setAttribute('src', dailyIconUrl)

                var tempEl = document.querySelector("#temp0");
                dailyTemp = response.daily[0].temp.day
                tempEl.textContent = "Temperature: " + calculateDegreesF(dailyTemp) + " \u00B0 F";

                var humidEl = document.querySelector("#humid0");
                humidEl.textContent = "Humidity: " + response.daily[0].humidity + " %";


                
            })
                                
                

                
                

                 
                            

        
    }
})

function calculateDegreesF(temp) {
    var tempinF = Math.floor((temp - 273.15) * (9/5) + 32);
    return tempinF;
}



function init () {
    displayDate();
}

init();