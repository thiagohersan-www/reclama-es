var apiUrl = "https://complain-gg.herokuapp.com/api/complain/";

var QUEUE_INTERVAL = 10000;
var SERVER_INTERVAL = 30000;

var newestId;
var oldestId;
var complaintQueue = [];
var newComplaintsIntervalHandler;
var complaintCount;
var fontFamily = ['Patrick Hand', 'Kalam', 'Shadows Into Light Two'];

var TEXT_PT = '<span style="font-style:italic;">Complaints Department</span> [Departamento de reclamações] (2016 - ) é um projeto colaborativo das <a href="http://www.guerrillagirls.com/" target="_blank">Guerrilla Girls</a>. Inicialmente realizado na Tate Modern, em Londres, ele agora ganhou uma nova versão para a segunda <a href="http://frestas.sescsp.org.br/" target="_blank">Frestas - Trienal de Artes</a>. Fique à vontade para expressar aqui suas queixas, incômodos e críticas. A partir de 12 de agosto a obra também pode ser acessada no Centro de convivência do Sesc Sorocaba.';

var TEXT_EN = '<span style="font-style:italic;">Complaints Department</span> [Departamento de reclamações] (2016 - ) is a collaborative project by the <a href="http://www.guerrillagirls.com/" target="_blank">Guerrilla Girls</a>. Initially created for the Tate Modern in London, a new version has been prepared for the second edition of <a href="http://frestas.sescsp.org.br/" target="_blank">Frestas - Triennial of Arts</a>. Feel free to send in all your complaints, pet peeves and criticisms. Starting on August 12, the work will also be available for access at the Sesc Sorocaba Recreational Center.';

window.onload = function() {
  setClicks();
  complaintCount = 0;
  getOldComplaints();
  newComplaintsIntervalHandler = setInterval(getNewComplaints, SERVER_INTERVAL);
};

function setClicks() {
  document.getElementById('complaint-lightbox').onclick = closeLightbox;
  document.getElementById('highlight-close-button').onclick = closeLightbox;
  document.getElementById('language-button-pt').onclick = textToPortuguese;
  document.getElementById('language-button-en').onclick = textToEnglish;
}

function textToEnglish() {
  document.getElementById('intro-text').innerHTML = TEXT_EN;
  document.getElementById('language-button-en').classList.remove('language-button-clean');
  document.getElementById('language-button-en').classList.add('language-button-selected');
  document.getElementById('language-button-pt').classList.remove('language-button-selected');
  document.getElementById('language-button-pt').classList.add('language-button-clean');
  document.getElementById('input-complaint').setAttribute('placeholder', 'Complain here');
  document.getElementById('send-button').setAttribute('value', 'send');
  document.getElementById('load-button').innerHTML = 'more complaints';
}

function textToPortuguese() {
  document.getElementById('intro-text').innerHTML = TEXT_PT;
  document.getElementById('language-button-pt').classList.remove('language-button-clean');
  document.getElementById('language-button-pt').classList.add('language-button-selected');
  document.getElementById('language-button-en').classList.remove('language-button-selected');
  document.getElementById('language-button-en').classList.add('language-button-clean');
  document.getElementById('input-complaint').setAttribute('placeholder', 'Escreva aqui sua reclamação');
  document.getElementById('send-button').setAttribute('value', 'enviar');
  document.getElementById('load-button').innerHTML = 'mais reclamações';
}

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
  highlightTextElement.classList = "";
  highlightTextElement.classList.add('complaint-text');
  highlightTextElement.innerHTML = complaint;
  highlightTextElement.style['font-family'] = complaintFont;
  highlightTextElement.style['font-size'] = '';
  if(complaint.length < 120) {
    highlightTextElement.style['font-size'] = Math.max((100-complaint.length)/14, 3.3)+"em";
  } else if(complaint.length < 180) {
    highlightTextElement.classList.add('complaint-text-size-medium');
  } else {
    highlightTextElement.classList.add('complaint-text-size-small');
  }

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
  complaintP.style['font-size'] = Math.max((80-complaint.complaint.length)/14, 2.0)+"em";
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
