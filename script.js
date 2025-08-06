// ====== MAP ======
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];

// GPS on map
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        map.setView([lat, lon], 15);

        const userMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup("📍 You are here")
            .openPopup();

        markers.push(userMarker);
    }, err => {
        console.error("Can't get location:", err);
    });
}

// ====== GAUGES ======
// CO2
let co2Opts = { angle: 0, lineWidth: 0.2, radiusScale: 1, pointer: { length: 0.6, strokeWidth: 0.035, color: '#000' } };
let co2Gauge = new Gauge(document.getElementById("co2Gauge")).setOptions(co2Opts);
co2Gauge.maxValue = 2000;
co2Gauge.setMinValue(0);
co2Gauge.set(0);

// AQI
let aqiOpts = { angle: 0, lineWidth: 0.2, radiusScale: 1, pointer: { length: 0.6, strokeWidth: 0.035, color: '#000' } };
let aqiGauge = new Gauge(document.getElementById("aqiGauge")).setOptions(aqiOpts);
aqiGauge.maxValue = 300;
aqiGauge.setMinValue(0);
aqiGauge.set(0);

// ====== CHARTS ======
const chartOptions = { responsive: true, maintainAspectRatio: false };

const co2Chart = new Chart(document.getElementById("co2Chart"), {
    type: 'line',
    data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{ label: "CO2", data: randomData(400, 600, 24), borderColor: "#3498db", fill: true }]
    },
    options: chartOptions
});

const aqiChart = new Chart(document.getElementById("aqiChart"), {
    type: 'line',
    data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{ label: "AQI", data: randomData(30, 80, 24), borderColor: "#9b59b6", fill: true }]
    },
    options: chartOptions
});

// ====== FUNCTIONS ======
function randomData(min, max, count) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min));
}

function updateStatus(id, value, goodMax, moderateMax) {
    const el = document.getElementById(id);
    if (value < goodMax) { el.textContent = "Good"; el.className = "status good"; }
    else if (value < moderateMax) { el.textContent = "Moderate"; el.className = "status moderate"; }
    else { el.textContent = "Poor"; el.className = "status poor"; }
}

// ====== UPDATE DATA EVERY 5S ======
async function updateDashboard() {
    const data = await fetchSensorData();

    // Gauges
    co2Gauge.set(data.co2);
    aqiGauge.set(data.aqi);
    document.getElementById("co2-value").textContent = `${data.co2} ppm`;
    document.getElementById("aqi-value").textContent = `${data.aqi}`;
    updateStatus("co2-status", data.co2, 600, 1000);
    updateStatus("aqi-status", data.aqi, 50, 100);

    // Charts
    co2Chart.data.datasets[0].data.shift();
    co2Chart.data.datasets[0].data.push(data.co2);
    co2Chart.update();

    aqiChart.data.datasets[0].data.shift();
    aqiChart.data.datasets[0].data.push(data.aqi);
    aqiChart.update();
}

updateDashboard();
setInterval(updateDashboard, 5000);
