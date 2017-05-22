var homeHTML = '<table><tr><td rowspan="2"><div id="home_scroll" class=scrollable></div></td><td></td><td></td></tr><tr><td></td><td></td></tr></table>';

function getParkings() {
  $.getJSON("json/data.json", function(json) {
    var data = json["@graph"];

    for(item of data) {
      var input = document.createElement('input');
      input.className = "btn btn-default";
      input.type = "button";
      input.value = item.title;

      document.getElementById("home_scroll").appendChild(input);
    }
  });
}

$(document).ready(function() {
  $("#init").click(function() {
    $("#home").html(homeHTML);
    $("#collections_li").removeClass("disabled");
    $("#collections_a").attr("data-toggle", "tab");
    $("#facilities_li").removeClass("disabled");
    $("#facilities_a").attr("data-toggle", "tab");

    getParkings();
  });
});
