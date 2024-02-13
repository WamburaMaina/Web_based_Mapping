let map = L.map("map", {
  center: [-0.1, 36.5],
  zoom: 6,
});

let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

let esriImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS,
      AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`,
  }
);

let baseMaps = {
  "OpenStreetMap": osm,
  "ESRI World Imagery": esriImagery,
};

let breaks = [-Infinity, 21, 41, 61, 81, Infinity];
let colors = ['#ffffd4','#fed98e','#fe9929','#d95f0e','#993404'];

const rainfall_color = (d) => {
  for (let i = 0; i < breaks.length; i++) {
    if (d > breaks[i] && d < breaks[i + 1]) {
      console.log(`Value: ${d}, Color: ${colors[i]}`);
      return colors[i];
    }
  }
  console.log(`Value: ${d}, Color: Default`);
// Use a default color if the value doesn't fall into any range
  return "default-color"; 
};


const rainfall_style = (feature) => {
  return {
    fillColor: rainfall_color(feature.properties.RAINFALL_I),
    color: "black",
    opacity: 1,
    fillOpacity: 0.7,
    weight: 0.5,
  };
};

fetch("kenya_rainfall.geojson")
  .then((response) => response.json())
  .then((data) => {
    L.geoJSON(data, {
      style: rainfall_style,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<div>RAINFALL: ${feature.properties.RAINFALL_I}</div>`);
      },
    }).addTo(map);
  });

L.control.layers(baseMaps).addTo(map);








