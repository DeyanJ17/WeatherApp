const apiKey = "a50aca8d250c364126fb68113a0cebce";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&";

const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const convertButton = document.querySelector(".convert-button");

async function checkWeather(entry) {
    let checkNumber = entry.split(",");
    var location;
    if(isNaN(parseFloat(checkNumber[0]))) {
        var location = "q=" + entry;
    } 
    else { 
        var location = "lat=" + checkNumber[0] + "&lon=" + checkNumber[1];
    }
    
    const response = await fetch(apiUrl + location + `&appid=${apiKey}`);

    if(response.status == 404) {
        document.querySelector(".error").style.display = "block";
    } 
    else {
        var data = await response.json();
        
        const utcDate = new Date();
        let sunriseUnix = data.sys.sunrise;
        let sunsetUnix = data.sys.sunset;
        var sunrise = new Date(sunriseUnix*1000);
        var sunset = new Date(sunsetUnix*1000);
        let isNight = false;
        if(utcDate >= sunset || utcDate <= sunrise) {
            isNight = true;
        }
        
        if(data.name != "") {
            document.querySelector(".entry").innerHTML = data.name;
        } 
        else {
            document.querySelector(".entry").innerHTML = "Unnamed Location";
        }
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " mph";

        const mainWeather = data.weather[0].main 
        if(mainWeather == "Clouds") {
            if(data.clouds.all >= 70) {
                weatherIcon.src = "images/cloudy.png";
            } 
            else if(isNight) {
                weatherIcon.src = "images/clouds-night.png";
            } 
            else {
                weatherIcon.src = "images/clouds.png";
            }
        } else if(mainWeather == "Clear") {
            if(isNight) {
                weatherIcon.src = "images/clear-night.png";
            } 
            else {
                weatherIcon.src = "images/clear.png";
            }
        } 
        else if(mainWeather == "Rain") {
            weatherIcon.src = "images/rain.png";
        } 
        else if(mainWeather == "Snow") {
            weatherIcon.src = "images/snow.png";
        } 
        else if(mainWeather == "Sleet") {
            weatherIcon.src = "images/sleet.png";
        } 
        else if(mainWeather == "Mist") {
          weatherIcon.src = "images/mist.png"  
        } 
        else if(mainWeather == "Fog") {
            weatherIcon.src = "images/fog.png"  
        } 
        else if(mainWeather == "Extreme") {
            weatherIcon.src = "images/extreme.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchButton.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
    convertButton.textContent = "To Metric";
});

convertButton.addEventListener("click", () => {
    if(convertButton.textContent == "To Metric") {
        const temp = document.querySelector(".temp");
        const fahrenheit = parseFloat(temp.textContent);
        const celsius = (fahrenheit-32)*(5/9);
        temp.textContent = Math.round(celsius) + "°C";

        const wind = document.querySelector(".wind");
        const mph = parseFloat(wind.textContent);
        const kmh = mph*1.609;
        wind.textContent = kmh.toFixed(2) + " km/h";

        convertButton.textContent = "To Imperial";
    } 
    else {
        const temp = document.querySelector(".temp");
        const celsius = parseFloat(temp.textContent);
        const fahrenheit = (celsius*(9/5)) + 32;
        temp.textContent = Math.round(fahrenheit) + "°F";

        const wind = document.querySelector(".wind");
        const kmh = parseFloat(wind.textContent);
        const mph = kmh/1.609;
        wind.textContent = mph.toFixed(2) + " mph";

        convertButton.textContent = "To Metric";
    }
});