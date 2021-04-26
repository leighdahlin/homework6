//Assign variables for selectors
var searchEl = document.querySelector('#search-bar');
var searchButton = document.querySelector('#search-button');
var cardCityName = document.querySelector('#city-name');
var weatherIconEl = document.querySelector('#weather-icon');
var cardCityTemp = document.querySelector('#city-temp');
var cardCityHumid = document.querySelector('#city-humid');
var cardCityWind = document.querySelector('#city-wind');
var cardCityUv = document.querySelector('#city-uv');

//initialize variables to be used globally
var secondUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" +  cityLon +"&exclude=minutely&appid=22da6aaaf94bcdcc6197f3b16198b09d";
var cityLat = 0;
var cityLon = 0;

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
        fetch(url)
            .then(function(response)
            {
                if(response.status !== 200) { //if they city they searched is not found, alert will pop up
                    alert("Not a valid city.")
                }
                return response.json();
            })
            .then(function(data){
                cityLat = data.coord.lat;
                cityLon = data.coord.lon;

                return cityLon, cityLat;
                
                // console.log(cityLat);
                // console.log(cityLon);
                
                // cardCityName.textContent = cityName;

                // var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon +"@2x.png";
                // weatherIconEl.setAttribute('src', iconUrl);
                // weatherIconEl.setAttribute('class', "visible");

                // var cityTemp = data.main.temp;
                // cityTemp = Math.floor((cityTemp - 273.15) * (9/5) + 32);
                // cardCityTemp.textContent = "Temperature: " + cityTemp + " \u00B0 F";

                // cardCityHumid.textContent = "Humidity: " + data.main.humidity + " %";
                // cardCityWind.textContent = "Wind: " + data.wind.speed + " MPH";
                // cardCityUv.textContent = "UV Index: " 
                
            })
            

        
    }
})




function getData() {
    console.log(cityLat);
    console.log(cityLon);
    fetch(secondUrl)
        .then(function(response) {
                        response.json();
        })
        .then(function(data) {
                        console.log(data);
        })

 }