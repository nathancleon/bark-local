//Need to display geocode errors on page, not as an alert
//if status = ZERO_RESULTS, state in red by replacing label text with 
//"No results for this Zipcode"
//if input value.length > 5 digits display
//"Invalid Zipcode"


let map;
let latlng;
let markerInfoMap = {};
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
  restyleOnSubmit();
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
  $('form').on('click', '.btn-submit', function() {
    event.preventDefault();
    let zipCode = $('#js-zipcode-val').val();
    codeAddress(zipCode);
  });
}

function restyleOnSubmit() {
    $('form').on('click', '.btn-submit', function() {
        console.log('this should work');
        $('form').removeClass('form-submit').addClass('js-post-submit');
        $('h1').removeClass('form-title').addClass('js-form-title');
        $('img').removeClass('title-icon').addClass('js-title-icon');
        $('button').addClass('js-btn-submit');
        $('label').hide();
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
                  content: venueHtml,
                  maxWidth: 250
                });

                marker.addListener('click', function() {
                  infowindow.open(map, marker);
                });

                google.maps.event.addListener(map, 'click', function() {
                    infowindow.close();
                });

                markerInfoMap[venue.id] = [marker, infowindow];

            });
            $('#map').show(); 

            $('.js-foursquare-results').html(venuesHtml);
            $('.js-foursquare-results').show();

            $('.js-result, .js-result-title, .js-result-address').on('click', function(e){
                e = e || window.event; 
                e = e.target || e.srcElement;
                markerInfoMap[e.id][1].open(map, markerInfoMap[e.id][0]);
            });
    });
}

function displayResult(venue) {

    let venueHtml = `<div class="js-result" id="${venue.id}"><h3 class="js-result-title" id="${venue.id}">${venue.name}</h3><ul class="js-result-content" id="${venue.id}">`;
    
    if(venue.location.formattedAddress[0]) {
        venueHtml += `<li class="js-result-address" id="${venue.id}">${venue.location.formattedAddress[0]},&nbsp;</li>`;
    }
    if(venue.location.formattedAddress[1]) {
        venueHtml += `<li class="js-result-address" id="${venue.id}">${venue.location.formattedAddress[1]},&nbsp;</li>`;
    }
    if(venue.location.formattedAddress[2]) {
        venueHtml += `<li class="js-result-address" id="${venue.id}">${venue.location.formattedAddress[2]}</li>`;
    }
    venueHtml += `</div>`;

    return venueHtml;
}