var apiKey = 'AIzaSyDDEMWIhTiOKMGRzbSIhDA84olbcPSRAAg';
var users = [];

function User(user) {
  this.id = user.id
  this.name = user.displayName;
}

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
}

function getUser(userID) {
  gapi.client.load('plus', 'v1', function() {
    var request = gapi.client.plus.people.get({
      'userId': userID
    });

    request.execute(function(resp) {
      addUser(new User(resp));
    });
  });
}

function addUser(user) {
  users.push(user);

  var div = document.createElement('div');
  div.className = "btn btn-default draggable";
  div.innerHTML = user.name;
  $(div).draggable({revert: 'invalid',
                    containment: 'document',
                    scroll: false,
                    helper: 'clone'});

  document.getElementById("users").appendChild(div);
}

function userExists(userID) {
  var result = $.grep(users, function(e){return e.id == userID;});
  if (result.length == 0) {
    return false;
  }
  return true;
}

$(document).ready(function() {
  $("#google_button").click(function() {
    document.getElementById("users").innerHTML = "";

    try {
      var host = "ws://localhost:8080/";
      console.log("Host:", host);

      var s = new WebSocket(host);

      s.onopen = function (e) {
        console.log("Socket opened.");
      };

      s.onclose = function (e) {
        console.log("Socket closed.");
      };

      s.onmessage = function (e) {
        console.log("Socket message:", e.data);
        if(!userExists(e.data)) {
          getUser(e.data);
        }
      };

      s.onerror = function (e) {
        console.log("Socket error:", e);
      };
    } catch (ex) {
      console.log("Socket exception:", ex);
    }
  });
});
