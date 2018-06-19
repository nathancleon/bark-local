let map;

function initialize() {

  let latlng = new google.maps.LatLng(38.9907, -77.0261);
  let myOptions = {
    center: latlng,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map"), myOptions);
  zipcodeInput();
}

function codeAddress(address) {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode( {address:address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
    } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
  });
  initialize();
}

function zipcodeInput() {
  $('#js-form-submit').on('click', '.js-btn-submit', function() {
    event.preventDefault();
    let zipCode = $('#js-zipcode-val').val();
    codeAddress(zipCode);
  });
}

//project set up:
//  store zipcode entered as lat long using google geocoding
//  replace lat long in google maps initMap function to the geocode
//  complete api request to foursquare for dog parks data
//  iterate through dog parks data and obtain geocodes for each location
//  obtain description and photo if available
//  display parks on google maps as markers with info windows
//  display photo, description, and address in info window when clicked
//  see about styling markers and info windows
//  once js app functions as intended, look into performance optimizations
//  then style the app

//  REMEMBER: Sidebar will be necessary to display park info and address info next to map
//      sidebar will be moved to below the map in smaller screens
//      play around with map size/zoom setting so that it works appropriately for all sizes