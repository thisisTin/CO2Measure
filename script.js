console.log("🚀 script.js loaded");

// ====== MAP ======
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        map.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(map).bindPopup("📍 You are here").openPopup();
    }, err => {
        console.error("❌ Can't get location:", err);
    });
}

// ====== GAUGES ======
function createGauge(ctx, label, max) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [label, ""],
            datasets: [{
                data: [0, max],
                backgroundColor: ['#2ecc71', '#ecf0f1'],
                borderWidth: 0
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            cutout: '80%',
            plugins: { legend: { display: false } }
        }
    });
}

const co2Gauge = createGauge(document.getElementById("co2Gauge"), "CO2", 2000);
const aqiGauge = createGauge(document.getElementById("aqiGauge"), "AQI", 300);

// ====== CHARTS ======
const chartOptions = { responsive: true, maintainAspectRatio: false };
const co2Chart = new Chart(document.getElementById("co2Chart"), {
    type: 'line',
    data: { labels: [], datasets: [{ label: "CO2", data: [], borderColor: "#3498db", fill: true }] },
    options: chartOptions
});
const aqiChart = new Chart(document.getElementById("aqiChart"), {
    type: 'line',
    data: { labels: [], datasets: [{ label: "AQI", data: [], borderColor: "#9b59b6", fill: true }] },
    options: chartOptions
});

// ====== UPDATE DASHBOARD ======
async function updateDashboard() {
    const data = await fetchSensorData();

    // Gauges
    co2Gauge.data.datasets[0].data[0] = data.co2;
    co2Gauge.data.datasets[0].data[1] = 2000 - data.co2;
    co2Gauge.data.datasets[0].backgroundColor[0] = data.co2 < 600 ? '#2ecc71' : data.co2 < 1000 ? '#f39c12' : '#e74c3c';
    co2Gauge.update();

    aqiGauge.data.datasets[0].data[0] = data.aqi;
    aqiGauge.data.datasets[0].data[1] = 300 - data.aqi;
    aqiGauge.data.datasets[0].backgroundColor[0] = data.aqi < 50 ? '#2ecc71' : data.aqi < 100 ? '#f39c12' : '#e74c3c';
    aqiGauge.update();

    document.getElementById("co2-value").textContent = `${data.co2} ppm`;
    document.getElementById("aqi-value").textContent = `${data.aqi}`;
    document.getElementById("co2-status").textContent = data.co2 < 600 ? "Good" : data.co2 < 1000 ? "Moderate" : "Poor";
    document.getElementById("aqi-status").textContent = data.aqi < 50 ? "Good" : data.aqi < 100 ? "Moderate" : "Poor";

    // Charts
    const now = new Date().toLocaleTimeString();
    co2Chart.data.labels.push(now);
    co2Chart.data.datasets[0].data.push(data.co2);
    if (co2Chart.data.labels.length > 20) { co2Chart.data.labels.shift(); co2Chart.data.datasets[0].data.shift(); }
    co2Chart.update();

    aqiChart.data.labels.push(now);
    aqiChart.data.datasets[0].data.push(data.aqi);
    if (aqiChart.data.labels.length > 20) { aqiChart.data.labels.shift(); aqiChart.data.datasets[0].data.shift(); }
    aqiChart.update();
}

updateDashboard();
setInterval(updateDashboard, 5000);
