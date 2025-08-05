async function fetchSensorData() {
    let lat = 10.794, lon = 106.682; 
    if (navigator.geolocation) {
        await new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(pos => {
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
                resolve();
            }, () => resolve());
        });
    }

    return {
        co2: Math.floor(Math.random() * 200) + 400,
        aqi: Math.floor(Math.random() * 50) + 30,
        sensors: [
            { name: "You are here", lat, lon, co2: 420, aqi: 45 },
            { name: "Sensor 2", lat: lat + 0.01, lon: lon + 0.01, co2: 530, aqi: 78 },
            { name: "Sensor 3", lat: lat - 0.01, lon: lon - 0.01, co2: 480, aqi: 62 }
        ]
    };
}
