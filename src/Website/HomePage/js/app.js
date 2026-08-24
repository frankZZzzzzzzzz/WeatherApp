import { getAllData } from "./WeatherAPI.js"
let Scrolling = false;
let yPos;

//Data
const hourlyBars = [];
const dailyBars = [];

//Weather Codes 
const assetPath = "../../Assets/"
const WeatherCodes= [
    [[0],       assetPath+"Clear_Sky.png"],
    [[1,2,3],   assetPath+"Partially_Foggy.png"],
    [[45,48],   assetPath+"Foggy.png"],
    [[51,53,55],assetPath+"Drizzle.png"],
    [[56,57],   assetPath+"Freezing_Drizzle.png"],
    [[61,63,65],assetPath+"Rain.png"],
    [[66,67],   assetPath+"Freezing_Rain.png"],
    [[71,73,75],assetPath+"Snow_Fall.png"],
    [[77],      assetPath+"Snow_Grain.png"], //
    [[80,81,82],assetPath+"Rain_Shower.png"],
    [[85,86],   assetPath+"Snow_Shower.png"],
    [[95],      assetPath+"Thunderstorm.png"],
    [[96,99],   assetPath+"Thunderstorm_Hail.png"],
]
/* 
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
*/
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
        dayTile.textContent = `Loading...`;

        dayGrid.append(dayTile);
        dailyBars.push(dayTile);
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
        hourTemp.textContent = `Loading H${i} temp`;

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

    const weatherImg = document.querySelector("img")
    const codeMatch = WeatherCodes.find((weatherArr) => {
        const codes = weatherArr[0];
        for (const code of codes)
            if (code === currentData.weather_code)
                return true;
        return false;
    });
    weatherImg.src = codeMatch[1];

    const currPrecipitation = document.getElementById("precipitation");
    currPrecipitation.innerHTML = `Precipitation: ${currentData.precipitation_probability}${precipitationUnit}`;

    const currHumidity = document.getElementById("humidity");
    currHumidity.innerHTML = `Humidity: ${currentData.relative_humidity_2m}${humidityUnit}`;
}
function loadDailyData(data){
    const Data = data.daily;
    const Units = data.daily_units;

    for (let i = 0; i < dailyBars.length; i++){
        const time = Data.time[i];
        const index = time.indexOf('-');

        dailyBars[i].innerHTML = 
            `<span>
                <span class="daily-date">${time.substring(index+1)}</span><br><br>
                ${Data.temperature_2m_mean[i] + Units.temperature_2m_mean}<br>
                <span class="daily-small-text">
                    (${Data.temperature_2m_min[i]}-${Data.temperature_2m_max[i]})
                </span>
            </span>`
    }
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
    while (index < hourlyData.time.length && hourlyData.time[index] < currentTime)
        index++;

    for (let i = 0; i < 24; i++){
        const currHour = hourlyBars.at(i);

        const hourTemp = currHour.temp;
        let hour = new Date(hourlyData.time[i+index]+"Z").getHours();
        let time = `${hour % 12 || 12}:00 ${(hour >= 12 ) ? "PM" : "AM"}`;
        hourTemp.innerHTML = `<span class="Hour-Time">${time}</span>
                    <span class="Hour-Temp">
                        ${hourlyData.temperature_2m[i+index]} ${tempUnit} = 
                        ${CtoF(hourlyData.temperature_2m[i+index]).toFixed(1)}F
                    </span>`;

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
    loadDailyData(Data);
    loadCurrentData(Data);
    loadHourlyData(Data);
    console.log("Done");
}
window.onload = initialize;