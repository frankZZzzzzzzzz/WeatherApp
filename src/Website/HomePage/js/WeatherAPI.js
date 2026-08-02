const url = `https://api.open-meteo.com/v1/forecast?`;

export async function getAllData(longitude, latitude){
    const params = new URLSearchParams({
        longitude: longitude.toFixed(5),
        latitude: latitude.toFixed(5),
        timezone: "UTC",
        daily: `temperature_2m_max,temperature_2m_mean,temperature_2m_min`,
        hourly: "temperature_2m,relative_humidity_2m,precipitation_probability",
        minutely_15: `temperature_2m`,
        current: "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code",
    })
    const response = await fetch(url + params);
    const data = await response.json();
    return (data);
}