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





// WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&q=`;
// WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=a5bb4718b30b6f58f58697997567fffa&exclude=minutely&units=metric&`;

// const userLocation = document.getElementById("userLocation"),
//   converter = document.getElementById("converter"),
//   Forecast = document.querySelector(".Forecast"),
//   weatherIcon = document.querySelector(".weatherIcon"),
//   date = document.querySelector(".date"),
//   temperature = document.querySelector(".temperature"),
//   feelsLike = document.querySelector(".feelsLike"),
//   description = document.querySelector(".description"),
//   city = document.querySelector(".city"),
//   HValue = document.getElementById("HValue"),
//   WValue = document.getElementById("WValue"),
//   SRValue = document.getElementById("SRValue"),
//   SSValue = document.getElementById("SSValue"),
//   CValue = document.getElementById("CValue"),
//   UVValue = document.getElementById("UVValue"),
//   PValue = document.getElementById("PValue");

// function findUserLocation() {
//   Forecast.innerHTML = "";
//   fetch(WEATHER_API_ENDPOINT + userLocation.value)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       if (data.cod != "" && data.cod != "200") {
//         alert(data.message);
//         return;
//       }

//       city.innerHTML = data.name + ", " + data.sys.country;
//       weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
//       fetch(
//         WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           console.log(data);
//           temperature.innerHTML = TemperatureConverter(data.current.temp);

//           const options = {
//             weekday: "long",
//             month: "long",
//             day: "numeric",
//             hour: "numeric",
//             minute: "numeric",
//             hour12: true,
//           };
//           date.innerHTML = getLongFormatUnixTime(
//             data.current.dt,
//             data.timezone_offset,
//             options
//           );
//           feelsLike.innerHTML =
//             "Feels like " + TemperatureConverter(data.current.feels_like);
//           description.innerHTML =
//             `<i class="fa-brands fa-cloudversify"></i> &nbsp;` +
//             data.current.weather[0].description;

//           HValue.innerHTML =
//             Math.round(data.current.humidity) + `<span>%</span>`;
//           WValue.innerHTML =
//             Math.round(data.current.wind_speed) + `<span>m/s</span>`;

//           const options1 = {
//             hour: "numeric",
//             minute: "numeric",
//             hour12: true,
//           };
//           SRValue.innerHTML = getLongFormatUnixTime(
//             data.current.sunrise,
//             data.timezone_offset,
//             options1
//           );
//           SSValue.innerHTML = getLongFormatUnixTime(
//             data.current.sunset,
//             data.timezone_offset,
//             options1
//           );
//           CValue.innerHTML = data.current.clouds + `<span>%</span>`;
//           UVValue.innerHTML = data.current.uvi;
//           PValue.innerHTML = data.current.pressure + `<span>hPa</span>`;

//           data.daily.forEach((weather) => {
//             let div = document.createElement("div");
//             const options = {
//               weekday: "long",
//               month: "long",
//               day: "numeric",
//             };
//             let daily = getLongFormatUnixTime(weather.dt, 0, options).split(
//               " at "
//             );
//             div.innerHTML += daily[0];
//             div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />`;
//             div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}</p>`;
//             div.innerHTML += `<span><span>${TemperatureConverter(
//               weather.temp.max
//             )}</span>  &nbsp;&nbsp; 
//               <span>${TemperatureConverter(weather.temp.min)}</span></span>`;
//             Forecast.append(div);
//           });
//         })
//         .catch((error) => {
//           console.error("Error fetching weather data:", error);
//         });
//     })
//     .catch((error) => {
//       console.error("Error fetching weather data:", error);
//     });
// }

// function formatUnixTime(epochTime, utcOffsetSeconds, options = {}) {
//   const date = new Date((epochTime + utcOffsetSeconds) * 1000);
//   return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
// }

// function getLongFormatUnixTime(epochTime, utcOffsetSeconds, options) {
//   return formatUnixTime(epochTime, utcOffsetSeconds, options);
// }

// function TemperatureConverter(temp) {
//   let cTemp = Math.round(temp);
//   let message = "";
//   if (converter.value == "°C") {
//     message = cTemp + " <span>" + "\xB0C</span>";
//   } else {
//     var cTof = (cTemp * 9) / 5 + 32;
//     message = cTof + " <span>" + "\xB0F</span>";
//   }
//   return message;
// }