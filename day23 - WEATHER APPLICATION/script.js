const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const notfoundSection = document.querySelector(".not-found");
const SearchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const apiKey = "2d432466838f66526c9838d4efe15627";

const countryTxt = document.querySelector(".country-text");
const tempTxt = document.querySelector(".temp-text");
const conditionTxt = document.querySelector(".condition-txt");
const humidityTxt = document.querySelector(".humidity-value-txt");
const windTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-image");
const currentDatetxt = document.querySelector(".current-date-text");
const forecasrItemContainer = document.querySelector(
  ".forecast-items-container"
);

searchButton.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
async function getFetchData(endpoint, city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiURL);
  return response.json();
}
function getCurrentDate() {
  const currentDate = new Date();

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}
function getweatherIcon(id) {
  if (id <= 232) return "thunderstrom.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  console.log(weatherData);
  if (weatherData.cod != 200) {
    showDsiplaySection(notfoundSection);
    return;
  }
  console.log(weatherData);

  // storing the important value into the variable.
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = main;
  humidityTxt.textContent = humidity + " %";
  windTxt.textContent = speed + " M/s";

  currentDatetxt.textContent = getCurrentDate();
  weatherSummaryImg.src = `./assets/assets/weather/${getweatherIcon(id)}`;

  await forecastUpdateSection(city);

  showDsiplaySection(weatherInfoSection);
}
function showDsiplaySection(section) {
  [weatherInfoSection, SearchCitySection, notfoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
async function forecastUpdateSection(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecasrItemContainer.innerHTML = " ";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateforecastItems(forecastWeather);
    }
  });
}

function updateforecastItems(weatherData) {
  console.log(weatherData);

  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const forecastItem = `
   <div class="forecast-item">
            <h5 class="forecast-items-date regular-txt">3 JAN</h5>
            <img
              src="./assets/assets/weather/${getweatherIcon(id)}"
              alt=""
              class="forecast-item-image"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
          </div>
  `

  forecasrItemContainer.insertAdjacentElement('beforeend', forecastItem)
}
