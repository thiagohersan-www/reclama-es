function getJson(url, callback) {
  if (!url) return;
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        callback(xmlhttp.responseText);
      } else {
        console.log('something else other than 200 was returned');
      }
    }
  };

  xmlhttp.open("GET", url);
  xmlhttp.send();
}

function postJson(url, data, callback) {
  if (!url) return;
  if (!data) return;
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 201) {
        callback(xmlhttp.responseText);
      } else {
        console.log('something else other than 201 was returned');
      }
    }
  };

  xmlhttp.open("POST", url);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send(data);
}
