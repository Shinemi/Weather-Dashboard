class WeatherInfo {
    constructor(city, country, temp, description) {
        this.city = city;
        this.country = country;
        this.temp = temp;
        this.description = description;
    }
}

const cityInput = document.getElementById("city");
const weatherContainer = document.getElementById("weather-container");
const favoritesList = document.getElementById("favorites-list");

//convert weather code to weather description
function getWeatherDescription(code) {
    const weatherCodes = {
        0: "🔆 Clear sky",
        1: "🌤️Mainly clear",
        2: "⛅ Partly cloudy",
        3: "☁️ Overcast",
        45: "🌫️ Fog",
        48: "🧊 Rime fog",
        51: "🌦️ Light drizzle",
        61: "🌧️ Rain",
        71: "🌨️ Snow fall",
        80: "🌦️ Rain showers"
    };
    return weatherCodes[code] || "Unknown weather";
}

// fetch coordinates from city name
async function getCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=fr&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    return data.results[0];
}


// fetch weather data from coordinates
async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const response = await fetch(url);
    const data = await response.json();

    return data.current_weather;
}


// main function to display weather information
async function displayWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        weatherContainer.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    try {
        const location = await getCoordinates(city);
        const weather = await getWeather(location.latitude, location.longitude);
        const weatherInfo = new WeatherInfo(city, location.country, weather.temperature, getWeatherDescription(weather.weathercode));

        weatherContainer.innerHTML = `
            <h2>Weather in ${weatherInfo.city}, ${weatherInfo.country}</h2>
            <p>Temperature: ${weatherInfo.temp}°C</p>
            <p>Description: ${weatherInfo.description}</p>
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherContainer.innerHTML = "<p>Error fetching weather data. Please try again later.</p>";
    }
}

// event listener for getting weather information
document.getElementById("get-weather").addEventListener("click", displayWeather);














// //add a city to favourites, stock it in local navigator storage (JSON)
// document.getElementById("add-favorite").addEventListener("click", function () {
//     const city = document.getElementById("city").value;
//     let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//     if (!favorites.includes(city)) {
//         favorites.push(city);
//         localStorage.setItem("favorites", JSON.stringify(favorites));
//         updateFavoritesList();
//     }
// });


// //display the list of favorite cities (from JSON) in the page (create a new option for each city in the list)
// function updateFavoritesList() {
//     const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
//     const favoritesList = document.getElementById("favorites-list");
//     favoritesList.innerHTML = "";
//     favorites.forEach(favorite => {
//         const option = document.createElement("option");
//         option.textContent = favorite;
//         favoritesList.appendChild(option);
//     });
// }