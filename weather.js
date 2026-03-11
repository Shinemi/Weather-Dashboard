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
        1: "🌤️ Mainly clear",
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

// add city to favorites
function addFavorite() {

    const city = cityInput.value.trim();

    if (!city) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    updateFavoritesList();
}

// display favorites in select
function updateFavoritesList() {

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesList.innerHTML = `<option value="">--Select from favorites--</option>`;

    favorites.forEach(city => {

        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;

        favoritesList.appendChild(option);
    });
}

// when selecting favorite
    favoritesList.addEventListener("change", () => {

        const selectedCity = favoritesList.value;

        cityInput.value = selectedCity;
});


// load favorites when page loads
window.addEventListener("load", updateFavoritesList);

// event listener for getting weather information
document.getElementById("get-weather").addEventListener("click", displayWeather);

// event listener for adding city to favorites
document.getElementById("add-favorite").addEventListener("click", addFavorite);

