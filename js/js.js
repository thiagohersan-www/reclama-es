var apiUrl = "https://complain-gg.herokuapp.com/api/complain/";
//var apiUrl = "http://localhost:8080/api/complain/";

var newestId = 0;
var oldestId;

function testLast() {
  var formData = {};
  if(oldestId) {
    formData.last = oldestId;
  }
  jsonPostGet({url: apiUrl+'last/', data: JSON.stringify(formData)}, populateList);
}

function testSince() {
  var formData = {};
  formData.since = newestId;
  jsonPostGet({url: apiUrl+'since/', data: JSON.stringify(formData)}, handleNewComplaints);
}

function testPost() {
  var formData = {};
  formData.name = document.getElementById('input-name').value;
  formData.complaint = document.getElementById('input-complaint').value;
  jsonPostGet({url: apiUrl, data: JSON.stringify(formData)}, handleNewComplaints);
}

function createComplaintElement(complaint) {
  var nameP = document.createElement('p');
  var complaintP = document.createElement('p');
  var complaintDiv = document.createElement('div');

  nameP.innerHTML = complaint.name;
  complaintP.innerHTML = complaint.complaint;

  nameP.classList.add("complaint-name");
  complaintP.classList.add("complaint-complaint");
  complaintDiv.classList.add("complaint-container");

  complaintDiv.appendChild(complaintP);
  complaintDiv.appendChild(nameP);
  return complaintDiv;
}

function addComplaint(complaint) {
  var complaintElement = createComplaintElement(complaint);
  var listDiv = document.getElementById('complaint-list');
  listDiv.insertBefore(complaintElement, listDiv.firstChild);
}

function handleNewComplaints(complaints) {
  if(complaints.length < 1) return;
  newestId = complaints[complaints.length-1]._id;
  oldestId = oldestId || newestId;

  for(var i in complaints) {
    // TODO: push onto queue
  }
  addComplaint(complaints[0]);
}

function populateList(complaints) {
  if(complaints.length < 1) return;
  newestId = complaints[0]._id;
  oldestId = complaints[complaints.length-1]._id;

  var listDiv = document.getElementById('complaint-list');

  for(var i in complaints) {
    listDiv.appendChild(createComplaintElement(complaints[i]));
  }
}
