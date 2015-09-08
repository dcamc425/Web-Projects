// Put your Last.fm API key here
var api_key = "255767593306b2906ae13efd31d6b58b";

var infoRequest = new XMLHttpRequest();
var albumRequest = new XMLHttpRequest();
var eventRequest = new XMLHttpRequest();

function sendRequest(){
    var artist = document.getElementById("form-input").value;
  //------------------------------------------------------------------------------------------------------//
    var infoMethod = "artist.getInfo";
    infoRequest.onreadystatechange = displayResult;
    infoRequest.open("GET","http://ws.audioscrobbler.com/2.0/?method="+infoMethod+"&artist="+artist+"&api_key="+api_key+"&format=json",true);
    infoRequest.send(null);
  //------------------------------------------------------------------------------------------------------//
    var albumMethod = "artist.getTopAlbums";
    albumRequest.onreadystatechange = displayResult;
    albumRequest.open("GET","http://ws.audioscrobbler.com/2.0/?method="+albumMethod+"&artist="+artist+"&api_key="+api_key+"&format=json",true);
    albumRequest.send(null);
  //------------------------------------------------------------------------------------------------------//
    var eventMethod = "artist.getEvents";
    eventRequest.onreadystatechange = displayResult;
    eventRequest.open("GET","http://ws.audioscrobbler.com/2.0/?method="+eventMethod+"&artist="+artist+"&api_key="+api_key+"&format=json",true);
    eventRequest.send(null);
}

function displayResult () {
    if((infoRequest.readyState == 4)&&(albumRequest.readyState == 4)&&(eventRequest.readyState == 4)){
        var json1 = JSON.parse(infoRequest.responseText);
        var json2 = JSON.parse(albumRequest.responseText);
	var json3 = JSON.parse(eventRequest.responseText);
		
	var name = "<h1>"+json1.artist.name+"</h1>"+"<br>";
	var artistImg = "<img src='"+json1.artist.image[3]["#text"]+"'/>"+"<br>"+"<br>";
	var info = "From: "+json1.artist.bio.placeformed+"<br>"+"Year Formed: "+json1.artist.bio.yearformed+"<br>"+"<br>"+"<br>";
	var bio = "Biography"+"<br>"+"<textarea rows='8' cols='60'>"+json1.artist.bio.summary+"</textarea>"+"<br>"+"<br>"+"<br>";
        
       function albumAccumulator(){
            var string = "<b>Top 10 Albums</b>";
            for(var i = 0;i<10;i++){
                var cnt = i+1;
                string += "<br>"+cnt+"."+json2.topalbums.album[i].name+"<br>"+"<img src='"+json2.topalbums.album[i].image[2]["#text"]+"'/>"+"<br>";
            }
            return string;
        }
        
        var topAlbumInformation = albumAccumulator();
        	
	var eventInfo;
	if(json3.events.total == 0){
            eventInfo = "<br>There are no upcoming events.";
	}
	else{
            eventInfo = "<br><b>Upcoming Events</b>"+"<br>";
            for(var i =0;i<json3["events"]["@attr"].total;i++){
                eventInfo += 
                "Title:"+json3.events.event[i].title+"<br>"+
                "Venue:"+json3.events.event[i].venue.name+"<br>"+
                "Location:"+json3.events.event[i].venue.location.city+","+json3.events.event[i].venue.location.country+"<br>"+
                "Begins:"+json3.events.event[i].startDate+"<br>"+"<br>";
            }
	}	
        document.getElementById("output").innerHTML = "<pre>"+name+artistImg+info+bio+topAlbumInformation+eventInfo+"</pre>";
    }
}
