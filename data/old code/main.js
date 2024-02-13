const map = L.map('map').setView([-0.1, 36.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Replace 'kenya_rainfall.geojson' with the correct relative or absolute path to your Rainfall GeoJSON file
$.getJSON("kenya_rainfall.geojson", function (rainfallData) {
    console.log("Rainfall GeoJSON data loaded:", rainfallData);

    // Define breaks and colors for rainfall
    let rainfallBreaks = [-Infinity, 21, 41, 61, 81, Infinity];
    let rainfallColors = ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'];

 // Function to get color based on rainfall breaks
const getColor = (value) => {
    console.log("Value:", value, "Breaks:", rainfallBreaks, "Colors:", rainfallColors);

    for (let i = 0; i < rainfallBreaks.length; i++) {
        if (value > rainfallBreaks[i] && value <= rainfallBreaks[i + 1]) {
            return rainfallColors[i];
        }
    }

    return 'gray'; // Provide a default color if no match is found
};



    const rainfallLayer = L.geoJSON(rainfallData, {
        style: function (feature) {
            return {
                fillColor: getColor(feature.properties.rainfall),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function (feature, layer) {
            const popupContent = `
                <p><strong>${feature.properties.name}</strong></p>
                <p>Temperature: ${feature.properties.temperature} °C</p>
                <p>Rainfall: ${feature.properties.rainfall} mm</p>
            `;
            layer.bindPopup(popupContent);
        }
    }).addTo(map);

    const rainfallLegend = L.control({ position: 'bottomright' });
    rainfallLegend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<p>Rainfall Legend:</p>';

        for (let i = 0; i < rainfallBreaks.length - 1; i++) {
            div.innerHTML +=
                '<i style="background:' + rainfallColors[i] + '"></i> ' +
                rainfallBreaks[i] + (rainfallBreaks[i + 1] ? '&ndash;' + rainfallBreaks[i + 1] + '<br>' : '+');
        }

        return div;
    };
    rainfallLegend.addTo(map);

    // Add layer control for the OSM Base Map and Rainfall Data
    L.control.layers({
        "OSM Base Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }),
    }, { "Rainfall Data": rainfallLayer, "Rainfall Legend": rainfallLegend }).addTo(map);
});
