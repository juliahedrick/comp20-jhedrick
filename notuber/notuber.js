function init() {
	lat         = 0;
	long        = 0;
	minDistance = -1;
	currentLoc  = new google.maps.LatLng(lat, long);

	myMap = {
		zoom:      10, 
		center:    currentLoc, 
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};

	infowindow = new google.maps.InfoWindow()
	map        = new google.maps.Map(document.getElementById("myMap"), myMap);
	getLocation();
}

function getLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(myPosition){
			lat  = myPosition.coords.latitude;
			long = myPosition.coords.longitude;
			updateMap();
		});
	} else {
		alert("geolocation is not supported by your web browser.");
	}
}

function updateMap() {
	currentLoc = new google.maps.LatLng(lat, long);

	map.panTo(currentLoc);
	
	marker = new google.maps.Marker({
		position: currentLoc,
		title:    "FLaFPeNMZt",
		icon:     "passenger.png"
	});

	marker.setMap(map);

	google.maps.event.addListener(marker, "click", function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});

	findVehicles();
}

function findVehicles() {
	params = "username=FLaFPeNMZt&lat=" + lat + "&lng=" + long;
	url    = "https://jordan-marsh.herokuapp.com/rides";

	request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status === 200) {		
			data = JSON.parse(request.responseText); 

			for (i = 0; i < data.vehicles.length; i++) {
				var vLoc     = new google.maps.LatLng(data.vehicles[i].lat, data.vehicles[i].lng);
				var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLoc, vLoc) * 0.000621371;

				if ((distance < minDistance) || (minDistance == -1)) {
					minDistance  = distance;
					marker.title = "Username: FLaFPeNMZt" + "<div>" + minDistance + " miles";
				}

				var vMarker = new google.maps.Marker({
					position: vLoc,
					title: "Username: " + data.vehicles[i].username + "<div>" + distance + " miles",
					icon: "car.png"
				});

				vMarker.setMap(map);

				var vInfoWindow = new google.maps.InfoWindow()
				google.maps.event.addListener(vMarker, 'click', function() {
					vInfoWindow.setContent(this.title);
					vInfoWindow.open(map, this);
				});
			}
		} 

		if (request.readyState == 4 && request.status != 200){
			document.getElementById("myMap").innerHTML = "<p>Something went wrong</p>";
		}
	};

	request.send(params);
}









