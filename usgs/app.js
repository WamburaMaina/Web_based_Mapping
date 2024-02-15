var map = L.map('map').setView([0, 0], 2);

// Add base tile layers
var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
});

var darkLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    attribution: '© CartoDB'
});

// Add layers control
var baseLayers = {
    "Street Map": streetLayer,
    "Satellite Map": satelliteLayer,
    "Dark Map": darkLayer
};

L.control.layers(baseLayers).addTo(map);

// Add legend
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h4>Legend</h4>';
    div.innerHTML += '<p><span class="legend-marker" style="background-color: #FF0000;"></span> Major Earthquake</p>';
    div.innerHTML += '<p><span class="legend-marker" style="background-color: #FFD700;"></span> Moderate Earthquake</p>';
    div.innerHTML += '<p><span class="legend-marker" style="background-color: #00FF00;"></span> Minor Earthquake</p>';
    return div;
};

legend.addTo(map);

// Fetch earthquake data from USGS API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var magnitude = feature.properties.mag;
                var markerColor = getMarkerColor(magnitude);
                return L.circleMarker(latlng, {
                    radius: magnitude * 3,
                    fillColor: markerColor,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<b>Magnitude:</b> ' + feature.properties.mag + '<br><b>Location:</b> ' + feature.properties.place);
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to get marker color based on earthquake magnitude
function getMarkerColor(magnitude) {
    if (magnitude >= 7) {
        return '#FF0000'; // Major Earthquake
    } else if (magnitude >= 5) {
        return '#FFD700'; // Moderate Earthquake
    } else {
        return '#00FF00'; // Minor Earthquake
    }
}
