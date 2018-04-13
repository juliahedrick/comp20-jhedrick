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
	});

	marker.setMap(map);

	google.maps.event.addListener(marker, "click", function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});

	findVehiclesorPassengers();
}

function findVehiclesorPassengers() {
	params = "username=FLaFPeNMZt&lat=" + lat + "&lng=" + long;
	url    = "https://gentle-crag-97783.herokuapp.com/rides";

	request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {
		console.log("request.status");
		console.log(request.status);
		if (request.readyState == 4 && request.status === 200) {		
			data = JSON.parse(request.responseText); 

			if(data.vehicles != undefined) {
				console.log("is a vehicle");
				marker.setIcon("passenger.png");
				marker.title += "<div>" + "No vehicles available.";
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

			if(data.passengers != undefined) {
				console.log("is a passenger");
				marker.setIcon("car.png");
				marker.title += "<div>" + "No passengers available.";
				for (i = 0; i < data.passengers.length; i++) {
					var vLoc     = new google.maps.LatLng(data.passengers[i].lat, data.passengers[i].lng);
					var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLoc, vLoc) * 0.000621371;

					if ((distance < minDistance) || (minDistance == -1)) {
						minDistance  = distance;
						marker.title = "Username: FLaFPeNMZt" + "<div>" + minDistance + " miles";
					}

					var pMarker = new google.maps.Marker({
						position: vLoc,
						title: "Username: " + data.passengers[i].username + "<div>" + distance + " miles",
						icon: "passenger.png"
					});

					pMarker.setMap(map);

					google.maps.event.addListener(pMarker, 'click', function() {
						infowindow.setContent(this.title);
						infowindow.open(map, this);
					});
				}
			}
		} 

		if (request.readyState == 4 && request.status != 200){
			document.getElementById("myMap").innerHTML = "<p>Something went wrong</p>";
		}
	};

	request.send(params);
}
