function jsonPostGet(options, callback) {
  if (!options.url) return;

  options.method = (!options.data) ? "GET" : "POST";
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if ((xmlhttp.status == 200) || (xmlhttp.status == 201)) {
        callback(JSON.parse(xmlhttp.responseText));
      } else {
        console.log('something other than 200 or 201 was returned on '+options.method);
      }
    }
  };

  xmlhttp.open(options.method, options.url);

  if(options.data) {
    xmlhttp.setRequestHeader("Content-type", "application/json");
  }

  xmlhttp.send(options.data || '');
}
