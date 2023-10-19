const apiKey = '331ce6fc2023f3f9c28aa091fc4d9fbe';
const cityForm = document.querySelector('form[type="form"]');
const cityInput = document.querySelector('input[type="text"]');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    const weatherImage = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    const currentWeatherInfo = document.createElement('div');
    currentWeatherInfo.innerHTML = `
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">${name} (${new Date().toLocaleDateString()})</p>
        <img src="${weatherImage}">
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Temp: ${main.temp}°F</p>
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Wind: ${wind.speed} MPH</p>
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Humidity: ${main.humidity}%</p>
    `;

    currentWeather.innerHTML = '';
    currentWeather.appendChild(currentWeatherInfo);
}

// Function to fetch 5-day forecast data
async function getForecastData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Function to display 5-day forecast
function displayForecast(data) {
    const forecastList = data.list;

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecastList.length; i += 8) {
        const { dt_txt, main, weather, wind } = forecastList[i];
        const weatherImage = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">${new Date(dt_txt).toLocaleDateString()}</p>
            <img src="${weatherImage}">
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Temp: ${main.temp}°F</p>
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Wind: ${wind.speed} MPH</p>
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Humidity: ${main.humidity}%</p>
        `;

        forecastContainer.appendChild(forecastDay);
    }
}

// Event listener for form submission
cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        const currentWeatherData = await getWeatherData(city);
        const forecastData = await getForecastData(city);

        // Display current weather and forecast
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);

        // Add the city to search history
        const searchItem = document.createElement('div');
        searchItem.textContent = city;
        searchHistory.appendChild(searchItem);

        // Clear the input field
        cityInput.value = '';
    }
});

// Event listener for clicking on a city in the search history
searchHistory.addEventListener('click', async (e) => {
    if (e.target.tagName === 'DIV') {
        const city = e.target.textContent;
        const currentWeatherData = await getWeatherData(city);
        const forecastData = await getForecastData(city);

        // Display current weather and forecast for the selected city
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    }
});