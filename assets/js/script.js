
var Events;
var dateEl = $( '#title-date');
var tableEl = $( '#table-contents');

var date = moment();
var today =  moment();
var nextweek = 0;
var newMoment;

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var times = ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM","04:00 AM","05:00 AM","06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
"12:00 PM", "01:00 PM", "02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM","11:00 PM",];
var week = ["","","","","","",""];
var month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];

var eventView = {
  week: "week",
  day: "day",
}

function createWeekView() {
      for (var i=0 ;i < times.length; i++) {
        var rowEl = $("<tr></tr>");   // Create with jQuery

       // var rowEl = $('tr').createElement();
        var rowheaderEl = $('<th></th>');

        rowheaderEl.text(times[i]);
        rowEl.append(rowheaderEl);

        for (var j=0; j<days.length; j++) {
          var colEl = $('<td></td>');
          colEl.text(days[j] + " " + times[i]);

          var textArea = $('<textarea></textarea>').addClass("table-text");
          colEl.append(textArea);
          rowEl.append(colEl);
        }

        tableEl.append(rowEl);
      }
}
$(document).ready(function() {

  createWeekView();
  setUpIdMonth();
  setUpIdMonth();

 // setupUI();
    $( ".button-save" ).click(function() {
      alert("in ssved");
      var description = $(this).parent().find("textarea");
     saveEvent(description.val(), description.attr('id'));
    });

    $( "#prevDayBtn" ).click(function() {
        date = date.subtract(1, "days");
        setupUI();
    });
    $( "#nextDayBtn" ).click(function() {
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

  $( "#weekBtn" ).click(function() {
    alert("week btn clicked");

});

$( "#dayBtn" ).click(function() {
  alert("day btn clicked");

});

});
function getTextAreaId() {
  var day = "Monday";
  var time = "4:00AM";
  var date1 = "01/23/2021";
  return  trimText(date1 + day + time);

}

function getDay() {
  var day = moment().format("d");

  return day;

}
function getColor(startTime, endTime) {
    if (startTime.isBefore(endTime)) {
      return "past"; 
    } else if (startTime.isAfter(endTime)) {
      return "future";  
    } else {
      return "present";
    }
}
function setUpIdMonth() {
  week = [];

  var currentTime = date.format("MM/DD/YYYY dddd hh A");
  var diff;
  var calculateDate = "";
  var currentSlot;
  var currentTime
  var hour = moment().format('MM/DD/YYYY dddd hh A');
  currentTime = moment(hour, 'MM/DD/YYYY dddd hh A');


  $('table  tbody tr td').each(function(index, obj){
    $(this).text("");

       var index_time = $(this).parent().parent().children().index(this.parentNode);
       var index_day = $(this).parent().children().index(this);

        var currentDay = getDay();
        var slotDay = index_day - 1;
        var text = "";
       
      if (currentDay == slotDay) {
        currentSlot = moment(date.format("MM/DD/YYYY") + " " + days[index_day - 1] + " " + times[index_time], "MM/DD/YYYY dddd hh A") ;
        text= getText(today.format("MMDDYYYY"),  times[index_time]);
      //  $(this).text(text);
        calculateDate = today.format("MM/DD/YYYY");
        pushDateInArray(calculateDate, today.format("d"));

      } 
      else if (currentDay < slotDay) {
        diff = slotDay - currentDay;
        const nextDay = today.clone().add(diff, 'days');
        text = getText(nextDay.format("MMDDYYYY"),  times[index_time]);
        calculateDate = nextDay.format("MM/DD/YYYY");
        pushDateInArray(calculateDate, nextDay.format("d"));

       // $(this).text(text);

      } else {

        diff = Math.abs(slotDay - currentDay);

        const prevDay = today.clone().subtract(diff, 'days');
        text = getText(prevDay.format("MMDDYYYY"), times[index_time]);
        calculateDate = prevDay.format("MM/DD/YYYY");
        pushDateInArray(calculateDate, prevDay.format("d"));

      //  $(this).text(text);

      }

      var str = (calculateDate + " " + times[index_time]);
      const dt = moment(str, 'MM/DD/YYYY hh A')

      var textareaId = trimText(text); 
      $(this).attr("id", textareaId);
      loadEvents(eventView.week);

      if (dt.isBefore(currentTime)) {
        $(this).removeClass();
        $(this).addClass("past");
      } else if (dt.isAfter(currentTime)) {
        $(this).removeClass();

        $(this).addClass("future");
      } else {
        $(this).removeClass();

        $(this).addClass("present");
      }
});

    $('#table-head').find('th').each(function(index, obj){
        if (index != 0) {
          $(this).text(days[index - 1] + " (" + week[index - 1] + ")");
      } 
    });

    $('#title-month').text("Week: " + week[0] + " to " + week[week.length - 1]);
}

function pushDateInArray(weekDate, no) {

  if (week[no] != weekDate) {

    week[no] = weekDate ;
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

    var textArea =  $(this).find("textarea");
    textArea.val("");

    if (currentSlot.isBefore(currentTime)) {
        textArea.removeClass().addClass("past");  
    } else if (currentSlot.isSame(currentTime)) {
        textArea.removeClass().addClass("present");  
    } else if (currentSlot.isAfter(currentTime)) {
        textArea.removeClass().addClass("future");   
    }

    var textareaId = date.format("MMDDYYYY") + trimText(obj.innerText); 
    textArea.attr('id', textareaId);
    setDate(date);
    loadEvents(eventView.day);
  });
}
function setDate(myDate) {
    dateEl.text("Date: " +  myDate.format("dddd, MM/DD/YYYY"));
}
function trimText(str) {
  str = str.replace(":","");
  str = str.replace(" ","");
  str = str.replace("/","");
  str = str.replace("/","");

   return str;
}
function loadEvents(view) {
  var savedData = getEvent();
  var savedData = JSON.parse(getEvent());
  if (savedData == null) {
    return ;
  }
  for (var i=0; i<savedData.length; i++) {
      var myDivElement = $( "#" + savedData[i].time);
      if  (view == eventView.week) {
        myDivElement.text(savedData[i].description);
      } else {
        myDivElement.val(savedData[i].description);

      }

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


