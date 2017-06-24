var homeHTML = '<table><tr><td rowspan="2"><div id="home_scroll" class=scrollable></div></td><td><div id="description_home"></div></td><td><div id="carousel_home" class="carousel slide" data-ride="carousel"></div></td></tr><tr><td><div id="map"></div></td><td><div id="collection_home"></div></td></tr></table>';
var carouselHTML = '<ol id ="carousel-indicators" class="carousel-indicators"></ol><div id="carousel-inner" class="carousel-inner"></div><a class="left carousel-control" href="#carousel_home" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="#carousel_home" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span><span class="sr-only">Next</span></a>';
var parkings=[];
var images=[];
var collections=[];
var gUsers=[];
var map;

function Collection(name) {
  this.name = name;
  this.parkings = [];
}

function Facility(parking) {
  this.id = parking.id;
  this.title = parking.title;
  this.locality = parking.address["locality"];
  this.pc = parking.address["postal-code"];
  this.street = parking.address["street-address"];
  this.coordinates = new Coordinates(parking.location);
  this.description = parking.organization["organization-desc"];
  this.gUsers = [];
}

function Coordinates(location) {
  this.latitude = location.latitude;
  this.longitude = location.longitude;
}

function GUser(name) {
  this.name = name;
}

function getParkings(callback) {
  $.getJSON("json/data.json", function(json) {
    var data = json["@graph"];

    for(item of data) {
      parkings.push(new Facility(item));

      /*var input = document.createElement('input');
      input.className = "btn btn-default";
      input.type = "button";
      input.value = item.title;
      input.id = item.id;
      input.onclick = markSelection;

      document.getElementById("home_scroll").appendChild(input);*/
    }
    callback();
  });
}

function getCollectionByName(name) {
  var result = $.grep(collections, function(e){return e.name == name;});
  return result[0];
}

function getParkingByName(name) {
  var result = $.grep(parkings, function(e){return e.title == name;});
  return result[0];
}

function getUserByName(name) {
  var result = $.grep(gUsers, function(e){return e.name == name;});
  return result[0];
}

function markCollection() {
  //console.log(this.value);
  var collection = getCollectionByName(this.value);

  setCollectionInfo(collection);
  setCollectionHome(collection);
}

function markSelection() {
  var parking = getParkingByName(this.value);

  insertInMap(parking);
  setMain(parking);
  setInfo(parking);
  setUsers(parking);
}

function setUsers(parking) {
  document.getElementById("users_asigned").innerHTML = "";

  var list = document.createElement('div');
  list.className = "droppable";

  $.each(parking.gUsers, function(i, item) {
    var node = document.createElement('input');
    node.className = "btn btn-default";
    node.type = "button";
    node.value = item.name;

    list.appendChild(node);
  });

  $(list).droppable({
    drop: function( event, ui ) {
      var name = ui.draggable[0].innerHTML;

      if(!isAsigned(name, parking)) {
        parking.gUsers.push(getUserByName(name));

        setUsers(parking);
      }
    }
  });

  document.getElementById("users_asigned").appendChild(list);
}

function setInfo(parking) {
  var infoNode = document.getElementById("description_info");
  infoNode.innerHTML = "";

  var name = document.createElement('h1');
  name.innerHTML = parking.title;

  var address = document.createElement('h3');
  address.innerHTML = parking.street + ", " + parking.locality;

  var pc = document.createElement('h3');
  pc.innerHTML = parking.pc;

  var description = document.createElement('h4');
  description.innerHTML = parking.description;

  var latitude = document.createElement('h5');
  var latitude_text = document.createElement('i');
  latitude_text.innerHTML = "Latitud: " + parking.coordinates.latitude;
  latitude.appendChild(latitude_text);

  var longitude = document.createElement('h5');
  var longitude_text = document.createElement('i');
  longitude_text.innerHTML = "Longitud: " + parking.coordinates.longitude;
  longitude.appendChild(longitude_text);

  infoNode.appendChild(name);
  infoNode.appendChild(address);
  infoNode.appendChild(pc);
  infoNode.appendChild(description);
  infoNode.appendChild(latitude);
  infoNode.appendChild(longitude);
}

function setMain(parking) {
  var descNode = document.getElementById("description_home");
  descNode.innerHTML = "";
  /*while (descNode.firstChild) {
    descNode.removeChild(descNode.firstChild);
  }*/

  var name = document.createElement('h2');
  name.innerHTML = parking.title;

  var address = document.createElement('h4');
  address.innerHTML = parking.street + ", " + parking.locality;

  var pc = document.createElement('h4');
  pc.innerHTML = parking.pc;

  descNode.appendChild(name);
  descNode.appendChild(address);
  descNode.appendChild(pc);

  getImages(parking, function() {
    console.log(images.length);
    if(images.length > 0) {
      setCarousel();
    }
  });
}

function setCollectionHome(collection) {
  document.getElementById("collection_home").innerHTML = "";

  var title = document.createElement('h3');
  title.innerHTML = collection.name;
  document.getElementById("collection_home").appendChild(title);

  var list = document.createElement('div');
  list.className = "scrollable";

  $.each(collection.parkings, function(i, item) {
    var input = document.createElement('input');
    input.className = "btn btn-default";
    input.type = "button";
    input.value = item.title;
    input.onclick = markSelection;

    list.appendChild(input);
  });

  document.getElementById("collection_home").appendChild(list);
}

function setCollectionInfo(collection) {
  document.getElementById("collection-info").innerHTML = "";
  //document.getElementById("collection_home").innerHTML = "";

  var title = document.createElement('h1');
  title.innerHTML = collection.name;
  document.getElementById("collection-info").appendChild(title);

  /*var title_home = document.createElement('h3');
  title_home.innerHTML = collection.name;
  document.getElementById("collection_home").appendChild(title_home);*/

  /*var list_collections_home = document.createElement('div');
  list_collections_home.className = "scrollable";*/

  var list = document.createElement('div');
  list.className = "droppable";

  $.each(collection.parkings, function(i, item) {
    /*var input = document.createElement('input');
    input.className = "btn btn-default";
    input.type = "button";
    input.value = item.title;
    input.onclick = markSelection;

    list_collections_home.appendChild(input);*/

    var node = document.createElement('input');
    node.className = "btn btn-default";
    node.type = "button";
    node.value = item.title;

    list.appendChild(node);
  });

  $(list).droppable({
    drop: function( event, ui ) {
      //console.log(ui.draggable[0].innerHTML);
      var name = ui.draggable[0].innerHTML;

      if(!isInCollection(name, collection)) {
        collection.parkings.push(getParkingByName(name));

        /*var input = document.createElement('input');
        input.className = "btn btn-default";
        input.type = "button";
        input.value = name;
        input.onclick = markSelection;
        list_collections_home.appendChild(input);

        var node = document.createElement('input');
        node.className = "btn btn-default";
        node.type = "button";
        node.value = name;
        list.appendChild(node);*/

        setCollectionHome(collection);
        setCollectionInfo(collection);
      }
    }
  });

  //document.getElementById("collection_home").appendChild(list_collections_home);
  document.getElementById("collection-info").appendChild(list);
}

function updateCollectionsLists(name) {
  var input = document.createElement('input');
  input.className = "btn btn-default";
  input.type = "button";
  input.value = name;
  input.onclick = markSelection;
  list_collections_home.appendChild(input);

  var node = document.createElement('input');
  node.className = "btn btn-default";
  node.type = "button";
  node.value = name;
  list.appendChild(node);
}

function isInCollection(name, collection) {
  var result = $.grep(collection.parkings, function(e){return e.title == name;});
  if (result.length == 0) {
    return false;
  }
  return true;
}

function isAsigned(name, parking) {
  var result = $.grep(parking.gUsers, function(e){return e.name == name;});
  if (result.length == 0) {
    return false;
  }
  return true;
}

function setCarousel() {
  //$("#carousel_home").html(carouselHTML);
  document.getElementById("carousel-indicators").innerHTML = "";
  document.getElementById("carousel-inner").innerHTML = "";

  $.each(images, function(i, item) {
    var li = document.createElement('li');
    li.setAttribute("data-target", "#carousel_home");
    li.setAttribute("data-slide-to", i);
    li.className = "";
    if(i == 0) {
      li.className += "active";
    }
    document.getElementById("carousel-indicators").appendChild(li);

    var image = document.createElement('img');
    image.setAttribute("src", images[i]);

    var div = document.createElement('div');
    div.className = "item";
    if(i == 0) {
      div.className += " active";
    }

    div.appendChild(image);
    document.getElementById("carousel-inner").appendChild(div);
  });
}

function setParkings() {
  $.each(parkings, function(i, item) {
    var input = document.createElement('input');
    input.className = "btn btn-default";
    input.type = "button";
    input.value = item.title;
    input.onclick = markSelection;

    document.getElementById("home_scroll").appendChild(input);

    var div = document.createElement('div');
    div.className = "btn btn-default draggable";
    div.innerHTML = item.title;
    $(div).draggable({revert: 'invalid',
                      containment: 'document',
                      scroll: false,
                      helper: 'clone'});

    document.getElementById("facilities_collections_scroll").appendChild(div);
  });
}

function getImages(parking, callback) {
  var url = 'https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=' + parking.coordinates.latitude + '|' + parking.coordinates.longitude + '&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?';
  images = [];

  $.getJSON(url, function(json) {
    var data = json.query.pages;

    $.each(data, function(i, item) {
      images.push(item.imageinfo[0].url);
      //console.log(item.imageinfo[0].url);
    });

    callback();
  });
}

function insertInMap(parking) {
  var latitude = parking.coordinates.latitude;
  var longitude = parking.coordinates.longitude;

  var marker = L.marker([latitude, longitude]);

  var link = $('<div>' + parking.title + '<br><a href="#" class="closelink">Close</a></div>').click(function() {
    map.removeLayer(marker);
  })[0];

  marker.addTo(map)
    .bindPopup(link)
    .openPopup()
    .on({click: function() {
      setMain(parking);
    }});

  map.flyTo([latitude, longitude], 15);
}

function loadMap() {
  map = L.map('map').setView([40.4168, -3.7038], 10);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function createCollection(name) {
  collections.push(new Collection(name));

  var input = document.createElement('input');
  input.className = "btn btn-default";
  input.type = "button";
  input.value = name;
  input.onclick = markCollection;

  document.getElementById("collections_scroll").appendChild(input);
}

$(document).ready(function() {
  $("#init").click(function() {
    $("#home").html(homeHTML);
    $("#collections_li").removeClass("disabled");
    $("#collections_a").attr("data-toggle", "tab");
    $("#facilities_li").removeClass("disabled");
    $("#facilities_a").attr("data-toggle", "tab");
    $("#carousel_home").html(carouselHTML);
    //$("#draggable").draggable();

    $("#create-collection").click(function() {
      var name = $('#collection-name')[0].value;

      if(name == "") {
        alert("Introduce un nombre");
        return;
      }

      if(getCollectionByName(name) != undefined) {
        alert("Ya existe una colección con ese nombre");
        return;
      }

      createCollection(name);

      /*console.log(getCollectionByName($('#collection-name')[0].value));
      console.log($('#collection-name')[0].value);
      console.log(document.getElementById('collection-name').value);*/
    });

    /*$("#droppable").droppable({
      drop: function( event, ui ) {
        console.log(ui.draggable[0].innerHTML);
      }
    });*/

    getParkings(function() {
      setParkings();
    });
    loadMap();
  });
});
