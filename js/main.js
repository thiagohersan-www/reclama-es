let complaintCount;
const fontFamily = ['Patrick Hand', 'Kalam', 'Shadows Into Light Two'];

const TEXT_PT = '<span style="font-style:italic;">Complaints Department</span> [Departamento de reclamações] (2016 - ) é um projeto colaborativo das <a href="http://www.guerrillagirls.com/" target="_blank">Guerrilla Girls</a>. Inicialmente realizado na Tate Modern, em Londres, ele agora ganhou uma nova versão para a segunda <a href="http://frestas.sescsp.org.br/" target="_blank">Frestas - Trienal de Artes</a>. Fique à vontade para expressar aqui suas queixas, incômodos e críticas. A partir de 12 de agosto a obra também pode ser acessada no Centro de convivência do Sesc Sorocaba.';

const TEXT_EN = '<span style="font-style:italic;">Complaints Department</span> [Departamento de reclamações] (2016 - ) is a collaborative project by the <a href="http://www.guerrillagirls.com/" target="_blank">Guerrilla Girls</a>. Initially created for the Tate Modern in London, a new version has been prepared for the second edition of <a href="http://frestas.sescsp.org.br/" target="_blank">Frestas - Triennial of Arts</a>. Feel free to send in all your complaints, pet peeves and criticisms. Starting on August 12, the work will also be available for access at the Sesc Sorocaba Recreational Center.';

const enButton = document.getElementById('language-button-en');
const ptButton = document.getElementById('language-button-pt');
const sendButton = document.getElementById('send-button');
const complaintInput = document.getElementById('input-complaint');
const complaintLightbox = document.getElementById('complaint-lightbox');
const complaintHighlight = document.getElementById('complaint-container-highlight');
const highlightClose = document.getElementById('highlight-close-button');
const introText = document.getElementById('intro-text');


window.onload = function() {
  setClicks();
  complaintCount = 0;
};

function setClicks() {
  highlightClose.onclick = closeLightbox;
  complaintHighlight.onclick = doNothing;
  complaintLightbox.onclick = closeLightbox;
  ptButton.onclick = textToPortuguese;
  enButton.onclick = textToEnglish;
  sendButton.onclick = addComplaint;
}

function textToEnglish() {
  introText.innerHTML = TEXT_EN;
  enButton.classList.remove('language-button-clean');
  enButton.classList.add('language-button-selected');
  ptButton.classList.remove('language-button-selected');
  ptButton.classList.add('language-button-clean');
  complaintInput.setAttribute('placeholder', 'Complain here');
  sendButton.setAttribute('value', 'send');
}

function textToPortuguese() {
  introText.innerHTML = TEXT_PT;
  ptButton.classList.remove('language-button-clean');
  ptButton.classList.add('language-button-selected');
  enButton.classList.remove('language-button-selected');
  enButton.classList.add('language-button-clean');
  complaintInput.setAttribute('placeholder', 'Escreva aqui sua reclamação');
  sendButton.setAttribute('value', 'enviar');
}

function setOpacity(element, opacity, delay) {
  setTimeout(() => element.style.opacity = opacity, delay);
}

window.onscroll = function() {
  const introTextYLocation = document.getElementById('complaint-form').offsetTop - 256;
  const shareContainer = document.getElementById('desktop-share-container');
  shareContainer.style.top = (window.pageYOffset > introTextYLocation) ? '128px' : '-128px';
}

function randomRange(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return (max - min) * Math.random() + min;
}

function doNothing() {
  event.stopPropagation();
}

function closeLightbox() {
  complaintLightbox.style.opacity = '0';
  setTimeout(() => complaintLightbox.style.display = 'none', 500);
}

function showLightbox(complaint, colorClass, complaintFont) {
  complaintHighlight.classList = '';
  complaintHighlight.classList.add('complaint-container');
  complaintHighlight.classList.add(colorClass);

  const highlightTextElement = complaintHighlight.getElementsByClassName('complaint-text')[0];
  highlightTextElement.classList = '';
  highlightTextElement.classList.add('complaint-text');
  highlightTextElement.innerHTML = complaint;
  highlightTextElement.style['font-family'] = complaintFont;
  highlightTextElement.style['font-size'] = '';
  if(complaint.length < 120) {
    highlightTextElement.style['font-size'] = Math.max((100-complaint.length)/14, 3.3) + 'em';
  } else if(complaint.length < 180) {
    highlightTextElement.classList.add('complaint-text-size-medium');
  } else {
    highlightTextElement.classList.add('complaint-text-size-small');
  }

  complaintLightbox.style.display = 'block';
  setTimeout(() => complaintLightbox.style.opacity = '1', 1);
}

function postNewComplaint() {
  addComplaint();
}

function createComplaintElement(complaint) {
  const complaintP = document.createElement('p');
  const complaintDiv = document.createElement('div');

  complaintP.innerHTML = complaint.complaint;

  complaintP.classList.add('complaint-text');
  complaintP.style['font-size'] = Math.max((80-complaint.complaint.length)/14, 2.0) + 'em';
  complaintP.style['font-family'] = fontFamily[complaintCount % 3];

  const colorClass = `complaint-container-color-${complaintCount % 4}`;
  complaintDiv.classList.add('complaint-container');
  complaintDiv.classList.add(colorClass);
  complaintDiv.style.transform = `rotate(${randomRange(-10, 10)}deg)`;
  complaintDiv.onclick = (() => {
    showLightbox(complaint.complaint, colorClass, fontFamily[complaintCount % 3]);
  });

  complaintCount++;

  complaintDiv.appendChild(complaintP);
  complaintDiv.style.opacity = '0';
  return complaintDiv;
}

function addComplaint() {
  if (complaintInput.value.replace(/ /g, '').length < 1) return;
  const complaintElement = createComplaintElement({ complaint: complaintInput.value });
  const listDiv = document.getElementById('complaint-list');
  listDiv.insertBefore(complaintElement, listDiv.firstChild);
  setOpacity(complaintElement, '1', 100);
}
