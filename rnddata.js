// Simulated sensor data
async function fetchSensorData() {
    return {
        co2: Math.floor(Math.random() * 200) + 400, // ppm
        aqi: Math.floor(Math.random() * 50) + 30,   // AQI
        sensors: [
            { name: "Sensor 1", lat: 51.505, lon: -0.09, co2: 420, aqi: 45 },
            { name: "Sensor 2", lat: 51.51, lon: -0.1, co2: 530, aqi: 78 },
            { name: "Sensor 3", lat: 51.49, lon: -0.08, co2: 480, aqi: 62 }
        ]
    };
}
