// rnddata.js — Simulate data from ESP32 or API server
async function fetchSensorData() {
    // Simulate random data:
    //const ioState = Math.random() < 0.5 ? 0 : 1; // 0 = OFF, 1 = ON

    return {
        co2: Math.floor(Math.random() * 200) + 400,    // ppm
        aqi: Math.floor(Math.random() * 50) + 30,      // AQI
        //io: ioState, // 0 or 1

        sensors: [
            { name: "Sensor 1", lat: 51.505, lon: -0.09, co2: 420, aqi: 45, io: ioState },
            { name: "Sensor 2", lat: 51.51, lon: -0.1, co2: 530, aqi: 78, io: ioState },
            { name: "Sensor 3", lat: 51.49, lon: -0.08, co2: 480, aqi: 62, io: ioState }
        ]
    };
}
