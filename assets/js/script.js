
var Events;
var dateEl = $( '#title-date');
var date = moment();

$(document).ready(function() {
  setDate(date);
  setupUI();

  loadEvents();


    $( ".saveBtn" ).click(function() {
      var description = $(this).parent().find("textarea");
      var time = $(this).parent().find('p').text();
     saveEvent(description.val(), description.attr('id'));

    });

    $( "#prevBtn" ).click(function() {
        date = date.subtract(1, "days");
        setDate(date);
        setupUI();
        loadEvents();

    });
    $( "#nextBtn" ).click(function() {
      date = date.add(1, "days");
       setDate(date);
      setupUI();
      loadEvents();
  });
});

function setupUI() {
  $('.row').each(function(index, obj){

    var hour = moment().format('hh A');
    var currentSlot = moment(date.format("MM/DD/YYYY") + " " + obj.innerText, "MM/DD/YYYY hh A") ;
    var currentTime = moment(hour, 'h:mm A');

    if (currentSlot.isBefore(currentTime)) {
      $(this).find( "textarea").css( "background-color", "gray" );   
    } else if (currentSlot.isSame(currentTime)) {
      $(this).find( "textarea").css( "background-color", "red" );      
    } else if (currentSlot.isAfter(currentTime)) {
      $(this).find( "textarea").css( "background-color", "green" );  
    } 


    var text =  $(this).find("textarea");
    var textareaId = date.format("MMDDYYYY") + trimText(obj.innerText); 
    console.log(date.format("MMDDYYYY") + trimText(obj.innerText));
    text.attr('id', textareaId);
    text.text("");
  });
}
function setDate(myDate) {
    dateEl.text("Date: " +  myDate.format("MM/DD/YYYY"));
}
function trimText(str) {
  str = str.replace(":","");
  str = str.replace(" ","");

   return str;
}
function loadEvents() {
  //emptyTextArea();
  var savedData = getEvent();
  
  var savedData = JSON.parse(getEvent());
  
  if (savedData == null) {
    return ;
  }
  for (var i=0; i<savedData.length; i++) {
        
        var myDivElement = $( "#" + savedData[i].time);
        myDivElement.text(savedData[i].description);
  
  }
}
function emptyTextArea() {
  $('textarea').each(function(index, obj){
    obj.text("");
  });
}
function setTextareaId() {
    $('textarea').each(function(index, obj){ 
       // console.log(obj);
    //    obj.attr("id", ("01/23/2021" + " " + text));
  });
}
/*--------------------------------------------------------------
# Create object variable for saving score details
--------------------------------------------------------------*/
function createEventbject(description, time) {
  var object = {
      "description": description, 
      "time": time,
  }
  return object;
}
function getEvent() {
  return  localStorage.getItem("event");
}
/*--------------------------------------------------------------
# Method to save Score 
--------------------------------------------------------------*/
function saveEvent(text, time) {
  var object = createEventbject(text, time);
  console.log(object);

  var savedData = getEvent();
  
  if (savedData === null) { 
      Events = [object];
  } else {
      Events = JSON.parse(savedData);
      Events.push(object);
  }   
  //console.log(JSON.stringify(Events));

  localStorage.setItem('event', JSON.stringify(Events));
  alert("Saved");
}

