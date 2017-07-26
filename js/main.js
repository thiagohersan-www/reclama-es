var apiUrl = "https://complain-gg.herokuapp.com/api/complain/";

var QUEUE_INTERVAL = 10000;
var SERVER_INTERVAL = 30000;

var newestId;
var oldestId;
var complaintQueue = [];
var newComplaintsIntervalHandler;
var complaintCount;
var fontFamily = ['Patrick Hand', 'Kalam', 'Shadows Into Light Two'];

window.onload = function() {
  complaintCount = 0;
  getOldComplaints();
  newComplaintsIntervalHandler = setInterval(getNewComplaints, SERVER_INTERVAL);
};

window.onscroll = function() {
  var introTextYLocation = document.getElementById('complaint-form').offsetTop - 256;

  if(window.pageYOffset > introTextYLocation) {
    document.getElementById('desktop-share-container').style.top = '128px';
  } else {
    document.getElementById('desktop-share-container').style.top = '-128px';
  }
}

function randomRange(a, b) {
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  return (max - min) * Math.random() + min;
}

function doNothing() {
  event.stopPropagation();
}

function closeLightbox() {
  var lightbox = document.getElementById('complaint-lightbox');
  lightbox.style.opacity = '0';
  setTimeout(function() {
    var lightbox = document.getElementById('complaint-lightbox');
    lightbox.style.display = 'none';
  }, 500);
}

function showLightbox(complaint, colorClass, complaintFont) {
  var lightBox = document.getElementById('complaint-lightbox');

  var highlightElement = document.getElementById('complaint-container-highlight');
  highlightElement.classList = "";
  highlightElement.classList.add('complaint-container');
  highlightElement.classList.add(colorClass);

  var highlightTextElement = highlightElement.getElementsByClassName('complaint-text')[0];
  highlightTextElement.innerHTML = complaint;
  highlightTextElement.style['font-family'] = complaintFont;
  highlightTextElement.style['font-size'] = Math.max((100-complaint.length)/14, 3.3)+"em";

  lightBox.style.display = 'block';
  setTimeout(function() {
    var lightbox = document.getElementById('complaint-lightbox');
    lightBox.style.opacity = '1';
  }, 1);
}

function getOldComplaints() {
  var formData = {};
  if(oldestId) {
    formData.last = oldestId;
  }
  jsonPostGet({url: apiUrl+'last/', data: JSON.stringify(formData)}, populateList);
}

function getNewComplaints() {
  if(complaintQueue.length > 0) return;
  var formData = {};
  if(newestId) {
    formData.since = newestId;
  }
  jsonPostGet({url: apiUrl+'since/', data: JSON.stringify(formData)}, handleNewComplaints);
}

function postNewComplaint() {
  var formData = {};
  formData.complaint = document.getElementById('input-complaint').value;

  if(formData.complaint.replace(/ /g, '') != '') {
    jsonPostGet({url: apiUrl, data: JSON.stringify(formData)}, handleNewComplaints);
  }
}

function processQueue() {
  if(complaintQueue.length < 1) {
    newComplaintsIntervalHandler = setInterval(getNewComplaints, SERVER_INTERVAL);
  } else {
    clearInterval(newComplaintsIntervalHandler);
    var firstComplaint = complaintQueue.shift();
    addComplaint(firstComplaint);
    setTimeout(processQueue, QUEUE_INTERVAL);
  }
}

function createComplaintElement(complaint) {
  var complaintP = document.createElement('p');
  var complaintDiv = document.createElement('div');

  complaintP.innerHTML = complaint.complaint;

  complaintP.classList.add("complaint-text");
  complaintP.style['font-size'] = Math.max((80-complaint.complaint.length)/14, 2.3)+"em";
  complaintP.style['font-family'] = fontFamily[complaintCount % 3];

  var colorClass = "complaint-container-color-"+(complaintCount % 4);
  complaintDiv.classList.add("complaint-container");
  complaintDiv.classList.add(colorClass);
  complaintDiv.style.transform = 'rotate('+randomRange(-10, 10)+'deg)';
  complaintDiv.onclick = (function(text, color, font) {
    return function() {
      showLightbox(text, color, font);
    }
  })(complaint.complaint, colorClass, fontFamily[complaintCount % 3]);

  complaintCount++;

  complaintDiv.appendChild(complaintP);
  complaintDiv.style.opacity = '0';
  return complaintDiv;
}

function addComplaint(complaint) {
  var complaintElement = createComplaintElement(complaint);
  var listDiv = document.getElementById('complaint-list');
  listDiv.insertBefore(complaintElement, listDiv.firstChild);
  setOpacity(complaintElement, '1', 100);
}

function handleNewComplaints(complaints) {
  if(complaints.length < 1) return;
  newestId = complaints[complaints.length - 1]._id;
  oldestId = oldestId || complaints[0]._id;

  var firstComplaint = complaints.shift();
  addComplaint(firstComplaint);

  for(var i in complaints) {
    complaintQueue.push(complaints[i]);
  }
  setTimeout(processQueue, QUEUE_INTERVAL);
}

function setOpacity(element, opacity, delay) {
  setTimeout(function() {
    element.style.opacity = opacity;
  }, delay);
}

function populateList(complaints) {
  if(complaints.length < 1) return;
  newestId = newestId || complaints[0]._id;
  oldestId = complaints[complaints.length - 1]._id;

  document.getElementById('complaints-loader-spinner').style.display = 'block';
  var listDiv = document.getElementById('complaint-list');

  for(var i in complaints) {
    var newElement = createComplaintElement(complaints[i]);
    listDiv.appendChild(newElement);
    setOpacity(newElement, '1', 100*i);
  }
  document.getElementById('complaints-loader-spinner').style.display = 'none';
}
