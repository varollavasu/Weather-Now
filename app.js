let map, searchManager, autosuggestManager;
const openWeatherApiKey = 'ac2382b9cff78389e310927bd2487e3c';

function loadMapScenario() {
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: 'AiC1qVLXKpSFxhgf2KNCr7CA33PWQaysMCpSKRgcM4EUycexYS274b4qVKF7ApzK',
        center: new Microsoft.Maps.Location(47.6062, -122.3321),
        zoom: 10
    });

    Microsoft.Maps.loadModule(['Microsoft.Maps.AutoSuggest', 'Microsoft.Maps.Search'], function () {
        initAutosuggest();
        initClickToGetAddress();
    });
}

function initAutosuggest() {
    const options = {
        maxResults: 5,
        map: map
    };
    autosuggestManager = new Microsoft.Maps.AutosuggestManager(options);
    autosuggestManager.attachAutosuggest('#searchBox', '#searchBoxContainer', suggestionSelected);
}

function suggestionSelected(result) {
    map.setView({ center: result.location, zoom: 15 });
    map.entities.clear();

    const pushpin = new Microsoft.Maps.Pushpin(result.location);
    map.entities.push(pushpin);

    document.getElementById('searchBox').value = result.address.formattedAddress;
    getWeather(result.location.latitude, result.location.longitude);
}

function initClickToGetAddress() {
    Microsoft.Maps.Events.addHandler(map, 'click', function (e) {
        const location = e.location;
        const point = map.tryPixelToLocation(e.pageX, e.pageY);
        map.setView({ center: location, zoom: 15 });

        const pushpin = new Microsoft.Maps.Pushpin(location);
        map.entities.push(pushpin);

        getWeather(location.latitude, location.longitude);
    });
}

function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const { temp, humidity } = data.main;
    const { description } = data.weather[0];

    weatherInfo.innerHTML = `
        <h2>Weather Information</h2>
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Description:</strong> ${description}</p>
    `;
}
