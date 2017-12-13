var raster = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'toner'
  })
});

// var vectorCountries = new ol.layer.Vector({
//   source: new ol.source.Vector({
//     url: 'data/countries.geojson',
//     format: new ol.format.GeoJSON()
//   })
// });
      
// var vectorKML = new ol.layer.Heatmap({
//   source: new ol.source.Vector({
//     url: 'data/eastcoast_29.09.2015.kml',
//     format: new ol.format.KML({
//       extractStyles: false
//     })
//   }),
//   blur: parseInt(blur.value, 10),
//   radius: parseInt(radius.value, 10)
// });

// vectorKML.getSource().on('addfeature', function(event) {
//   // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
//   // standards-violating <magnitude> tag in each Placemark.  We extract it from
//   // the Placemark's name instead.
//   var name = event.feature.get('name');
//   var magnitude = parseFloat(name.substr(2));
//   event.feature.set('weight', magnitude - 5);
// });


var map = new ol.Map({
  layers: [raster],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});


var source = new ol.source.Vector({
  wrapX: false
});
var vector = new ol.layer.Vector({
  source: source
});
map.addLayer(vector); //Draw the blue circles


var vectorHeat = new ol.layer.Heatmap({
  source: source,
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10)
});
map.addLayer(vectorHeat);


var featureRecord = [];
function addRandomFeature(arr) {
  
  // ind = index[j];
  // if (j === 0) {
  //   ind = index[j];
  //   var ms = res[ind].timestamp_ms;
  //   time_ms = parseInt(ms.slice(0,-3));
  // }
  // if (time_ms == parseInt(res[ind].timestamp_ms.slice(0,-3))){
    
    ind = index[j];
    
    if ( source.g >= feature_max && j>=feature_max){
      var oldindex = j - feature_max;
      source.removeFeature(featureRecord[oldindex]);
      featureRecord[oldindex] = null;
    }
  
    if ( currentTweets.length >= currentTweets_max){
      currentTweets = currentTweets.slice(1,currentTweets_max);
    }

    currentTweets.push(res[ind]);
    document.querySelector('#temp').items = currentTweets;
  
  
    var geom = new ol.geom.Point(ol.proj.transform([arr[j][1], arr[j][0]],
    'EPSG:4326', 'EPSG:3857'));
    var feature = new ol.Feature(geom);
    source.addFeature(feature);
    featureRecord.push(feature);
    
    document.querySelector('#utcLabel').textContent = res[ind].created_at + '  ' +  res[ind].timestamp_ms + '  ' +  time_ms;
  
    j = j+1;
  
  // }
  // time_ms = time_ms + 1;
  // document.querySelector('#utcLabel').textContent = time_ms;
  
  if (j == arr.length) {
    window.clearInterval(refreshIntervalId);
  }
}
      
var duration = 3000;
// source.on('addfeature', function(e) {
//   flash(e.feature);
// });  // Draw the red flashes

// fn = 'data/2016_2_14_9_43_9.json';
fn = "data/20160421.json";

var arr = [];
var index = [];
var res = [];
loadJSON(function(response) {
  // Parse JSON string into object
    res = JSON.parse(response);
    
    for (i = 0; i < res.length-1; i++) { 
      // var actual_JSON = JSON.parse(res[i]);
      actual_JSON = res[i];
      if (actual_JSON.geo !== null){
        arr.push(actual_JSON.geo.coordinates);
        index.push(i);
      }
    }
}, fn);

var j = 0;
var feature_max = 500;
var refreshIntervalId;
var currentTweets = [];
var currentTweets_max = 10;
var time_ms;



