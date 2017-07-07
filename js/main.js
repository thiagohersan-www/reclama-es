var apiUrl = "https://complain-gg.herokuapp.com/api/complain/";
//var apiUrl = "http://localhost:8080/api/complain/";

var QUEUE_INTERVAL = 20000;
var SERVER_INTERVAL = 30000;

var newestId;
var oldestId;
var complaintQueue = [];
var newComplaintsIntervalHandler;
var complaintCount;

window.onload = function() {
  complaintCount = 0;
  getOldComplaints();
  newComplaintsIntervalHandler = setInterval(getNewComplaints, SERVER_INTERVAL);
};

function randomRange(a, b) {
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  return (max - min) * Math.random() + min;
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
  // TODO: check complaint text, set warning if empty
  jsonPostGet({url: apiUrl, data: JSON.stringify(formData)}, handleNewComplaints);
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
  complaintP.style['font-size'] = Math.max(80-complaint.complaint.length, 32)+"px";

  complaintDiv.classList.add("complaint-container");
  complaintDiv.classList.add("complaint-container-"+((complaintCount%2)?"pink":"yellow"));
  complaintDiv.style.transform = 'rotate('+randomRange(-10, 10)+'deg)';

  complaintDiv.appendChild(complaintP);
  complaintCount++;
  return complaintDiv;
}

function addComplaint(complaint) {
  var complaintElement = createComplaintElement(complaint);
  var listDiv = document.getElementById('complaint-list');
  listDiv.insertBefore(complaintElement, listDiv.firstChild);
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

function populateList(complaints) {
  if(complaints.length < 1) return;
  newestId = newestId || complaints[0]._id;
  oldestId = complaints[complaints.length - 1]._id;

  var listDiv = document.getElementById('complaint-list');

  for(var i in complaints) {
    listDiv.appendChild(createComplaintElement(complaints[i]));
  }
}
