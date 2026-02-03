const API_KEY = "9ef7aa97d878497cb38180628260102";

const CURRENT_API = "https://api.weatherapi.com/v1/current.json";
const FORECAST_API = "https://api.weatherapi.com/v1/forecast.json";
const SEARCH_API = "https://api.weatherapi.com/v1/search.json";

const userLocation = document.getElementById("userLocation");
const converter = document.getElementById("converter");
const suggestionsBox = document.getElementById("suggestions");
const Forecast = document.querySelector(".Forecast");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const feelsLike = document.querySelector(".feelsLike");
const description = document.querySelector(".description");
const dateEl = document.querySelector(".date");
const city = document.querySelector(".city");
const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const SRValue = document.getElementById("SRValue");
const SSValue = document.getElementById("SSValue");
const CValue = document.getElementById("CValue");
const UVValue = document.getElementById("UVValue");
const PValue = document.getElementById("PValue");

/* AUTOCOMPLETE */
let timer;
userLocation.addEventListener("input", () => {
  clearTimeout(timer);
  const q = userLocation.value.trim();
  if (q.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }
  timer = setTimeout(() => fetchSuggestions(q), 300);
});

async function fetchSuggestions(q) {
  const res = await fetch(`${SEARCH_API}?key=${API_KEY}&q=${q}`);
  const data = await res.json();
  suggestionsBox.innerHTML = "";

  data.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;
    li.onclick = () => {
      userLocation.value = city.name;
      suggestionsBox.innerHTML = "";
      findUserLocation();
    };
    suggestionsBox.appendChild(li);
  });
}

/* MAIN */
async function findUserLocation() {
  try {
    suggestionsBox.innerHTML = "";
    Forecast.innerHTML = "";

    const res = await fetch(
      `${CURRENT_API}?key=${API_KEY}&q=${userLocation.value}&aqi=no`
    );
    const data = await res.json();
    if (data.error) return alert(data.error.message);

    city.innerHTML = `${data.location.name}, ${data.location.country}`;
    weatherIcon.style.background = `url(https:${data.current.condition.icon})`;
    temperature.innerHTML = temp(data.current.temp_c, data.current.temp_f);
    feelsLike.innerHTML =
      "Feels like " +
      temp(data.current.feelslike_c, data.current.feelslike_f);
    description.innerHTML = data.current.condition.text;
    dateEl.innerHTML = data.location.localtime;

    HValue.innerHTML = data.current.humidity + "%";
    WValue.innerHTML = data.current.wind_kph + " km/h";
    CValue.innerHTML = data.current.cloud + "%";
    UVValue.innerHTML = data.current.uv;
    PValue.innerHTML = data.current.pressure_mb + " mb";

    const forecastRes = await fetch(
      `${FORECAST_API}?key=${API_KEY}&q=${userLocation.value}&days=3`
    );
    const forecast = await forecastRes.json();

    SRValue.innerHTML = forecast.forecast.forecastday[0].astro.sunrise;
    SSValue.innerHTML = forecast.forecast.forecastday[0].astro.sunset;

    forecast.forecast.forecastday.forEach(renderForecast);
  } catch (e) {
    alert("Error fetching data");
  }
}

function renderForecast(day) {
  const div = document.createElement("div");
  div.innerHTML = `
    <p>${new Date(day.date).toLocaleDateString("en-US",{weekday:"long"})}</p>
    <img src="https:${day.day.condition.icon}">
    <p class="forecast-desc">${day.day.condition.text}</p>
    <span>
      ${temp(day.day.maxtemp_c, day.day.maxtemp_f)} /
      ${temp(day.day.mintemp_c, day.day.mintemp_f)}
    </span>
  `;
  Forecast.appendChild(div);
}

function temp(c, f) {
  return converter.value === "°F"
    ? Math.round(f) + "°F"
    : Math.round(c) + "°C";
}
