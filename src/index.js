function CtoF(celsius){
    return (1.8*celsius+32);
}

const params = new URLSearchParams({
	latitude: 40.743440,
	longitude: -73.752655,
	daily: `temperature_2m_max,temperature_2m_mean,temperature_2m_min`,
	hourly: "temperature_2m",
	minutely_15: `temperature_2m`,

});
const url = `https://api.open-meteo.com/v1/forecast?${params}`;
const response = await fetch(url);
console.log(await response.json());

/*
// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();
const current = response.current();

console.log(CtoF(current.variables(0).value()));
console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);
*/
/*
const hourly = response.hourly();

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	hourly: {
		time: Array.from(
			{ length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
			(_ , i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0).valuesArray(),
	},
};

// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
console.log("\nHourly data:\n", weatherData.hourly)
*/