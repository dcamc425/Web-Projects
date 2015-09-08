// Put your zillow.com API key here
var zwsid = "ZILLOWAPIKEYGOESHERE";

var request = new XMLHttpRequest();
var marker,map,position,lat,lng,latlng,geocoder,locationAddress,infoWindowContent,markerInfo;
var address,streetNum,street,city,state,zip,cityStateZip,encAddress,encCityStateZip,amount;

function initialize(){
	geocoder = new google.maps.Geocoder();
	var	mapProperties = {
		center: new google.maps.LatLng(32.75,-97.13),
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('mapArea'),mapProperties);
	position = google.maps.event.addListener(map, 'click', 
	function(event){placeMarker(event.latLng);});
	
	marker = new google.maps.Marker({
		position: position,
		map: map,
		title: 'Property Info'
	});
	
	function placeMarker(location){
		if(marker){
			marker.setPosition(location);
		} 
		else{
			marker = new google.maps.Marker({
			position: location,
			map: map
			});
		}
		lat = marker.getPosition().lat();
		lng = marker.getPosition().lng();
		latlng = new google.maps.LatLng(lat,lng);
		locationAddress = geocoder.geocode({'location':latlng},function(results,status){
			if(status == google.maps.GeocoderStatus.OK){
				if(results[0]){
					streetNum = results[0].address_components[0].short_name;
					street = results[0].address_components[1].short_name;
					city = results[0].address_components[3].short_name;
					state = results[0].address_components[5].short_name;
					zip = results[0].address_components[7].short_name;
					address = streetNum+" "+street;
					cityStateZip = city+" "+state+" "+zip;
					encAddress = encodeURI(address);
					encCityStateZip = encodeURI(cityStateZip);
					
					request.open("GET","proxy.php?zws-id="+zwsid+"&address="+encAddress+"&citystatezip="+encCityStateZip);
					request.onreadystatechange = displayResult;
					request.withCredentials = "true";
					request.send(null);
					displayResult();	
				}
			}
		});
	}
}

function xml_to_string(xml_node){
   if (xml_node.xml)
      return xml_node.xml;
   var xml_serializer = new XMLSerializer();
   return xml_serializer.serializeToString(xml_node);
}

function displayResult(){
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0];
		var val = xml_to_string(value);
		var string = address+"<br>"+city+","+state+" "+zip+"<br>"+"$"+val;
		amount = xml_to_string(value);
		document.getElementById("output").innerHTML += string+"<br>";
		infoWindowContent = address+"<br>"+city+","+state+" "+zip+"<br>"+"$"+val;
				markerInfo = new google.maps.InfoWindow({
					content: infoWindowContent
				});	
		google.maps.event.addListener(marker,'click', function(){markerInfo.open(map,marker);});
    }
}
