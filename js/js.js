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
  formData.since = document.getElementById('input-since').value;
  jsonPostGet({url: apiUrl+'since/', data: JSON.stringify(formData)}, console.log);
}

function testPost() {
  var formData = {};
  formData.name = document.getElementById('input-name').value;
  formData.complaint = document.getElementById('input-complaint').value;
  jsonPostGet({url: apiUrl, data: JSON.stringify(formData)}, console.log);
}

function populateList(complaints) {
  if(complaints.length < 1) return;
  newestId = complaints[0]._id;
  oldestId = complaints[complaints.length-1]._id;

  var listDiv = document.getElementById('complaint-list');

  for(var i in complaints){
    var nameP = document.createElement('p');
    var complaintP = document.createElement('p');
    var complaintDiv = document.createElement('div');

    nameP.innerHTML = complaints[i].name;
    complaintP.innerHTML = complaints[i].complain;

    nameP.classList.add("complaint-name");
    complaintP.classList.add("complaint-complaint");
    complaintDiv.classList.add("complaint-container");
    
    complaintDiv.appendChild(complaintP);
    complaintDiv.appendChild(nameP);
    listDiv.appendChild(complaintDiv);
  }
}
