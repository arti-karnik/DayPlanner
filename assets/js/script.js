
var Events;
var dateEl = $( '#title-date');
var date = moment();
var today =  moment();
var nextweek = 0;
var newMoment;

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var times = ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM","04:00 AM","05:00 AM","06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
"12:00 PM", "01:00 PM", "02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM","11:00 PM",];
var week = [];

var timeState = {
  past: "gray",
  present: "red",
  future: "green"
}

$(document).ready(function() {
  setUpIdMonth();
  setupUI();
    $( ".saveBtn" ).click(function() {
      var description = $(this).parent().find("textarea");
     saveEvent(description.val(), description.attr('id'));
    });

    $( "#prevBtn" ).click(function() {
        date = date.subtract(1, "days");
        setupUI();
    });
    $( "#nextBtn" ).click(function() {
      date = date.add(1, "days");
      setupUI();
  });

  $( "#prevWeekBtn" ).click(function() {
       alert("prev week clicked");
       date = today.subtract(7, "days");
       setUpIdMonth();
});

$( "#nextWeekBtn" ).click(function() {
      alert("next week clicked");
      today = today.add(7, "days");
      setUpIdMonth();
});

});
function getTextAreaId() {
  var day = "Monday";
  var time = "4:00AM";
  var date1 = "01/23/2021";
  return  trimText(date1 + day + time);

}

function checkTime(currentTime, currentSlot) {
  if (currentSlot.isBefore(currentTime)) {
        return timeState.past
  } else if (currentSlot.isSame(currentTime)) {

    return timeState.present;
  } else if (currentSlot.isAfter(currentTime)) {

    return timeState.future;
  } 
}

function getDay() {
  var day = moment().format("d");

  return day;

  console.log(day);
}
function setUpIdMonth() {
  week = [];

  var currentTime = date.format("MM/DD/YYYY dddd hh A");
  var diff;
  var calculateDate = "";

  $('table  thead tr th').each(function(index, obj){
        console.log($(this).text());
  });


  $('table  tbody tr td').each(function(index, obj){
    $(this).text("");

    var index_time = $(this).parent().parent().children().index(this.parentNode);
    var index_day = $(this).parent().children().index(this);

    var currentDay = getDay();
    var slotDay = index_day - 1;
    var text = "";

      if (currentDay == slotDay) {
        var hour = moment().format('MM/DD/YYYY dddd hh A');
        var currentSlot = moment(date.format("MM/DD/YYYY") + " " + days[index_day - 1] + " " + times[index_time], "MM/DD/YYYY dddd hh A") ;
        var currentTime = moment(hour, 'MM/DD/YYYY dddd hh A');
        var status = checkTime(currentTime,currentSlot);
        text= getText(today.format("MMDDYYYY"),  times[index_time]);
        $(this).css("background-color", "red");
        calculateDate = today.format("MM/DD/YYYY");
      } else if (currentDay < slotDay) {
        diff = slotDay - currentDay;
        const nextDay = today.clone().add(diff, 'days');
        text = getText(nextDay.format("MMDDYYYY"),  times[index_time]);
        //$(this).text(text);
        $(this).css("background-color", "green");
        calculateDate = nextDay.format("MM/DD/YYYY");


      } else {
        diff = slotDay - currentDay;
        const prevDay = today.clone().subtract(diff, 'days');
        text = getText(prevDay.format("MMDDYYYY"), times[index_time]);
        //$(this).text(text);
        $(this).css("background-color", "gray");
        calculateDate = prevDay.format("MM/DD/YYYY");

        //week.indexOf(prevDay.format("MM/DD/YYYY")) === -1 ? week.push(prevDay) : console.log("This item already exists");
      }
      pushDateInArray(calculateDate);
      var textareaId = trimText(text); 

      $(this).attr("id", textareaId);
      //$(this).text(textareaId);
      loadEvents();
});

    $('#table-head').find('th').each(function(index, obj){
        if (index != 0) {
          $(this).css("background-color", "pink");  
          $(this).text(days[index - 1] + " (" + week[index - 1] + ")");
      } 
    });

    $('#title-month').text( week[0] + " to " + week[week.length - 1]);
    $('#title-month').css("background-color", "pink");  

      console.log(week);
}
function pushDateInArray(weekDate) {

    if (week.indexOf(weekDate) === -1) {
        week.push(weekDate);
    }
   
}
function getText(myDate, myTime) {
  var str = myDate;
 //str += myDay;
  str += myTime;
  return str;
}
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
    text.attr('id', textareaId);
    text.text("");
    setDate(date);
    loadEvents();

  });
}
function setDate(myDate) {
    dateEl.text("Date: " +  myDate.format("MM/DD/YYYY"));
}
function trimText(str) {
  str = str.replace(":","");
  str = str.replace(" ","");
  str = str.replace("/","");
  str = str.replace("/","");

   return str;
}
function loadEvents() {
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
  localStorage.setItem('event', JSON.stringify(Events));
  alert("Saved");
}

