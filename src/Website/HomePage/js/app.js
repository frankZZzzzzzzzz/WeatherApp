import { getAllData } from "./WeatherAPI.js"

let Scrolling = false;
let yPos;

//Data
const hourlyBars = [];
const dailyBars = [];

window.onmousedown = (e) => {
    Scrolling = true;
    yPos = e.clientY;
}
window.onmousemove = (e) => {
    /*window.scroll(window.scrollY + e.clientY);*/
    if (Scrolling){
        window.scrollBy(0, yPos-e.clientY);
        yPos = e.clientY;
    }
}
window.onmouseup = () => {
    Scrolling = false;
}
function CtoF(degree){
    return (degree*1.8+32);
}
function initializeDays(){
    const dayGrid = document.getElementById(`daily-grid`);
    for (let i = 0; i < 7; i++){
        const dayTile = document.createElement('div');
        dayTile.id = `day${i}`;
        dayTile.className = `daily-weather`;
        dayTile.textContent = `dayidk`;

        dayGrid.append(dayTile);
    }
}
function initializeHours(){
    let hourGrid = document.getElementById(`hourly-grid`);
    for (let i = 0; i < 24; i++){
        const hourBar = document.createElement(`div`);
        hourBar.id = `hour${i}-bar`;
        hourBar.className = `hourly-bar`;

        const hourTemp = document.createElement(`div`);
        hourTemp.id = `hour${i}-temp`;
        hourTemp.className = `hourly-temp`;
        hourTemp.textContent = `H${i} temp`;

        const hourInfo = document.createElement(`div`);
        hourInfo.id = `hour${i}-info`;
        hourInfo.className = `hourly-info hidden`;
        hourInfo.textContent = `hourly-info`;
        
        hourGrid.append(hourBar);
        hourBar.append(hourTemp, hourInfo);
        hourBar.onclick = () => {hourInfo.classList.toggle(`hidden`)};

        hourlyBars.push({
            bar: hourBar,
            temp: hourTemp,
            info: hourInfo
        });
    }
}
function loadCurrentData(data){
    let currentData = data.current;

    let units = data.current_units;
    let tempUnit = units.temperature_2m;
    let precipitationUnit = units.precipitation_probability;
    let humidityUnit = units.relative_humidity_2m;

    const currTemp = document.getElementById("current-temp");
    currTemp.innerHTML = `${currentData.temperature_2m}<span id="unit-font">${tempUnit}</span>`;

    const currPrecipitation = document.getElementById("precipitation");
    currPrecipitation.innerHTML = `${currentData.precipitation_probability} ${precipitationUnit}`;

    const currHumidity = document.getElementById("humidity");
    currHumidity.innerHTML = `${currentData.relative_humidity_2m} ${humidityUnit}`;
}
function loadHourlyData(data){
    let hourlyData = data.hourly;

    let units = data.hourly_units;
    let tempUnit = units.temperature_2m;
    let precipitationUnit = units.precipitation_probability;
    let humidityUnit = units.relative_humidity_2m;

    let index = 0;
    
    const now = new Date();
    let currentTime = now.toISOString();
    while (hourlyData.time[index] < currentTime && index < hourlyData.time.length)
        index++;


    for (let i = 0; i < 24; i++){
        const currHour = hourlyBars.at(i);

        const hourTemp = currHour.temp;
        let hour = new Date(hourlyData.time[i+index]+"Z").getHours();
        let time = `${hour % 12 || 12}:00 ${(hour > 12 ) ? "PM" : "AM"}`;
        hourTemp.innerHTML = `<span class="Hour-Time">${time}<span> 
                    <span class="Hour-Temp">${hourlyData.temperature_2m[i+index]} ${tempUnit} = ${CtoF(hourlyData.temperature_2m[i+index]).toFixed(1)}F<span>`;

        const hourInfo = currHour.info;
        hourInfo.innerHTML = `Precipitation: ${hourlyData.precipitation_probability[i+index]}${precipitationUnit} <br>
                                Humidity: ${hourlyData.relative_humidity_2m[i+index]}${humidityUnit}`;
    }
}
function getLocation(){
    return (new Promise((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition(resolve,reject)}));
}
async function initialize() {
    initializeHours();
    initializeDays();

    let longitude = -80//74.0060;
    let latitude = 65//40.7128;
    try{
        let position = await getLocation();
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        console.log(position);
    } catch(error){
        return;
    }
    const Data = await getAllData(longitude,latitude);
    //
    //loadDailyData(Data);
    loadCurrentData(Data);
    loadHourlyData(Data);
    console.log("Done");
}
window.onload = initialize;