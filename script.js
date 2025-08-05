// ====== MAP ======
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];

// Hàm fallback nếu không có GPS
function setDefaultLocation() {
    const lat = 10.762622;  // Ví dụ: TPHCM
    const lon = 106.660172;
    map.setView([lat, lon], 15);
    const userMarker = L.marker([lat, lon]).addTo(map)
        .bindPopup("📍 Default location (GPS unavailable)")
        .openPopup();
    markers.push(userMarker);
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // Set map view tới vị trí hiện tại
            map.setView([lat, lon], 15);

            // Đánh dấu vị trí hiện tại
            const userMarker = L.marker([lat, lon]).addTo(map)
                .bindPopup("📍 You are here")
                .openPopup();

            markers.push(userMarker);
        },
        err => {
            console.warn("Can't get location:", err.message);
            setDefaultLocation();
        },
        { timeout: 5000 }
    );
} else {
    console.error("Unable to connect to location services");
    setDefaultLocation();
}
