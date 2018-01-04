$('.user-title').on('input', enableSaveBtn);
$('.user-content').on('input', enableSaveBtn);
$('.save-btn').on('click', storeIdeaCards);
$('.parent-box').on('click', '.delete-btn', deleteCard);
$('.parent-box').on('click', '.upvote-btn', upvoteCard);
$('.parent-box').on('click', '.downvote-btn', downvoteCard);
$('.parent-box').on('blur', '.edit-title', editTitle);
$('.parent-box').on('blur', '.edit-content', editContent);
$('#search').on('keyup', search);
$('.parent-box').on('click', '.completed-task-btn', completeTask);
$('.show-completed-btn').on('click', showCompletedTasks);
$('.parent-box').on('click', '.upvote-importance', cardImportanceUpvote);
$('.parent-box').on('click', '.downvote-importance', cardImportanceDownvote);
$('.more-tasks').on('click', showMoreTasks);
$('.critical').on('click', sortCritical);
$('.high').on('click', sortHigh);
$('.normal').on('click', sortNormal);
$('.low').on('click', sortLow);
$('.none').on('click', sortNone);

$(document).ready(function() {
  if(localStorage.length < 10){
  for(var i = 0; i < localStorage.length ; i++){
    var key = localStorage.key(i);
    getIdeaFromStorage(key);
    hideCompleted(key);
  }
  }else {
  for(var i = localStorage.length -10; i < localStorage.length ; i++){
    var key = localStorage.key(i);
    getIdeaFromStorage(key);
    hideCompleted(key);
  }
}
});

function showMoreTasks() {
  for(var i = localStorage.length -11; i >= 0; i--){
    var key = localStorage.key(i);
    getIdeaFromStorage(key)
  }
}

function showCompletedTasks() {
  for(var i = 0; i < localStorage.length; i++){
    var key = localStorage.key(i);
    var parsedObject = JSON.parse(localStorage.getItem(key));
    if(parsedObject.complete === 'complete-task') {
      getIdeaFromStorage(key)
    }
  }
}

function hideCompleted(key) {
  var parsedObject = JSON.parse(localStorage.getItem(key));  
  if (parsedObject.complete === 'complete-task') {
    $(`#${parsedObject.id}`).remove();
  }
}

function enableSaveBtn(e){
  var $title = $('.user-title');
  var $content = $('.user-content');
  if ($title.val() && $content.val()){
    $('.save-btn').attr('disabled', false); 
  } else {
    $('.save-btn').attr('disabled', true);
    setTimeout(function(){$('.missing-input-text').text('');}, 3000);
  }
};

function IdeaData(title, content, id, quality, qualityCount, complete, importance) {
  this.title = title;
  this.content = content;
  this.id = id;
  this.quality = quality;
  this.qualityCount = qualityCount || 0; 
  this.complete = 'not-complete';
  this.importance = 'Normal';
  this.importanceCount = 2;
}

function storeIdeaCards(e) {
  e.preventDefault();
  var ideaObject = new IdeaData( $('.user-title').val(), $('.user-content').val(), Date.now(),'Swill', 0, 'Normal');
  var stringifyObject = JSON.stringify(ideaObject);
  var key = ideaObject.id;
  localStorage.setItem(key, stringifyObject);  
  getIdeaFromStorage(key);
  clearFields()
}

function clearFields() {
  $('.user-content').val('');
  $('.user-title').val('');
  $('.user-title').focus();
}

function getIdeaFromStorage(key) {
  var parsedObject = JSON.parse(localStorage.getItem(key));
  var title = parsedObject.title;
  var content = parsedObject.content;
  var id = parsedObject.id;
  var quality = parsedObject.quality;
  var complete = parsedObject.complete;
  var importance = parsedObject.importance;
  createCard(title, content, id, quality, complete, importance);
}

function createCard(title, content, id, quality, complete, importance){
  $('.parent-box').prepend(`
    <article id=${id} class=${complete}>
    <h2 class="edit-title" contenteditable="true">${title}</h2>
    <button class="delete-btn"></button>     
    <button class="completed-task-btn">Completed</button>
    <p class="edit-content" contenteditable="true">${content}</p>
    <footer>
    <div class="quality-line">
      <button class="upvote-btn"></button>
      <button class="downvote-btn"></button>
      <h4>quality: <span class="quality">${quality}</span></h4>
    </div>
    <div>
      <button class="upvote-importance"></button>
      <button class="downvote-importance"></button>
      <h4>importance: <span class="importance">${importance}</span></h4>
    </div>
    </footer>
    </article>`);
  $('.save-btn').attr('disabled', true);
}

function deleteCard(key) {
  var card = $(this).closest('article');
  var cardId = card.attr('id');
  localStorage.removeItem(cardId);
  $(this).closest('article').remove()
}

function upvoteCard() {
  var card = $(this).closest('article');
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  if(parsedObject.qualityCount < 2) {
    upvoteQuality(parsedObject, card);
  }
  localStorage.setItem(key, JSON.stringify(parsedObject));
};


function upvoteQuality(parsedObject, card) {
  var arrayQuality = ["Swill", "Plausible", "Genius"];
  parsedObject.qualityCount++;
  parsedObject.quality = arrayQuality[parsedObject.qualityCount];
  card.find(".quality").text(arrayQuality[parsedObject.qualityCount]);
}


function downvoteCard() {
  var card = $(this).closest('article');
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  if(parsedObject.qualityCount > 0) {
    downvoteQuality(parsedObject, card);
  }
  localStorage.setItem(key, JSON.stringify(parsedObject));
}

function downvoteQuality(parsedObject, card) {
  var arrayQuality = ["Swill", "Plausible", "Genius"];
  parsedObject.qualityCount--;
  parsedObject.quality = arrayQuality[parsedObject.qualityCount];
  card.find(".quality").text(arrayQuality[parsedObject.qualityCount]);
}

function cardImportanceUpvote(){
  var card = $(this).closest('article');
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  if(parsedObject.importanceCount < 5) {
    upvoteImportance(parsedObject, card);
  }
  localStorage.setItem(key, JSON.stringify(parsedObject));
}

function upvoteImportance(parsedObject, card) {
  var importanceQuality = ['None', 'Low','Normal', 'High', 'Critical'];
  parsedObject.importanceCount++;
  parsedObject.importance = importanceQuality[parsedObject.importanceCount];
  card.find(".importance").text(importanceQuality[parsedObject.importanceCount]);
}

function cardImportanceDownvote(){
  var card = $(this).closest('article');
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  if(parsedObject.importanceCount > 0) {
    downvoteImportance(parsedObject, card);
  }
  localStorage.setItem(key, JSON.stringify(parsedObject));
}

function downvoteImportance(parsedObject, card) {
  var importanceQuality = ['None', 'Low','Normal', 'High', 'Critical'];
  parsedObject.importanceCount--;
  parsedObject.importance = importanceQuality[parsedObject.importanceCount];
  card.find(".importance").text(importanceQuality[parsedObject.importanceCount]);
}
 
function editTitle() {
  var newTitle = $(this).text();
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  parsedObject.title = newTitle;
  var stringifyObject = JSON.stringify(parsedObject);
  localStorage.setItem(key, stringifyObject);
}

function editContent() {
  var newContent = $(this).text();
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  parsedObject.content = newContent;
  var stringifyObject = JSON.stringify(parsedObject);
  localStorage.setItem(key, stringifyObject);
}

function search() {
  var $search = $('#search').val().toLowerCase();
  $('article').each(function(){
    var $results = $(this).text().toLowerCase().indexOf($search);
    this.style.display = $results > -1 ? "" : "none";
  })
}

function completeTask() {
  $(this).closest('article').toggleClass('complete-task');
  var key = $(this).closest('article').attr('id');
  var parsedObject = JSON.parse(localStorage.getItem(key));
  if (parsedObject['complete'] === 'complete-task') {
    parsedObject['complete'] = 'not-complete';
  } else if (parsedObject['complete'] === 'not-complete') {
    parsedObject['complete'] = 'complete-task'; 
  }
  localStorage.setItem(key, JSON.stringify(parsedObject));
};

function sortCritical() {
$('article').each(function(){
  if($(this).find('.importance').text() !== $('.critical').val()){
    $(this).hide();
    }
  })
}

function sortHigh() {
$('article').each(function(){
  if($(this).find('.importance').text() !== $('.high').val()){
    $(this).hide();
    }
  })
}

function sortNormal() {
$('article').each(function(){
  if($(this).find('.importance').text() !== $('.normal').val()){
    $(this).hide();
    }
  })
}

function sortLow() {
$('article').each(function(){
  if($(this).find('.importance').text() !== $('.low').val()){
    $(this).hide();
    }
  })
}

function sortNone() {
$('article').each(function(){
  if($(this).find('.importance').text() !== $('.none').val()){
    $(this).hide();
    }
  })
}