
// set up map in the choropleth.js file
var map = L.map('choropleth').setView([51.505, -0.09], 10);

// create tile layer, add to map
var cartocdn = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL',
  maxZoom: 18,
}).addTo(map);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var concept = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// colour function
function getColour(d) {
    return d > 0.55 ? '#3166a7' :
           d > 0.51 ? '#1d91c0' :
           d > 0.48 ? '#7fcdbb' :
           d > 0.44 ? '#c7e9b4' :
                      '#edf8b1' ;
};

// style function
function style(feature) {
    return {
        fillColor: getColour(feature.properties.employment_rate),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
};

// add London wards
L.geoJson(msoa,{style: style});
// define variable
var msoa;


// zoom to feature function
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
};


// apply listeners on each polygon
function popupAttri(e){
    var ourPopup = '<b>Area Code: </b>' + e.target.feature.properties.msoa11cd + '<br>'+'<b>London MSOA: </b>' + e.target.feature.properties.msoa11nm + '<br>'+'<b>Employment Rate: </b>' + e.target.feature.properties.employment_rate;
    msoa.bindPopup(ourPopup).openPopup(e.target);

    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.1
    });
};

function closepopup(e) {
    msoa.closePopup(e.target);
    msoa.resetStyle(e.target);
};

function onEachFeature(feature, layer) {
    layer.on({
      click: zoomToFeature,
      mouseover: popupAttri,
      mouseout: closepopup,
    });
};

msoa = L.geoJson(msoa, {
    style: style,
    onEachFeature: onEachFeature,
}).addTo(map);


// add London wards
L.geoJson(lsoa,{style: style});
// define variable
var lsoa;

// apply listeners on each polygon
function popupAttri2(e){
    var ourPopup = '<b>Area Code: </b>' + e.target.feature.properties.lsoa11cd + '<br>'+'<b>London LSOA: </b>' + e.target.feature.properties.lsoa11nm + '<br>'+'<b>Employment Rate: </b>' + e.target.feature.properties.employment_rate;
    lsoa.bindPopup(ourPopup).openPopup(e.target);

    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.1
    });
};

function closepopup2(e) {
    lsoa.closePopup(e.target);
    lsoa.resetStyle(e.target);
};

// apply listeners on each polygon
function onEachFeature2(feature, layer) {
    layer.on({
      click: zoomToFeature,
      mouseover: popupAttri2,
      mouseout: closepopup2,
    });
};

lsoa = L.geoJson(lsoa, {
    style: style,
    onEachFeature: onEachFeature2
});


var legend = L.control({position: 'bottomright'});

// create legend function
legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.44, 0.48, 0.51, 0.55],
        colors = ['#edf8b1', '#c7e9b4', '#7fcdbb', '#1d91c0', '#3166a7']
        labels = []
    // loop through our density intervals and generate a label with a colored square for each interval

    div.innerHTML = '<b><big class="title">Employment rate</big></b><br/>' + '<em class="title">(among total population)</em><br/>';
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// add to map
legend.addTo(map);

var legend2 = L.control({position: 'bottomright'});

// create legend function
legend2.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0],
        labels = []
    // loop through our density intervals and generate a label with a colored square for each interval

    div.innerHTML = '<b><big class="title">Fast-food outlets</big></b><br/>' ;
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
      '<i class="circle" style="background: black"></i> '+ '<b class="title">individual geolocation</b><br/>';

    }
    return div;
};

// add to map
legend2.addTo(map);



const outletLayer = L.geoJSON(fast_food,{
  pointToLayer: function(feature, latlng){
    return L.circle(latlng, {
      color: 'black',
      fillColor: 'black',
      fillOpacity: 1,
      weight: 0.1,
      radius: 0.8,
    })
  }
}).addTo(map);


var basemaps = {
  'CARTO': cartocdn,
  'OSM': osm,
  'CITY': concept,
};

var overlayMaps = {
  "MSOA-LEVEL EMPLOYMENT": msoa,
  "LSOA-LEVEL EMPLOYMENT":lsoa,
  "FAST FOOD OUTLETS": outletLayer,
};

L.control.layers(basemaps, overlayMaps).addTo(map);
