class WeatherInfo {
    constructor(city, country, temp, humidity, description) {
        this.city = city;
        this.country = country;
        this.temp = temp;
        this.humidity = humidity;
        this.description = description;
    }
}


//get the weather for a city, display weather information in the page  (minimum temp and weather description), and handle errors
document.getElementById("get-weather").addEventListener("click", function () {
    const city = document.getElementById("city").value;


    try {
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=fr&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const location = data.results[0];
                    const latitude = location.latitude;
                    const longitude = location.longitude;

                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
                        .then(response => response.json())
                        .then(weatherData => {
                            const weather = weatherData.current_weather;
                            const weatherInfo = new WeatherInfo(city, location.country, weather.temperature, weather.humidity, weather.description);
                            document.getElementById("weather-container").innerHTML = `
                                <h2>Weather in ${weatherInfo.city}, ${weatherInfo.country}</h2>
                                <p>Temperature: ${weatherInfo.temp}°C</p>
                                <p>Humidity: ${weatherInfo.humidity}%</p>
                                <p>Description: ${weatherInfo.description}</p>
                            `;
                    });
                }   
        }); 
    }
    catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weather-container").innerHTML = "<p>Error fetching weather data. Please try again later.</p>";
    }
});


//add a city to favourites, stock it in local navigator storage (JSON)
document.getElementById("add-favorite").addEventListener("click", function () {
    const city = document.getElementById("city").value;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesList();
    }
});


//display the list of favorite cities (from JSON) in the page (create a new option for each city in the list)
function updateFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = "";
    favorites.forEach(favorite => {
        const option = document.createElement("option");
        option.textContent = favorite;
        favoritesList.appendChild(option);
    });
}