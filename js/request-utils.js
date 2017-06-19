function jsonPostGet(options, callback) {
  if (!options.url) return;

  options.returnStatus = (!options.data) ? 200 : 201;
  options.method = (!options.data) ? "GET" : "POST";
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == options.returnStatus) {
        callback(xmlhttp.responseText);
      } else {
        console.log('something other than '+options.returnStatus+' was returned on '+options.method);
      }
    }
  };

  xmlhttp.open(options.method, options.url);

  if(options.data) {
    xmlhttp.setRequestHeader("Content-type", "application/json");
  }

  xmlhttp.send(options.data || '');
}
