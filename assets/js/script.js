
var dateEl = $( '#title-date');
var weekView = $( '#weekView');
var singleView = $( '#singledayView');
var monthView = $( '#monthView');
var tableEl = $( '#week-contents');
var tableMonthEl = $('#month-contents');
var timeSelectEl = $('timeSlot');
var monthAndYear = $("#monthAndYear");
var date = moment();
var today =  moment();
var currentMonth = today.format("M") - 1;
var currentYear = today.format("YYYY");
var currentView;
var selectedDate;

var view = {
  day: "day",
  week: "week",
  month: "month"
}
var item = {
    date: "",
    time: "",
    description: ""
}
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var times = ["00:00 AM", "01:00 AM", "02:00 AM", "03:00 AM","04:00 AM","05:00 AM","06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
"12:00 PM", "01:00 PM", "02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM","11:00 PM",];
var week = ["","","","","","",""];
var months = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];

$(document).ready(function() { 

  createUIElements();
  start();

  ///=====   Button click events  ===== ////
  $( ".button-save" ).click(function() {
    item.date = date.format("MM/DD/YYYY");
    item.time = $(this).parent().find("p").text();
    item.desciption = $(this).parent().find("textarea").val();

    saveEvent(item);
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
    
    if ($(this).hasClass( "past" )) {
      alert("This event is already passed, wont be able to add/edit.");
      $('#modalsavebtn').attr("disabled", true);
    } else {
      $('#modalsavebtn').attr("disabled", false);
    }

      var str = $(this).attr('data-number');
      const myMomentObject = moment(str, 'MM/DD/YYYY hh:mm A');

      item.date = myMomentObject.format("MM/DD/YYYY");
      item.time = $(this).find('h5').text() ;
      item.description =  $(this).find('h6').text();
      selectedDate = myMomentObject.format("MM/DD/YYYY");
      loadModaldetails(item);

  });
  
  $('#weekView').on('click', 'tbody td', function (e) {
    if ($(this).hasClass( "past" )) {
      alert("This event is already passed, wont be able to add/edit.");
      $('#modalsavebtn').attr("disabled", true);
    } else {
      $('#modalsavebtn').attr("disabled", false);
    }

    var str = $(this).attr('data-number');
    const myMomentObject = moment(str, 'MM/DD/YYYY hh:mm A');

    item.date = myMomentObject.format("MM/DD/YYYY");
    item.time = myMomentObject.format("hh:mm A");
    item.description =  $(this).find('h6').text();
    selectedDate = myMomentObject.format("MM/DD/YYYY");

    loadModaldetails(item);
  });
  
  $("#dayView").on("click", 'textarea', function(e) {
      var slot = $(this).parent().find('p').text();
      loadModaldetails(date, slot, $(this).text());
  });
  
  $("#selectDay").change(function(){
    if ($(this).val() == 1) {
      currentView = view.day;
      showView(view.day);
    } else if ($(this).val() == 3) {
      currentView = view.month;
      showView(view.month);
    } else if ($(this).val() == 2) {
      currentView = view.week;
      showView(view.week);
    }
  });
  ///========================================
});
//===========================================================================//
function savetimesSlotinCalendar(array, obj) {
  for (var i=0 ; i<array.length; i++) {
        var descText = $("<h6></h6>");
        descText.addClass("calendar-event");
        descText.text(array[i].description);

        var timeText = $('<h5></h5>');
        timeText.text("");
        timeText.addClass("calendar-time-text");
        timeText.text(array[i].time);
        obj.append(timeText);
        obj.append(descText);
  }
}
function createUIElements() {
  createWeekEvent_Elements();
  addtimeSlots();
  createSingleDayEventElements();
  setupUISingleDayEvent();
}
function start(){
  currentView = view.day;
  showView(view.day);
  weekView.hide();
}
function showView(_view) {
  if (_view == view.day) {
    weekView.hide();
    monthView.hide();
    singleView.show();
    setupUISingleDayEvent();
  } else if (_view == view.week) {
    weekView.show();
    monthView.hide();
    singleView.hide();
    SetupUIWeek();
  } else {
    showMonth(currentMonth, currentYear);
    weekView.hide();
    monthView.show();
    singleView.hide();
  }
}
function next() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showMonth(currentMonth, currentYear);
}

function previous() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showMonth(currentMonth, currentYear);
}
function save(date) {
    item.date = selectedDate;
    item.time = $('#descmodal').find('#timeSlot').val();
    item.desciption = $("#description-text").val();
    saveEvent(item);
}
function addtimeSlots() {
  for (var i=0; i<times.length; i++) {
    var optionEl = $('<option></option>');
    optionEl.text(times[i]);
    $('#descmodal').find('#timeSlot').append(optionEl); 
  }
}
//========================   Day Event ====================================================//
function createSingleDayEventElements() {
  singleView.html('');
  
  for (var i=0; i<times.length; i++) {
    var divEl = $("<div></div>");
    divEl.addClass('form-inline');

    divEl.addClass('row');
    
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
function setupUISingleDayEvent() {
  $('#singledayView .row').each(function(index, obj){
    var hour = moment().format('hh A');
    var currentSlot = moment(date.format("MM/DD/YYYY") + " " + obj.innerText, "MM/DD/YYYY hh A");
    var currentTime = moment(hour, 'h:mm A');
    
    var textArea =  $(this).find("textarea")
                          .val("")
                          .removeClass()
                          .addClass(getColor(currentSlot, currentTime))

    item.date = date.format("MM/DD/YYYY");
    item.time = obj.innerText;
    item.desciption = "";

    let saved = loadEvents(item);
    if (saved != null) {
      console.log(saved);

      textArea.val(saved.description);
    }
   
    setTitle();
  });
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

function getSavedItem(_date, _time) {
  var savedData = getEvent();
  var savedData = JSON.parse(getEvent());
  if (savedData == null) {
    return ;
  } else {
    for (var i=0; i<savedData.length; i++) {
      if (savedData[i].date == _date && savedData[i].time == _time) {
        return savedData[i].desciption;
      }
    }
  }
}
function filterItem(array, _item) {

  for (var i=0; i<array.length; i++) {

    console.log(array[i].date, array[i].time, _item.date, _item.time);

    if (array[i].date == _item.date && (array[i].time == _item.time || _item.time == "")) {
      return array[i];
    } 
  }
  return null;
}
function loadEvents(_item) {
  var savedData = JSON.parse(getEvent());
  if (savedData == null) {
    return ;
  }
   return filterItem(savedData, _item);
}
//================================================================================================ 

//========================   Week-View Event ====================================================//
function createWeekEvent_Elements() {
  
  for (var i=0 ;i < times.length; i++) {
    var rowEl = $("<tr></tr>");  
    rowEl.attr("data-toggle", "modal");
    rowEl.attr("data-target", "#descmodal");
    rowEl.addClass("table-row");
    var rowheaderEl = $('<th></th>');
    
    rowheaderEl.text(times[i]);
    rowEl.append(rowheaderEl);
    
    for (var j=0; j<days.length; j++) {
      var colEl = $('<td></td>');
     
      var descEl = $('<h6></h6>');
      descEl.addClass("calendar-event");

      var timeEl = $('<h5></h5>');
      timeEl.addClass("calendar-event-time");

      colEl.append(timeEl);
      colEl.append(descEl);
      rowEl.append(colEl);
    }
    
    if (i < 9 || i > 18) {
      rowEl.addClass("divallDay");
      rowEl.hide();
    }
    tableEl.append(rowEl);
  }
}
function SetupUIWeek() {
  week = [];
  view == view.week;
  var diff;
  var calculateDate = "";
  var hour = moment().format('MM/DD/YYYY dddd hh A');
  var currentTime = moment(hour, 'MM/DD/YYYY dddd hh A');
  
  $("#tableWeek tbody tr td").each(function (index, obj) {
      $(this).find('h6').text("");
      $(this).find('h5').text("");

    var index_time = $(this).parent().parent().children().index(this.parentNode);
    var index_day = $(this).parent().children().index(this);
    var currentDay = today.format("d");
    var slotDay = index_day - 1;
    
    if (currentDay == slotDay) {
      calculateDate = today;

    } else if (currentDay < slotDay) {
      diff = slotDay - currentDay;
      const nextDay = today.clone().add(diff, 'days');
      calculateDate = nextDay;
    } else {
      diff = Math.abs(slotDay - currentDay);
      const prevDay = today.clone().subtract(diff, 'days');
      calculateDate = prevDay;
    }
    let i = calculateDate.format("d");
    
    if (week[i] != calculateDate) {
          week[i] = calculateDate ;
    }
  
   calculateDate = getDisplayDate(calculateDate);

    var str = (calculateDate + " " + times[index_time]);
    const dt = moment(str, 'MM/DD/YYYY hh A');
  
    item.date = dt.format("MM/DD/YYYY");
    item.time = times[index_time];
    item.description = "";
    var saved = loadEvents(item);
    if (saved != null) {
      $(this).find('h6').text(saved.description);
      $(this).find('h5').text(saved.time);
    }
      
    

    $(this).removeClass().addClass(getColor(dt, currentTime));
    $(this).attr('data-number', calculateDate + " " + times[index_time]);
  });
  
  $('#table-head').find('th').each(function(index, obj){
    if (index != 0) {
      $(this).text(days[index - 1] + " (" + week[index - 1].format("MM/DD/YYYY") + ")");
    } 
  });
        setTitle();
}

function loadModaldetails(_item){
  console.log("lade : " + _item.date, _item.time, _item.desciption);

  $('#descmodal').find('#modal-date-text').text("Date: "+ _item.date); 
  $('#descmodal').find('#timeSlot').val(_item.time); 
  $('#descmodal').find('#description-text').val(_item.description); 
}

//================================================================================================ 

//========================  Weeks  Event ====================================================//

function getDisplayDate(_date) {
  return _date.format("MM/DD/YYYY");
}

function setTitle() {
  if (currentView == view.day) {
    dateEl.text("Date: " +  date.format("dddd, MM/DD/YYYY"));

  } else if (currentView == view.week) {
    dateEl.text("Week: " +  week[0].format("MM/DD/YYYY") + " to " + week[week.length - 1].format("MM/DD/YYYY"));
  }  else {
    dateEl.text(months[currentMonth]  + " " + currentYear);
  }
}

//================================================================================================ 

//========================  Month Event ====================================================//

function getDay(month, year) {
  var startDt = new Date( (month + 1) + "/01/" + year);
  var defaultStart = moment(startDt.valueOf()).format("d");
  return  defaultStart;
}
function getDate(myDate) {
  return myDate.format("MM/DD/YYYY");
}

function totalDaysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

function showMonth(month, year) {
  tableMonthEl.html('');
  let date = 1;
  var firstDay=  getDay(month, year);
  var descText = "";
  
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
      else if (date > totalDaysInMonth(month, year)) {
        break;
      }
      else {
        cell = $("<td></td>");
        cellText = $("<p></p>");
        cellText.text(date);
        
        descText = $("<h6></h6>");
        descText.addClass("calendar-event");
      
        var timeText = $('<h5></h5>');
        timeText.text("");
        timeText.addClass("calendar-time-text");


        var str = moment(date + months[month] + year);
        const myMomentObject = moment(str, 'YYYY-MM-DD');

        if (myMomentObject.format("MM/DD/YYYY") == today.format("MM/DD/YYYY")) {
              cell.addClass("present");
        } else if (myMomentObject.isBefore(today)) {
              cell.addClass("past");
        } else {
              cell.addClass("future");
        }
        cell.append(cellText);
        cell.append(timeText);
        cell.append(descText);
        cell.attr('data-number', myMomentObject.format("MM/DD/YYYY") + " " + "00:00 AM");

        item.date = myMomentObject.format("MM/DD/YYYY") ;
        item.time = "";
        let saved = loadEvents(item);
      
        if (saved != null) {
          timeText.text(saved.time);
          descText.text(saved.description);
        }
        

        row.append(cell);
        date++;
      }
    }
    setTitle();
    tableMonthEl.append(row); // appending each row into calendar body.
  }
}

function nextWeek() {
    date = today.add(7, "days");
    SetupUIWeek();
}
function prevWeek(){
   date = today.subtract(7, "days");
  SetupUIWeek();
}
function nextMonth() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showMonth(currentMonth, currentYear);
}
function prevMonth() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showMonth(currentMonth, currentYear);
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
function createEventbject(_item) {
  var object = {
    "date": _item.date,
    "time": _item.time,
    "description": _item.desciption
  }
  return object;
}
function getEvent() {
  return  localStorage.getItem("Event");
}
/*--------------------------------------------------------------
# Method to save event 
--------------------------------------------------------------*/
function saveEvent(_item) {
  var object = createEventbject(_item);
  var savedData = getEvent();
 
  if (savedData === null) { 
    Events = [object];
  } else {

    Events = JSON.parse(savedData);
    
    for (var i=0; i<Events.length; i++) {
      if (Events[i].date == _item.date && Events[i].time == _item.time) {
        console.log("found match: "+ Events[i].description);
        Events.splice(i, 1);
      }
    }
    Events.push(object);
  }   
  localStorage.setItem('Event', JSON.stringify(Events));
  alert("Saved");
}


