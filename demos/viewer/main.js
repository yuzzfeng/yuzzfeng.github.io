var toastGroupTemplate = document.querySelector('#toastGroup');
toastGroupTemplate.showToast = function() {
  document.querySelector('#toast').show();
};

document.addEventListener('WebComponentsReady', function() {
    var ratings = document.querySelector('#OneBar');
    ratings.addEventListener('value-change', function() {
      document.querySelector('#epochLabel').textContent = ratings.value;
    });
  });

var cGroupTemplate = document.querySelector('#cGroup');
cGroupTemplate.addOne = function() {
  document.querySelector('#OneBar').value += 1;
};
cGroupTemplate.minusOne = function() {
  document.querySelector('#OneBar').value -= 1;
};


var blur = document.querySelector('#blur');
var radius = document.querySelector('#radius');

document.addEventListener('WebComponentsReady', function() {
  radius = document.querySelector('#radius');
  radius.addEventListener('value-change', function() {
    vectorHeat.setRadius(parseInt(radius.value, 10));
  });
  blur = document.querySelector('#blur');
  blur.addEventListener('value-change', function() {
    vectorHeat.setBlur(parseInt(blur.value, 10));
  });
});


var mGroupTemplate = document.querySelector('#mGroup');
mGroupTemplate.loadj = function() {
  window.clearInterval(refreshIntervalId);
  j = 0;
  featureRecord = [];
  source.clear();
  refreshIntervalId = window.setInterval(function() {
    addRandomFeature(arr);}, 1);
};

      
function flash(feature) {
  var start = new Date().getTime();
  var listenerKey;

  function animate(event) {
      var vectorContext = event.vectorContext;
      var frameState = event.frameState;
      var flashGeom = feature.getGeometry().clone();
      var elapsed = frameState.time - start;
      var elapsedRatio = elapsed / duration;
      // radius will be 5 at start and 30 at end.
      var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
      var opacity = ol.easing.easeOut(1 - elapsedRatio);
  
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          snapToPixel: false,
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, ' + opacity + ')',
            width: 0.25 + opacity
          })
        })
      });
  
      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      if (elapsed > duration) {
        ol.Observable.unByKey(listenerKey);
        return;
      }
      // tell OL3 to continue postcompose animation
      map.render();
    }
    listenerKey = map.on('postcompose', animate);
  }


function loadJSON(callback, address) {   
    var xobj = new XMLHttpRequest();

    xobj.open('GET', address, true); // Replace 'my_data' with the path to your file
    xobj.overrideMimeType("application/json");
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }
 

