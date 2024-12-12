const wrapper = document.querySelector(".wrapper"),
      inputPart = document.querySelector(".input-part"),
      infoTxt = inputPart.querySelector(".info-txt"),
      inputField = inputPart.querySelector("input"),
      locationBtn = inputPart.querySelector("button"),
      weatherPart = wrapper.querySelector(".weather-part"),
      wIcon = weatherPart.querySelector("img"),
      arrowBack = wrapper.querySelector("header i");

let apiKey = "17e4695abc7391a37a5ef747d58ad685"; // API key
let api;

inputField.addEventListener("keyup", e => {
    if (e.key === "Enter" && inputField.value.trim() !== "") {
        requestApi(inputField.value.trim());
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser doesn't support geolocation API.");
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(api)
        .then(res => res.json())
        .then(result => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong. Please try again later.";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info) {
    if (info.cod === "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name.`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;

        // Weather Icon Selection
        wIcon.src = getWeatherIcon(id);

        // Update UI with fetched data
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

        // Clear the loading state and show weather info
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

// Function to return the correct weather icon based on the weather ID
function getWeatherIcon(id) {
    if (id === 800) return "icons/clear.svg";
    if (id >= 200 && id <= 232) return "icons/storm.svg";
    if (id >= 600 && id <= 622) return "icons/snow.svg";
    if (id >= 701 && id <= 781) return "icons/haze.svg";
    if (id >= 801 && id <= 804) return "icons/cloud.svg";
    if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) return "icons/rain.svg";
    return "icons/default.svg"; // Fallback icon if no match
}

// Back to initial state (clear weather info)
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
