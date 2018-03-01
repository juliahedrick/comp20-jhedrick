function init() {
	lat = 0;
	long = 0;
	currentLoc = new google.maps.LatLng(lat, long);

	myMap = {
		zoom: 10, 
		center: currentLoc, 
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	infowindow = new google.maps.InfoWindow()
	map = new google.maps.Map(document.getElementById("myMap"), myMap);
	getLocation();
}

function getLocation() {
	navigator.geolocation.getCurrentPosition(function(myPosition){
		lat  = myPosition.coords.latitude;
		long = myPosition.coords.longitude;
		updateMap();
	});
}

function updateMap() {
	currentLoc = new google.maps.LatLng(lat, long);

	map.panTo(currentLoc);

	marker = new google.maps.Marker({
		position: currentLoc,
		title: "passenger"
	});

	marker.setMap(map);

	google.maps.event.addListener(marker, "click", function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	findVehicles();
}

function findVehicles() {
	params = "username=FLaFPeNMZt&lat=" + String(lat) + "&lng=" + String(long);
	console.log(lat);
	console.log(long);
	console.log(params);
	request = new XMLHttpRequest();
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status === 200) {		
			console.log(request.responseText);
			responseText = request.responseText;
			vehicles = JSON.parse(responseText); 

			for (count = 0; count < vehicles.length; count++) {
				vLoc = new google.maps.LatLng(vehicles[count].lat, vehicles[count].lng);

				marker = new google.maps.Marker({
					position: vLoc,
					title: "vehicle " + vehicles[count].username
				});

				marker.setMap(map);

				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title);
					infowindow.open(map, marker);
				});
			}
		}
	};

	request.send(params);
}









