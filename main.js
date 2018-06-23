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

let map;
let latlng;
const FOURSQUARE_ENDPOINT = 'https://api.foursquare.com/v2/venues/search?ll=';
const FOURSQUARE_ID = "IB2LJDSANFJOZ2OL2DCJUBWMUXINDXOBB1GYUBJ12IXG1V0K";
const FOURSQUARE_CLIENT_SECRET = "QIXEV4V30G2ONJPEBIYUUWKQXZSQW3PRQ1V5AAZB1NG5QEY4";
const FOURSQUARE_VERSION = '&v=20180621';

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
        latlng = results[0].geometry.location;
        map.setCenter(latlng);
        fourSquareGet();
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

function fourSquareGet() {
    let latitude = latlng.lat();
    let longitude = latlng.lng();

    $.getJSON(FOURSQUARE_ENDPOINT + latitude + ',' + longitude + '&query=dog+park&client_id=' + FOURSQUARE_ID + 
        '&client_secret=' + FOURSQUARE_CLIENT_SECRET + FOURSQUARE_VERSION,
        function(data) {
            let venuesHtml = "";
            data.response.venues.forEach(function(venue) {
                let venueHtml = displayResult(venue);
                venuesHtml += venueHtml;
                let markerLatLong = new google.maps.LatLng(venue.location.lat,venue.location.lng);
                let marker = new google.maps.Marker({
                    position: markerLatLong,
                    title: venue.name
                });
                marker.setMap(map);

                let infowindow = new google.maps.InfoWindow({
                  content: venueHtml
                });

                marker.addListener('click', function() {
                  infowindow.open(map, marker);
                });
            });
            $('#map').show(); 
            $('.js-foursquare-results').html(venuesHtml);
    });
}

function displayResult(venue) {
    let venueHtml = `<div><h3>${venue.name}</h3><p>`;
    
    if(venue.location.formattedAddress[0]) {
        venueHtml += `<p>${venue.location.formattedAddress[0]}</p>`;
    }
    if(venue.location.formattedAddress[1]) {
        venueHtml += `<p>${venue.location.formattedAddress[1]}</p>`;
    }
    if(venue.location.formattedAddress[2]) {
        venueHtml += `<p>${venue.location.formattedAddress[2]}</p>`;
    }
    venueHtml += `</div>`;

    return venueHtml;
}