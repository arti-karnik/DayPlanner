
var Events;
var dateEl = $( '#title-date');
var date = moment();

$(document).ready(function() {
  setDate(date);
  loadEvents();
        setupUI();
 // setTextareaId();



    $( ".saveBtn" ).click(function() {
      var description = $(this).parent().find("textarea");
      var time = $(this).parent().find('p').text();
     saveEvent(description.val(), description.attr('id'));

    });

    $( "#prevBtn" ).click(function() {
        date = date.subtract(1, "days");
        setDate(date);
        setupUI();

    });
    $( "#nextBtn" ).click(function() {
      date = date.add(1, "days");
       setDate(date);
      setupUI();
  });
});

function setupUI() {
  $('.row').each(function(index, obj){
    
    /*
    var hour = moment().format('hh A');
      var currentTime = date.format("MM/DD/YYYY hh A") + " " +  obj.innerText;


    var beginningTime = moment(currentTime, 'h:mm A');
    var endTime = moment(hour, 'h:mm A');
    //var beginningTime = moment(currentTime, "MM/DD/YYYY hh A");
    //var endTime = moment(hour, 'MM/DD/YYYY hh A');
    
    
    console.log(beginningTime, endTime);


    if (beginningTime.isBefore(endTime)) {
      $(this).find( "textarea").css( "background-color", "gray" );   
    } else if (beginningTime.isSame(endTime)) {
      console.log("SAME.....");

      $(this).find( "textarea").css( "background-color", "red" );      
    } else if (beginningTime.isAfter(endTime)) {
      console.log("after");

      $(this).find( "textarea").css( "background-color", "green" );  
    } */

    var hour = moment().format('hh A');
    var currentTime = moment(date.format("MM/DD/YYYY") + " " + obj.innerText, "MM/DD/YYYY hh A") ;
    var endTime = moment(hour, 'h:mm A');

    console.log("current time : " + currentTime);

    if (currentTime.isBefore(endTime)) {
          console.log("BEofre");
    }  else if (currentTime.isAfter(endTime)) {
      console.log("after");
      } else if (currentTime.isSame(endTime)) {
          console.log("same");
    }  
     

    //var beginningTime = moment(obj.innerText, 'h:mm A');

    if (currentTime.isBefore(endTime)) {
      $(this).find( "textarea").css( "background-color", "gray" );   
    } else if (currentTime.isSame(endTime)) {
      $(this).find( "textarea").css( "background-color", "red" );      
    } else if (currentTime.isAfter(endTime)) {
      $(this).find( "textarea").css( "background-color", "green" );  
    } 


    var text =  $(this).find("textarea");
    var textareaId = date + trimText(obj.innerText); 
    text.attr('id', textareaId);
    //setDate(date);

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
  var savedData = getEvent();
  
  // var myDivElement = $( "#012320211000AM" );
  // myDivElement.text("abcdfef");

  var savedData = JSON.parse(getEvent());
  
  if (savedData == null) {
    return ;
  }
  for (var i=0; i<savedData.length; i++) {
        
        var myDivElement = $( "#" + savedData[i].time);
        myDivElement.text(savedData[i].description);
  
  }
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

