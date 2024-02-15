// Check if Leaflet is defined
if (typeof L !== 'undefined') {
  // Initialize the map
  var map = L.map('map').setView([0, 0], 2);

  // Add tile layers
  var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  });

  var darkLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    attribution: '© CartoDB'
  });

  // Create a legend
 // Create a legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<h4>Legend</h4>';
  div.innerHTML += '<p>Real-time Events</p>';
  div.innerHTML += '<p><i style="background-color: #007bff; width: 15px; height: 15px; display: inline-block;"></i> Earthquake Marker</p>';
  return div;
};

legend.addTo(map);


  // Fetch and add real-time events data
  fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data);

      // Check if 'features' property exists in the response
      if (data && data.features && Array.isArray(data.features)) {
        // Access the earthquake events data from the response
        var events = data.features;

        // Loop through the events and create markers with popups
        events.forEach(event => {
          // Check if 'geometry' and 'coordinates' properties exist in the event
          if (event.geometry && event.geometry.coordinates) {
            var [lon, lat] = event.geometry.coordinates;

            // Create a marker with a popup
            var marker = L.marker([lat, lon]).addTo(map);
            
            // Customize the marker based on earthquake magnitude or other data
            var magnitude = event.properties.mag;
            var color = getMarkerColor(magnitude);
            marker.setIcon(L.divIcon({ className: 'custom-marker', html: `<div style="background-color: ${color};">${magnitude}</div>` }));
            
            // Create a popup with additional information
            var popupContent = `<strong>${event.properties.place}</strong><br/>Magnitude: ${magnitude}`;
            marker.bindPopup(popupContent);
          } else {
            console.warn('Invalid event data (missing coordinates):', event);
          }
        });
      } else {
        console.error('Invalid data structure:', data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
} else {
  console.error('Leaflet library not loaded.');
}

// Function to determine marker color based on magnitude
function getMarkerColor(magnitude) {
  // Customize this function to define color based on your requirements
  if (magnitude < 3) {
    return '#00ff00'; // Green
  } else if (magnitude < 5) {
    return '#ffff00'; // Yellow
  } else {
    return '#ff0000'; // Red
  }
}
