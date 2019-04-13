var map;
var longpress = false;
var map_icon_location;
var options = {
  enableHighAccuracy: true,
  timeout: 500,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;
  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');
  setMiPosition(crd.latitude, crd.longitude);
  AlertDialog.dismiss();

};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

function getLocation() {

  if (geoPosition.init()) { // Geolocation Initialisation
    geoPosition.getCurrentPosition(success_callback, error_callback, {
      enableHighAccuracy: true
    });
  } else {
    // You cannot use Geolocation in this device
    alert("Geolocation is not supported by this browser.");
  }
  //geoPositionSimulator.init(); 

  /*if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  } else {
    alert("Geolocation is not supported by this browser.");
  }*/
}


// p : geolocation object
function success_callback(p) {
  // p.latitude : latitude value
  // p.longitude : longitude value
  setMiPosition(p.latitude, p.longitude);
  AlertDialog.dismiss();
}

function error_callback(p) {
  console.log(p);
  // p.message : error message
}

function initMap() {

  if (AppController.loadedLibraryMap) {
    map_icon_location = new google.maps.MarkerImage(
      "http://emt.vladymix.es/data/ic_location.png",
      new google.maps.Size(32, 32),
      new google.maps.Point(0, 0));

    var elem = document.getElementById('map');
    if (elem != null) {
      map = new google.maps.Map(elem, {
        center: {
          lat: 40.416775,
          lng: -3.70379
        },
        zoom: 11,
        disableDefaultUI: true
      });
        
      map.addListener('click', function(e) {
        console.log(e.latLng);
          setMiPosition(e.latLng.latitude, e.latLng.longitude);
     //placeMarkerAndPanTo(e.latLng, map);
          
  });
    }
  }
}

function setMiPosition(lat, lng) {
  map.setCenter(new google.maps.LatLng(lat, lng));
  map.zoom = 15;
  var point = new google.maps.LatLng(lat, lng);
  marker = map_create_marker(point, "My location", map_icon_location);
}

function map_create_marker(point, html, icon) {
  var marker = new google.maps.Marker({
    position: point,
    map: map,
    icon: icon
  });

  if (html != "") {
    var infowindow = new google.maps.InfoWindow({
      content: html
    });
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(map, marker);
    });
  }
  return marker;
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}
