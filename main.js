//declare global variables
let map;
let latlng;
let markerInfoMap = {};
const FOURSQUARE_ENDPOINT = 'https://api.foursquare.com/v2/venues/search?ll=';
const FOURSQUARE_ID = "IB2LJDSANFJOZ2OL2DCJUBWMUXINDXOBB1GYUBJ12IXG1V0K";
const FOURSQUARE_CLIENT_SECRET = "QIXEV4V30G2ONJPEBIYUUWKQXZSQW3PRQ1V5AAZB1NG5QEY4";
const FOURSQUARE_VERSION = '&v=20180621';

function initialize() {
  //sets default google maps options
  let myOptions = {
    center: latlng,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  //initializes map
  map = new google.maps.Map(document.getElementById("map"), myOptions);
  zipcodeInput();
  restyleOnSubmit();
}

function codeAddress(address) {
  //uses google geocoder to retrieve lat lng from zipcode entered by the user
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    address: address
  }, function (results, status) {
    //if there is no error, display map with entered zipcode as new center
    //then call foursquare data for the results
    if (status == google.maps.GeocoderStatus.OK) {
      latlng = results[0].geometry.location;
      map.setCenter(latlng);
      fourSquareGet();
      //hide error if user enters a working zipcode after entering an incorrect one
      $('.zipcode-error').hide();
    } else {
      //if there is an error, show the user that input was not successful
      //console log the error from google geocoder status
      console.log('Geocode was not successful for the following reason: ' + status);
      $('.zipcode-error').show();
    }
  });
  //initialize the map when these parameters are entered
  initialize();
}

function zipcodeInput() {
  //aquire the zipcode value entered and call the geocoder
  $('form').on('click', '.btn-submit', function () {
    event.preventDefault();
    let zipCode = $('#js-zipcode-val').val();
    codeAddress(zipCode);
  });
}

function restyleOnSubmit() {
  //restyles the landing page to the results page
  $('form').on('click', '.js-btn-submit', function () {
    $('form').removeClass('form-submit').addClass('js-post-submit');
  });
}

function fourSquareGet() {
  //declare latitude and longitude variables outside to use inside json request func
  let latitude = latlng.lat();
  let longitude = latlng.lng();

  $.getJSON(FOURSQUARE_ENDPOINT + latitude + ',' + longitude + '&query=dog+park&client_id=' + FOURSQUARE_ID +
    '&client_secret=' + FOURSQUARE_CLIENT_SECRET + FOURSQUARE_VERSION,
    function (data) {
      //complete full json request from foursquare
      //set venuesHTML initially as an empty string
      let venuesHtml = "";
      data.response.venues.forEach(function (venue) {
        //for each venue, append to results html
        let venueHtml = displayResult(venue);
        venuesHtml += venueHtml;
        //add marker for each venue location
        let markerLatLong = new google.maps.LatLng(venue.location.lat, venue.location.lng);
        let marker = new google.maps.Marker({
          position: markerLatLong,
          title: venue.name
        });
        //set markers on map
        marker.setMap(map);

        //declare info window parameters
        let infowindow = new google.maps.InfoWindow({
          content: venueHtml,
          maxWidth: 250
        });

        //open info window when marker is clicked
        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });

        //close info window when clicking anywhere on the map
        google.maps.event.addListener(map, 'click', function () {
          infowindow.close();
        });

        //update global object markerInfoMap to store info window venues 
        //to later match venueshtml venues
        markerInfoMap[venue.id] = [marker, infowindow];

      });
      //display map on page
      $('#map').show();

      //append venue results to html and unhide div
      $('.js-foursquare-results').html(venuesHtml);
      $('.js-foursquare-results').show();

      //when any part of the venue results html is clicked, open the respective info window
      $('.js-result, .js-result-title, .js-result-address').on('click', function (e) {
        e = e || window.event;
        e = e.target || e.srcElement;
        markerInfoMap[e.id][1].open(map, markerInfoMap[e.id][0]);
      });
    });
}

function displayResult(venue) {
  //takes data from foursquare venues and updates the results div with title and address
  //each element needs a venue id so when any element is clicked,
  //the respective info window opens
  let venueHtml = `<div class="js-result" id="${venue.id}"><h3 class="js-result-title" id="${venue.id}">${venue.name}</h3><ul class="js-result-content" id="${venue.id}">`;

  if (venue.location.formattedAddress[0]) {
    venueHtml += `<li class="js-result-address" id="${venue.id}">${venue.location.formattedAddress[0]},&nbsp;</li>`;
  }
  if (venue.location.formattedAddress[1]) {
    venueHtml += `<li class="js-result-address" id="${venue.id}">${venue.location.formattedAddress[1]},&nbsp;</li>`;
  }
  if (venue.location.formattedAddress[2]) {
    venueHtml += `<li class="js-result-address" id="${venue.id}">${venue.location.formattedAddress[2]}</li>`;
  }
  venueHtml += `</div>`;

  return venueHtml;
}