// Declare variables for tile layers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

var esriImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var darkLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; CartoDB'
});

// Declare variables for overlay layers
var hospitals;

// Initialize the Leaflet map and add layers
var map = L.map('map', {
  layers: [osm], // Initial base layer
});

var baseMaps = {
  "OpenStreetMap": osm,
  "ESRI World Imagery": esriImagery,
  "Dark Map": darkLayer
};

L.control.layers(baseMaps).addTo(map);

// Fetch GeoJSON data and create GeoJSON layer
fetch("hospital_edit.geojson")
  .then(response => response.json())
  .then(data => {
    hospitals = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
      }
    });

    // Add hospitals GeoJSON layer to the map
    hospitals.addTo(map);

    // Fit the map bounds to the GeoJSON data
    map.fitBounds(hospitals.getBounds());
  })
  .catch(error => console.error('Error fetching GeoJSON data:', error));

// Add a custom legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<h4>Legend</h4>';
  div.innerHTML += '<p><strong>Hospitals</strong></p>';
  div.innerHTML += '<p><i class="fas fa-hospital"></i> Hospital</p>'; // You can use an icon or text

  return div;
};

legend.addTo(map);
