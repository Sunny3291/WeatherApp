const userTab = document.querySelector(".urWeather");
const searchTab = document.querySelector(".searchWeather");
const getLocation = document.querySelector(".accessLocation");
const manualLocation = document.querySelector(".get-info-by-search")
const userInfo = document.querySelector(".your-info");
const loading = document.querySelector(".loading");
const accessCurrentLocation = document.querySelector(".accessLocation");



let currentTab = userTab;
const API_KEY = '8c702f8c8e7b0f362e2917647a0a1d4e';

currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
    if (clickedTab != currentTab)
    {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if (!manualLocation.classList.contains("active"))
        {
            userInfo.classList.remove("active");
            getLocation.classList.remove("active");
            manualLocation.classList.add("active");   
        }

        else {
            manualLocation.classList.remove("active");
            userInfo.classList.add("active");
            console.log("heelo");
            getLocalCoordinates();
        }
    }
}

userTab.addEventListener('click', () => {
    userInfo.classList.remove("margin");
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    userInfo.classList.add("margin");
    switchTab(searchTab);
});


function getLocalCoordinates() {
    const localCordinates = sessionStorage.getItem("user-coordinates");
    if(!localCordinates)
    {
        accessCurrentLocation.classList.add("active");
        
        
    }
    else {
        const coordinates = JSON.parse(localCordinates);
        getCurrentLocationInfo(coordinates);
        
    }
};

async function getCurrentLocationInfo(coordinates) {
    const {lat, lon} = coordinates;
    getLocation.classList.remove("active");
    loading.classList.add("active");
    
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        const data = await response.json();
        loading.classList.remove("active");
        userInfo.classList.add("active");
        putDataIntoHTML(data);
    }
    catch(err) {
        loading.classList.remove("active");
    }
}

function putDataIntoHTML(weatherInfo) {
    
    const city = document.querySelector("[data-city]");
    const country = document.querySelector(".coutry");
    const description = document.querySelector("[data-description]");
    const temperature = document.querySelector("[data-temp]");
    const tempLogo = document.querySelector("[data-tempLogo]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");

    console.log(weatherInfo?.name);
    city.innerText = weatherInfo?.name;
    country.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    
    description.innerText = weatherInfo?.weather?.[0]?.description;
    temperature.innerText = weatherInfo?.main?.temp+'°C';
    tempLogo.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    windSpeed.innerText = weatherInfo?.wind?.speed+' m/s';
    humidity.innerText = weatherInfo?.main?.humidity+'%';
    cloud.innerText = weatherInfo?.clouds?.all+'%';
}

const searchButton = document.querySelector(".btn");
const searchBox = document.querySelector("#search");

searchButton.addEventListener('click', () => {
    let cityName = searchBox.value;
    searchByCityName(cityName);
})

async function fetchByCity(city)
{
    try 
    {   
       
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await  response.json();
        loading.classList.remove("active"); 
        userInfo.classList.add("active");
        putDataIntoHTML(data);
    }
    catch(e)
     {
    
    }
           
}

function searchByCityName(city) {
    if(city == '')
    {
        return;
    }
    else
     {
        loading.classList.add("active");
        fetchByCity(city);
        
    }
    
};

const grantLocation = document.querySelector(".grantbtn");

function fetchCoordinates() {
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
        
    }
    else{
        return;
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    getLocalCoordinates(userCoordinates);
    
};

grantLocation.addEventListener('click', fetchCoordinates);
getLocalCoordinates();