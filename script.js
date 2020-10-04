var markers = [];
var map;

document.addEventListener("DOMContentLoaded", function (event) {
    initMap();
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 48,
            lng: 4
        },
        zoom: 4,
        disableDefaultUI: true
    });
    displayDrawingTools(map);
    choseLocationAutocomplete();
}

function choseLocationAutocomplete() {
    infowindow = new google.maps.InfoWindow();
    // Create the search box and link it to the UI element.
    var input = document.getElementById('input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['name', 'formatted_address', 'geometry', 'place_id' , 'types']);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        var bounds = new google.maps.LatLngBounds();

        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
        nearbySearch(place);
    });
}

function nearbySearch(place) {
    clearMarkers();
    var chose = document.getElementById('types');
    var type = chose.options[chose.selectedIndex].value;
    var search = {
        bounds: place.geometry.viewport,
        types: [type]
      };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(search, callback);
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMarker(results);
        }
    }
}

function createMarker(places) {
    places.forEach(place => {
        let marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Type: ' + place.types + '</div>');
        infowindow.open(map, this);
        });
    });
}

function clearMarkers() {
    markers.forEach(function (m) { m.setMap(null); });
    markers = [];
}

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function displayDrawingTools(map) {
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
            //google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            //google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
        ],
        },
        circleOptions: {
            clickable: true,
            editable: true,
            //draggable: true
        },
        polygonOptions: {
            clickable: true,
            editable: true,
            //draggable: true
        },
        rectangleOptions : {
            clickable: true,
            editable: true,
            //draggable: true
        }
    });
    drawingManager.setMap(map);
    
    google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
        console.log("drawing circle");
        var radius = circle.getRadius();
        console.log(radius.toString());
        mapApi.event.addListener(circle,'radius_changed', function() {
          console.log("editing");
          radius = circle.getRadius();
          console.log(radius.toString());
        });
    });
    
    google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
        console.log("drawing rectangle");
        var bounds = rectangle.getBounds();
        console.log(bounds.toString());
        //this.polygonInfo(bounds.toString());
        google.maps.event.addListener(rectangle,'bounds_changed', function() {
          console.log("editing");
          bounds = rectangle.getBounds();
          console.log(bounds.toString());
          //this.polygonInfo(bounds.toString());
        });
    });
  
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        console.log("drawing polygon");
        var path = polygon.getPath();
        console.log(path.getArray().toString());
        //this.polygonInfo(path.getArray().toString());
        google.maps.event.addListener(path,'insert_at', function() {
          console.log("editing");
          path = polygon.getPath();
          console.log(path.getArray().toString());
          //this.polygonInfo(path.getArray().toString());
        });
        google.maps.event.addListener(path,'set_at', function() {
          console.log("editing");
          path = polygon.getPath();
          console.log(path.getArray().toString());
          //this.polygonInfo(path.getArray().toString());
        });
    });  
}
