const apiKey = "331ce6fc2023f3f9c28aa091fc4d9fbe";
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-history");
const cityList = document.getElementById("city-list");
const currentWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("forecast");

// console.log functions are left as comments for future troubleshooting

// Initialize the "cities" data in local storage if it does not exist
if (!localStorage.getItem("cities")) {
    localStorage.setItem("cities", JSON.stringify([]));
};

// Get and display current weather data
async function currentWeatherFunction(city) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    const response = await fetch(requestUrl);
    const data = await response.json();
    // console.log("current data displayed");
    
    const { name, main, weather, wind } = data;
    const weathericon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
    
    currentWeatherDiv.innerHTML = "";

    const currentWeatherData = document.createElement("div");
    currentWeatherData.innerHTML = `
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">${name} (${new Date().toLocaleDateString()})</p>
        <img src="${weathericon}">
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Temp: ${main.temp}°F</p>
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Wind: ${wind.speed} MPH</p>
        <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Humidity: ${main.humidity}%</p>
    `;
    currentWeatherDiv.appendChild(currentWeatherData);
};

// Get and display forecast data
async function forecastFunction(city) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

    const response = await fetch(requestUrl);
    const data = await response.json();
    // console.log("forecast data displayed");

    const forecastDataList = data.list;

    forecastDiv.innerHTML = "";

    for (let i = 0; i < forecastDataList.length; i += 8) {
        const { dt_txt, main, weather, wind } = forecastDataList[i];
        const weathericon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

        const forecastData = document.createElement("div");
        forecastData.className = "border-2 rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"
        forecastData.innerHTML = `
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">${new Date(dt_txt).toLocaleDateString()}</p>
            <img src="${weathericon}">
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Temp: ${main.temp}°F</p>
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Wind: ${wind.speed} MPH</p>
            <p class="ml-3 flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white">Humidity: ${main.humidity}%</p>
        `;
        forecastDiv.appendChild(forecastData);
    }
};


// Function to capitalize the first letter of every word in a string
function capitalizeFirstLetter(string) {
    const words = string.split(" ");
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
};

// Add city to local storage and call weather functions
function addCity() {
    const cityTrim = searchInput.value.trim();

    // console.log(cityTrim);

    if (cityTrim !== "") {
        const city = capitalizeFirstLetter(cityTrim);

        const cities = JSON.parse(localStorage.getItem("cities"));
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        searchInput.value = "";

        updateCityHistory();

        currentWeatherFunction(city);
        forecastFunction(city);
    } else {
        alert("Please enter a city name.");
    };
};

// Add city to history list
function updateCityHistory() {
    cityList.innerHTML = "";
    const cities = JSON.parse(localStorage.getItem("cities"));

    cities.forEach((city) => {
        const button = document.createElement("button");
        button.textContent = city;
        button.id = city;
        button.type = "city";
        button.className = "flex justify-center w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        // button.addEventListener("click", () => console.log(`${city} clicked`));
        button.addEventListener("click", () => currentWeatherFunction(city));
        button.addEventListener("click", () => forecastFunction(city));
        cityList.appendChild(button);
    });
};


function clearLocalStorage() {
    localStorage.clear();
    location.reload();
};

searchInput.addEventListener("keyup", function(event) {
    // console.log("key pressed");
    event.preventDefault();
    if (event.key === "Enter") {
        // console.log("enter key used");
        addCity();
        // searchButton.click();
    }
});

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    // console.log("search button used");
    addCity();
});

clearButton.addEventListener("click", function(event) {
    event.preventDefault();
    // console.log("clear button used");
    clearLocalStorage();
});


updateCityHistory();