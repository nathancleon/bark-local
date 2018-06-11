var map
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.9907, lng: -77.0261},
          zoom: 12
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