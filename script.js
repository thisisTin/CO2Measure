// Dashboard script — handles map, gauges, charts, updates, and CSV export
console.log('dashboard script loaded');

// CSV data array — only header initially
let csvData = [["timestamp","co2","aqi","temp","hum","io"]];

// Initialize map
const map = L.map('map').setView([21.0285, 105.854], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let markers = [];

// Create gauge
function createGauge(ctx, color) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: { datasets: [{ data: [0,100], backgroundColor: [color,'rgba(255,255,255,0.05)'], borderWidth: 0 }] },
    options: { rotation: -90, circumference: 180, cutout: '75%', plugins:{legend:{display:false}, tooltip:{enabled:false}} }
  });
}

// Gauges
const co2Gauge = createGauge(document.getElementById('co2Gauge'), '#2ecc71');
const aqiGauge = createGauge(document.getElementById('aqiGauge'), '#f1c40f');
const tempGauge = createGauge(document.getElementById('tempGauge'), '#ff8c42');
const humGauge = createGauge(document.getElementById('humGauge'), '#3498db');

// Charts
const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#fff' } } },
  scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } }
};

function makeLineChart(id, label, color, fill=true) {
  return new Chart(document.getElementById(id), {
    type: 'line',
    data: { labels: [], datasets: [{ label: label, data: [], borderColor: color, backgroundColor: fill ? color+'22' : color, fill: fill, tension: 0.35 }] },
    options: chartOpts
  });
}

const co2Chart = makeLineChart('co2Chart', 'CO₂ (ppm)', '#2ecc71');
const aqiChart = makeLineChart('aqiChart', 'AQI', '#f1c40f');
const ioChart  = makeLineChart('ioChart',  'IO', '#ff7f50', false);
const tempChart= makeLineChart('tempChart','Temp (°C)', '#ff8c42');
const humChart = makeLineChart('humChart', 'Humidity (%)', '#3498db');

// IO
let ioState = 0;
document.getElementById('io-toggle').addEventListener('click', ()=>{
  ioState = ioState ? 0 : 1;
  document.getElementById('io-bar').style.width = ioState ? '100%' : '0%';
  document.getElementById('io-bar').classList.toggle('on', ioState);
  document.getElementById('io-text').textContent = ioState ? 'ON' : 'OFF';
  pushIO(ioState);
});

function pushIO(v) {
  const t = new Date().toLocaleTimeString();
  ioChart.data.labels.push(t);
  ioChart.data.datasets[0].data.push(v);
  if(ioChart.data.labels.length>30) { ioChart.data.labels.shift(); ioChart.data.datasets[0].data.shift(); }
  ioChart.update();
}

// Download CSV
document.querySelector('.download-btn').addEventListener('click', ()=>{
  let csvContent = csvData.map(e => e.join(",")).join("\r\n"); // Xuống dòng chuẩn Windows
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});


// Update function
async function updateDashboard() {
  const d = await fetchSensorData();

  const tNow = new Date().toLocaleString(); // readable local time
  csvData.push([tNow, d.co2, d.aqi, d.temp, d.hum, ioState]);
  if (csvData.length > 300) csvData.splice(1,1); // limit size

  // Gauges
  co2Gauge.data.datasets[0].data = [d.co2, 2000-d.co2];
  co2Gauge.update();
  document.getElementById('co2-value').textContent = d.co2;

  aqiGauge.data.datasets[0].data = [d.aqi, 500-d.aqi];
  aqiGauge.update();
  document.getElementById('aqi-value').textContent = d.aqi;

  tempGauge.data.datasets[0].data = [d.temp, 60-d.temp];
  tempGauge.update();
  document.getElementById('temp-value').textContent = d.temp;

  humGauge.data.datasets[0].data = [d.hum, 100-d.hum];
  humGauge.update();
  document.getElementById('hum-value').textContent = d.hum;

  // Charts
  const t = new Date().toLocaleTimeString();
  function push(chart, value) {
    chart.data.labels.push(t);
    chart.data.datasets[0].data.push(value);
    if(chart.data.labels.length>30) { chart.data.labels.shift(); chart.data.datasets[0].data.shift(); }
    chart.update();
  }
  push(co2Chart, d.co2);
  push(aqiChart, d.aqi);
  push(tempChart, d.temp);
  push(humChart, d.hum);
  push(ioChart, ioState);

  // Map
  markers.forEach(m => map.removeLayer(m)); markers = [];
  d.sensors.forEach(s => {
    let m = L.marker([s.lat, s.lon]).addTo(map).bindPopup(
      `${s.name}<br>CO₂: ${s.co2} ppm<br>AQI: ${s.aqi}`
    );
    markers.push(m);
  });
}

updateDashboard();
setInterval(updateDashboard, 5000);
