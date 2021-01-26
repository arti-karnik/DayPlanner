
var dateEl = $( '#title-date');
var weekView = $( '#weekView');
var singleView = $( '#singledayView');
var monthView = $( '#monthView');
var tableEl = $( '#week-contents');
var tableMonth = $('calendar');
var timeSelectEl = $('timeSlot');
var monthAndYear = $("#monthAndYear");
var date = moment();
var today =  moment();
var currentMonth = today.format("M") - 1;
var currentYear = today.format("YYYY");
var currentView;
var selectYear = $("#year");
var selectMonth = $("#month");
var selectedDate;
var selectedTime;
var view = {
  day: "day",
  week: "week",
  month: "month"
}
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var times = ["00:00 AM", "01:00 AM", "02:00 AM", "03:00 AM","04:00 AM","05:00 AM","06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
"12:00 PM", "01:00 PM", "02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM","11:00 PM",];
var week = ["","","","","","",""];
var months = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];


//========================  Single Day Event ====================================================//

$(document).ready(function() { 
  
  currentView = view.day;
  
  showCalendar(currentMonth,currentYear);
  
  addtimeSlots();
  
  createWeekEvent_Elements();
  setUpIdMonth();
  
  createSingleDayEventElements();
  setupUISingleDayEvent();
  
  
  singleView.show();
  weekView.hide();
  monthView.hide();
  
  
  ///=====   Button click events  ===== ////
  $( ".button-save" ).click(function() {
    var description = $(this).parent().find("textarea");
    saveEvent(description.val(), description.attr('id'), date.format("MMDDYYYY"));
  })
  
  $( "#prevDayBtn" ).click(function() {
    if (currentView == view.day) {
      prevDay();
    } else if (currentView == view.week) {
      prevWeek();
    } else {
      prevMonth();
    }
    
  });
  $( "#nextDayBtn" ).click(function() {
    if (currentView == view.day) {
      nextDay();
    } else if (currentView == view.week) {
      nextWeek();
    }  else if (currentView == view.month) {
      nextMonth();
    }
  });
  
  $("#selectTime").change(function(){
    ($(this).val() == 1) ?  $('.divallDay').hide() : $('.divallDay').show();
  });
  
  
  $('#calendar').on('click', 'tbody td', function (e) {
    var desc = $(this).find('h6').text();
    var dt = $(this).find('p').text();
    var str = (currentYear + "-" + Math.abs(currentMonth - 1)  + "-" + dt);
    
      const myMomentObject = moment(str, 'YYYY-MM-DD')
      loadModaldetails(myMomentObject.format("MM/DD/YYYY"), "00:AM", desc); 
  });
  
  $('#weekView').on('click', 'tbody td', function (e) {
    var desc = $(this).find('h6').text();
    var str = $(this).attr('data-number');
    
    const myMomentObject = moment(str, 'MM/DD/YYYY hh:mm A');
    
    loadModaldetails(myMomentObject, myMomentObject.format("hh:mm A"), desc);
  });
  
  $("#dayView").on("click", 'textarea', function(e) {
    var slot = $(this).parent().find('p').text();
    loadModaldetails(date, slot, $(this).text());
  });
  
  $("#selectDay").change(function(){
    if ($(this).val() == 1) {
      currentView = view.day;
      showView(currentView);

      setupUISingleDayEvent();
      loadEvents();
      
    } else if ($(this).val() == 3) {
      currentView = view.month;
      showView(currentView);

      showCalendar(currentMonth, currentYear);
      showEventsCalendar();
    } else if ($(this).val() == 2) {
      currentView = view.week;
      showView(currentView);

      setUpIdMonth();
      loadEvents();
    }

  });
  ///========================================
});
//===========================================================================//
function showView(_view) {
  if (_view == view.day) {
    console.log("oen m");

    weekView.hide();
    monthView.hide();
    singleView.show();

  } else if (_view == view.week) {
    console.log("on m");

    weekView.show();
    monthView.hide();
    singleView.hide();

  } else {
    console.log("on mq");

    weekView.hide();
    monthView.show();
    singleView.hide();
  }
}
function next() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}

function previous() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}

function jump() {
  currentYear = parseInt(selectYear.value);
  currentMonth = parseInt(selectMonth.value);
  showCalendar(currentMonth, currentYear);
}


function save(date) {
  
  var date = $('#descmodal').find('#modal-date-text').text();
  var time =  $('#descmodal').find('#timeSlot').val();
  var desciption = $("#description-text").val();
  console.log($('#descmodal').find('#modal-date-text').text());
  
  var identifier = createUniqueIdentifier(date,time);
  var date = createUniqueIdentifier(date,"");
  console.log(identifier);
  
  saveEvent(desciption, identifier, date);
  loadEvents();
}

function createUniqueIdentifier(_date, _time) {
  var str = _date;
  str += _time;
  str = str.replaceAll(":","");
  str = str.replaceAll(" ","");
  str = str.replaceAll("Date","");
  str = str.replaceAll("/","");
  return str;
}
function addtimeSlots() {
  for (var i=0; i<times.length; i++) {
    var optionEl = $('<option></option>');
    optionEl.text(times[i]);
    $('#descmodal').find('#timeSlot').append(optionEl); 
  }
}
//========================  Single Day Event ====================================================//
function loadSingleDayEvent() {
  createSingleDayEventElements();
  setupUISingleDayEvent();
}

function setupUISingleDayEvent() {
  $('.row').each(function(index, obj){
    
    var hour = moment().format('hh A');
    var currentSlot = moment(date.format("MM/DD/YYYY") + " " + obj.innerText, "MM/DD/YYYY hh A") ;
    var currentTime = moment(hour, 'h:mm A');
    
    var textareaId = createUniqueIdentifier(date.format("MMDDYYYY"), obj.innerText);
    var textArea =  $(this).find("textarea");
    textArea.val("")
    .removeClass()
    .addClass(getColor(currentSlot, currentTime))
    .attr('id', textareaId)
    
    dateEl.text("Date: " +  date.format("dddd, MM/DD/YYYY"));
  });
  
  loadEvents();
  
}
function getColor(_slot, _actual) {
  
  if (_slot.isBefore(_actual)) {
    return "past";
  } else if (_slot.isSame(_actual)) {
    return "present";  
  } else if (_slot.isAfter(_actual)) {
    return "future";   
  }
}
function createSingleDayEventElements() {
  singleView.html('');
  
  for (var i=0; i<times.length; i++) {
    var divEl = $("<div></div>");
    divEl.addClass('row');
    divEl.addClass('form-inline');
    
    var hourEl = $('<p></p>');
    hourEl.text(times[i]);
    
    var descriptionEl = $('<textarea></textarea>');
    descriptionEl.addClass("textarea");
    
    var saveButton = $('<button></button>');
    saveButton.addClass('button button-save');
    saveButton.attr('id','saveBtn');
    var font = $('<i></i>');
    font.addClass('fa fa-check');
    saveButton.append(font);
    
    divEl.append(hourEl);
    divEl.append(descriptionEl);
    divEl.append(saveButton);
    singleView.append(divEl);
    
    if (i < 9 || i > 18) {
      divEl.addClass("divallDay");
      divEl.hide();
    }
  }
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
    myDivElement.val(savedData[i].description);
  }
}

function showEventsCalendar() {
  var savedData = getEvent();
  var savedData = JSON.parse(getEvent());
  if (savedData == null) {
    return ;
  }
  for (var i=0; i<savedData.length; i++) {
    var myDivElement = $( "#" + savedData[i].date);
    myDivElement.text(savedData[i].description);
    // myDivElement.val(savedData[i].description);
  }
}

//================================================================================================ 

//========================  Day Event ====================================================//

function loadModaldetails(_date, _time, _description){
  $('#descmodal').find('#modal-date-text').text("Date: "+  _date.format("MM/DD/YYYY")); 
  $('#descmodal').find('#timeSlot').val(_time); 
  $('#descmodal').find('#description-text').val(_description); 
}

//================================================================================================ 

//========================  Weeks  Event ====================================================//
function createWeekEvent_Elements() {
  
  for (var i=0 ;i < times.length; i++) {
    var rowEl = $("<tr></tr>");  
    rowEl.attr("data-toggle", "modal");
    rowEl.attr("data-target", "#descmodal");
    var rowheaderEl = $('<th></th>');
    
    rowheaderEl.text(times[i]);
    rowEl.append(rowheaderEl);
    
    for (var j=0; j<days.length; j++) {
      var colEl = $('<td></td>');
      colEl.text(days[j] + " " + times[i]);
      rowEl.append(colEl);
    }
    
    if (i < 9 || i > 18) {
      rowEl.addClass("divallDay");
      rowEl.hide();
    }
    tableEl.append(rowEl);
  }
}
function getText(myDate, myTime) {
  var str = myDate;
  //str += myDay;
  str += myTime;
  return str;
}
function pushDateInArray(weekDate, no) {
  
  if (week[no] != weekDate) {
    
    week[no] = weekDate ;
  }
}
function setUpIdMonth() {
  
  //var table = $("#tableWeek tbody");
  
  week = [];
  
  var currentTime = date.format("MM/DD/YYYY dddd hh A");
  var diff;
  var calculateDate = "";
  var currentSlot;
  var currentTime
  var hour = moment().format('MM/DD/YYYY dddd hh A');
  currentTime = moment(hour, 'MM/DD/YYYY dddd hh A');
  
  
  $("#tableWeek tbody tr td").each(function (index, obj) {
    $(this).text("");
    
    var index_time = $(this).parent().parent().children().index(this.parentNode);
    var index_day = $(this).parent().children().index(this);
    
    var currentDay = today.format("d");// getDay();
    var slotDay = index_day - 1;
    var text = "";
    
    if (currentDay == slotDay) {
      currentSlot = moment(date.format("MM/DD/YYYY") + " " + days[index_day - 1] + " " + times[index_time], "MM/DD/YYYY dddd hh A") ;
      text= getText(today.format("MMDDYYYY"),  times[index_time]);
      calculateDate = today.format("MM/DD/YYYY");
      pushDateInArray(calculateDate, today.format("d"));
    } 
    else if (currentDay < slotDay) {
      diff = slotDay - currentDay;
      const nextDay = today.clone().add(diff, 'days');
      text = getText(nextDay.format("MMDDYYYY"),  times[index_time]);
      calculateDate = nextDay.format("MM/DD/YYYY");
      pushDateInArray(calculateDate, nextDay.format("d"));
    } else {
      
      diff = Math.abs(slotDay - currentDay);
      
      const prevDay = today.clone().subtract(diff, 'days');
      text = getText(prevDay.format("MMDDYYYY"), times[index_time]);
      calculateDate = prevDay.format("MM/DD/YYYY");
      pushDateInArray(calculateDate, prevDay.format("d"));
      
      
    }
    var str = (calculateDate + " " + times[index_time]);
    const dt = moment(str, 'MM/DD/YYYY hh A')
    
    var textareaId = trimText(text); 
    $(this).attr("id", textareaId);
    loadEvents();
    
    if (dt.isBefore(currentTime)) {
      $(this).removeClass().addClass("past");
    } else if (dt.isAfter(currentTime)) {
      $(this).removeClass();
      
      $(this).addClass("future");
    } else {
      $(this).removeClass();
      $(this).addClass("present");
    }
    $(this).attr('data-number', calculateDate + " " + times[index_time]);
    
  });
  
  $('#table-head').find('th').each(function(index, obj){
    if (index != 0) {
      $(this).text(days[index - 1] + " (" + week[index - 1] + ")");
    } 
  });
  
  dateEl.text("Week: " + week[0] + " to " + week[week.length - 1]);
  $(this).addClass("past");
  
  
  $('#title-month').text("Week: " + week[0] + " to " + week[week.length - 1]);
}

//================================================================================================ 

//========================  Month Event ====================================================//
function createMonthEvent_Elements() {
  
}
function getDay(month, year) {
  var startDt = new Date( (month + 1) + "/01/" + year);
  var defaultStart = moment(startDt.valueOf()).format("d");
  return  defaultStart;
}
function getDate(myDate) {
  return myDate.format("MM/DD/YYYY");
}
function getMonth(myDate) {
  return myDate.format("M");
}
function getYear(myDate) {
  return myDate.format("YYYY");
}
function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}
function trimText(str) {
  str = str.replaceAll(":","");
  str = str.replace(" ","");
  str = str.replace("/","");
  str = str.replace("/","");
  
  return str;
}
function showCalendar(month, year) {
  
  var firstDay=  getDay(month, year);
  var descText = "";
  
  tbl = $('#calendar-body'); // body of the calendar
  tbl.html('');
  
  
  selectYear.value = year;
  selectMonth.value = month;
  
  let date = 1;
  for (let i = 0; i < 6; i++) {
    let row = $("<tr></tr>");
    row.attr("data-toggle", "modal");
    row.attr("data-target", "#descmodal");
    
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = $("<td></td>");
        cellText = $("<p></p>");
        descText = $("<h6></h6>");
        descText.addClass("calendar-event");
        
        cell.append(cellText);
        cell.append(descText);
        row.append(cell);
      }
      else if (date > daysInMonth(month, year)) {
        break;
      }
      
      else {
        cell = $("<td></td>");
        cellText = $("<p></p>");
        cellText.text(date);
        
        descText = $("<h6></h6>");
        descText.addClass("calendar-event");
        
        var str = moment(date + months[month] + year);
        const myMomentObject = moment(str, 'YYYY-MM-DD')
        var textareaId = createUniqueIdentifier(myMomentObject.format("MM/DD/YYYY"), "");
        
        if (date == moment().format("D") && month  == (moment().format("M") - 1) && year == moment().format("YYYY")) {
          cell.addClass("present");
        } else if (myMomentObject.isBefore(today)) {
          cell.addClass("past");
        } else {
          cell.addClass("future");
        }
        descText.attr('id', textareaId);
        // color today's date
        
        cell.append(cellText);
        cell.append(descText);
        
        row.append(cell);
        date++;
        
      }
    }
    
    tbl.append(row); // appending each row into calendar body.
    dateEl.text(months[month] + " " + year);
  }
  
  showEventsCalendar();
}
function nextWeek() {
      
  date = today.add(7, "days");
  setUpIdMonth();
}
function prevWeek(){
  
  date = today.subtract(7, "days");
  setUpIdMonth();
}
function nextMonth() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showCalendar(currentMonth, currentYear);
}
function prevMonth() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showCalendar(currentMonth, currentYear);
}
function nextDay(){
  date = date.add(1, "days");
  setupUISingleDayEvent(); 
  
}
function prevDay() {
  date = date.subtract(1, "days");
  setupUISingleDayEvent();
}
/*--------------------------------------------------------------
# Create object variable for saving score details
--------------------------------------------------------------*/
function createEventbject(description, time, _date) {
  var object = {
    "description": description, 
    "time": time,
    "date": _date,
    
  }
  return object;
}
function getEvent() {
  return  localStorage.getItem("event");
}
/*--------------------------------------------------------------
# Method to save Score 
--------------------------------------------------------------*/
function saveEvent(text, time, _date) {
  var object = createEventbject(text, time, _date);
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


