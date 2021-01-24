
var Events;
$(document).ready(function() {
  
  
    $('.row').each(function(index, obj){
      var hour = moment().format('hh A');

      var beginningTime = moment(obj.innerText, 'h:mm A');
      var endTime = moment(hour, 'h:mm A');

      if (beginningTime.isBefore(endTime)) {
        $(this).find( "textarea").css( "background-color", "gray" );   
      } else if (beginningTime.isSame(endTime)) {
        $(this).find( "textarea").css( "background-color", "red" );      
      } else if (beginningTime.isAfter(endTime)) {
        $(this).find( "textarea").css( "background-color", "green" );  
      } 
    });
    loadEvents();


    $( ".saveBtn" ).click(function() {

      var description = $(this).parent().find("textarea").val();
      var time = $(this).parent().find('p').text();

     saveEvent(description, time);

    });
});
function loadEvents() {
  var savedData = getEvent();
  console.log(savedData);

  for (var i=0; i<savedData.length; i++) {
   // console.log(savedData[i].description);
   // console.log(savedData[i].time);

    console.log($(savedData[i].time));
  }

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
  return   JSON.parse(localStorage.getItem("event"));
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
}

