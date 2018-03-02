function init() {
	lat = 0;
	long = 0;
	currentLoc = new google.maps.LatLng(lat, long);

	myMap = {
		zoom: 10, 
		center: currentLoc, 
		mapTypeId: google.maps.MapTypeId.ROADMAP,
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
		title: "FLaFPeNMZt",
		icon: "passenger.png"
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
	url = "https://jordan-marsh.herokuapp.com/rides";
	request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status === 200) {		
			console.log(request.responseText);
			responseText = request.responseText;
			data = JSON.parse(responseText); 

			for (count = 0; count < data.vehicles.length; count++) {
				var vLoc = new google.maps.LatLng(data.vehicles[count].lat, data.vehicles[count].lng);

				var vMarker = new google.maps.Marker({
					position: vLoc,
					title: data.vehicles[count].username, 
					icon: "car.png"
				});

				vMarker.setMap(map);

				var infoWindow = new google.maps.InfoWindow()
				google.maps.event.addListener(vMarker, 'click', function() {
					infoWindow.setContent(this.title);
					infoWindow.open(map, this);
				});
			}
		}
	};

	request.send(params);
}









