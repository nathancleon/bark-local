var map
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.9907, lng: -77.0261},
          zoom: 12
        });
      }