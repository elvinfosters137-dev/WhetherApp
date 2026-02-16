function WeatherApp(apiKey) {
  this.apiKey = apiKey;
  this.baseUrl = "https://api.openweathermap.org/data/2.5/";
}
WeatherApp.prototype.getCurrentWeather = function (city) {
  return fetch(`${this.baseUrl}weather?q=${city}&appid=${this.apiKey}&units=metric`)
    .then(res => res.json());
};
WeatherApp.prototype.getForecast = function (city) {
  return fetch(`${this.baseUrl}forecast?q=${city}&appid=${this.apiKey}&units=metric`)
    .then(res => res.json());
};
WeatherApp.prototype.getWeatherData = function (city) {
  return Promise.all([
    this.getCurrentWeather(city),
    this.getForecast(city)
  ]);
};
WeatherApp.prototype.displayCurrentWeather = function (data) {
  document.getElementById("current").innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
  `;
};
WeatherApp.prototype.displayForecast = function (data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <h4>${new Date(day.dt_txt).toDateString()}</h4>
      <p>${day.main.temp}°C</p>
      <p>${day.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
    `;

    forecastContainer.appendChild(card);
  });
};
WeatherApp.prototype.search = function (city) {
  this.getWeatherData(city)
    .then(([current, forecast]) => {
      this.displayCurrentWeather(current);
      this.displayForecast(forecast);
    })
    .catch(err => console.error(err));
};
