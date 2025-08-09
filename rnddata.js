
// Simulated sensor data for demo
async function fetchSensorData() {
  // randomish values; adjust ranges as needed
  const co2 = Math.floor(Math.random()*300) + 380;    // 380-680 ppm
  const aqi = Math.floor(Math.random()*120) + 20;     // 20-140
  const temp = Math.floor(Math.random()*12) + 20;     // 20-32 °C
  const hum = Math.floor(Math.random()*50) + 30;      // 30-80 %
  return {
    co2, aqi, temp, hum,
    sensors: [
      {name:'Sensor 1', lat:21.0285, lon:105.854, co2:co2, aqi:aqi},
      {name:'Sensor 2', lat:21.0320, lon:105.852, co2:co2+30, aqi:aqi+10},
      {name:'Sensor 3', lat:21.0350, lon:105.850, co2:co2-20, aqi:aqi-5}
    ]
  };
}
