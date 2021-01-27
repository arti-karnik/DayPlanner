
/*================ Element declaration ================*/
var dateEl = $( '#title-date');
var weekView = $( '#weekView');
var singleView = $( '#singledayView');
var monthView = $( '#monthView');
var tableEl = $( '#week-contents');
var tableMonthEl = $('#month-contents');
var timeSelectEl = $('timeSlot');

/*================ Variable declaration ================*/
var week_date = moment();
var day_date = moment();
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

/*================Page load method  ================*/
$(document).ready(function() { 
  
  // start with creating UI Element creation
  createUIElements();
  start();
  
  ///=====   Button click events  ===== ////
  /// Save button event
  $( ".button-save" ).click(function() {
    var textArea =  $(this).parent().find("textarea").val();
    
    if ($(this).parent().find("textarea").hasClass("past")) {
      alert("This event is already passed, you wont be able to save it.");
    }  else {
      if (validateText(textArea)) {
        item.date = day_date.format("MM/DD/YYYY");
        item.time = $(this).parent().find("p").text();
        item.desciption = textArea;
        saveEvent(item);
      } else {
        alert("Please enter text");
      }
    }
  })
  
  /// Prev button events
  $( "#prevDayBtn" ).click(function() {
    if (currentView == view.day) {
      prevDay();
    } else if (currentView == view.week) {
      prevWeek();
    } else {
      prevMonth();
    }
  });
  
  /// Next button events
  $( "#nextDayBtn" ).click(function() {
    if (currentView == view.day) {
      nextDay();
    } else if (currentView == view.week) {
      nextWeek();
    }  else if (currentView == view.month) {
      nextMonth();
    }
  });
  
  ///=====  Select time events  ===== ////
  $("#selectTime").change(function(){
    ($(this).val() == 1) ?  $('.divallDay').hide() : $('.divallDay').show();
  });
  
  ///=====  Month view click events  ===== ////
  $('#calendar').on('click', 'tbody td', function (e) {
    $(this).hasClass( "past" ) ? toggleModalSaveButton(true) : toggleModalSaveButton(false);
    var desc = $(this).find('h6').text();
    var str = $(this).attr('data-number');
    loadModaldetails(str, desc);
  });
  
  ///=====  Week view click event  ===== ////
  $('#weekView').on('click', 'tbody td', function (e) {
    $(this).hasClass( "past" ) ? toggleModalSaveButton(true) : toggleModalSaveButton(false);
    var str = $(this).attr('data-number');
    var desc = $(this).find('h6').text();
    loadModaldetails(str, desc);
  });
  
  ///=====  select view type: Day / Month / Year  ===== ////
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
});

// Create UI Elements
function createUIElements() {
  createWeekEvent_Elements();
  addtimeSlots();
  createSingleDayEventElements();
  setupUISingleDayEvent();
}
// Start-up code
function start(){
  currentView = view.day;
  showView(view.day);
  weekView.hide();
}
//========================   Day Event ========================================================//
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
// UI for day view
function setupUISingleDayEvent() {
  $('#singledayView .row').each(function(index, obj){
    var hour = moment().format('hh A');
    var currentSlot = moment(day_date.format("MM/DD/YYYY") + " " + obj.innerText, "MM/DD/YYYY hh A");
    var currentTime = moment(hour, 'h:mm A');
    
    var textArea =  $(this).find("textarea")
    .val("")
    .removeClass()
    .addClass(getColor(currentSlot, currentTime))
    
    item.date = day_date.format("MM/DD/YYYY");
    item.time = obj.innerText;
    item.desciption = "";
    
    let saved = loadEvents(item);
    if (saved != null) {
      textArea.val(saved.description);
    }
    
    setTitle();
  });
}
//=============================================================================================//

//========================   Week-View Event ==================================================//
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
// UI for week event 
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

//========================  Month Event ====================================================//
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
        const myMomentObject = moment(str, 'DDMMYYYY');
        myMomentObject.format("MM/DD/YYYY");
        
        const currentMoment = moment().format("MM/DD/YYYY");
        
        if (myMomentObject.isSame(currentMoment)) {
          cell.addClass("present");
        } else if (myMomentObject.isBefore(currentMoment)) {
          cell.addClass("past");
        } else {
          cell.addClass("future");
        }
        cell.append(cellText);
        cell.append(timeText);
        cell.append(descText);
        
        
        item.date = myMomentObject.format("MM/DD/YYYY") ;
        item.time = "";
        let saved = loadEvents(item);
        
        if (saved != null) {
          timeText.text(saved.time);
          descText.text(saved.description);
        }
        var temp = timeText.text();
        if (temp == "" || temp == null) {
          temp = "12:00 AM";
        }
        
        cell.attr('data-number', (myMomentObject.format("MM/DD/YYYY") + " " + temp));
        
        row.append(cell);
        date++;
      }
    }
    setTitle();
    tableMonthEl.append(row); 
  }
}
// HELPER METHODS: to get current day 
function getDay(month, year) {
  var startDt = new Date( (month + 1) + "/01/" + year);
  var defaultStart = moment(startDt.valueOf()).format("d");
  return  defaultStart;
}
// HELPER METHODS: to get current date 

function getDate(myDate) {
  return myDate.format("MM/DD/YYYY");
}
// HELPER METHODS: to get total days in month 
function totalDaysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

//===================================================================

/*--------------------------------------------------------------
# Next-Previous Button events
--------------------------------------------------------------*/
// Method called when clicked on Next Week 
function nextWeek() {
  week_date = today.add(7, "days");
  SetupUIWeek();
}

// Method called when clicked on Previous Week 
function prevWeek(){
  week_date = today.subtract(7, "days");
  SetupUIWeek();
}

// Method called when clicked on Next Month 
function nextMonth() {
  currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  showMonth(currentMonth, currentYear);
}
// Method called when clicked on Previous Month 
function prevMonth() {
  currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  showMonth(currentMonth, currentYear);
}
// Method called when clicked on Next Day 
function nextDay(){
  day_date = day_date.add(1, "days");
  setupUISingleDayEvent(); 
}
// Method called when clicked on Previous Day 
function prevDay() {
  day_date = day_date.subtract(1, "days");
  setupUISingleDayEvent();
}

/*--------------------------------------------------------------
# Save Event Methods
--------------------------------------------------------------*/
// Create object variable for saving details
function createEventbject(_item) {
  var object = {
    "date": _item.date,
    "time": _item.time,
    "description": _item.desciption
  }
  return object;
}
// Get event 
function getEvent() {
  return  localStorage.getItem("Event");
}
// Save button clicked
function save() {
  var textArea = $("#description-text").val();
  
  if (validateText(textArea)) {
    item.date = selectedDate;
    item.time = $('#descmodal').find('#timeSlot').val();
    item.desciption = textArea;
    saveEvent(item);
  } else {
    alert("Event not saved, please enter description and try again!");
  }
}
// Method to Save event 
function saveEvent(_item) {
  var object = createEventbject(_item);
  var savedData = getEvent();
  
  if (savedData === null) { 
    Events = [object];
  } else {
    
    Events = JSON.parse(savedData);
    
    for (var i=0; i<Events.length; i++) {
      if (Events[i].date == _item.date && Events[i].time == _item.time) {
        Events.splice(i, 1);
      }
    }
    Events.push(object);
  }   
  localStorage.setItem('Event', JSON.stringify(Events));
  alert("Saved");
}

/*--------------------------------------------------------------
# HELPER Methods
--------------------------------------------------------------*/
// Show selected view
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

// Add time slots in modal view
function addtimeSlots() {
  for (var i=0; i<times.length; i++) {
    var optionEl = $('<option></option>');
    optionEl.text(times[i]);
    $('#descmodal').find('#timeSlot').append(optionEl); 
  }
}

// Modal detail for week and month
function loadModaldetails(_time, _description){
  
  const myMomentObject = moment(_time, 'MM/DD/YYYY hh:mm A');
  item.date = myMomentObject.format("MM/DD/YYYY");
  item.time = myMomentObject.format("hh:mm A");
  item.description =  _description;
  selectedDate = myMomentObject.format("MM/DD/YYYY");

  item.time = getDisplayTime(item.time);

  $('#descmodal').find('#modal-date-text').text("Date: "+ item.date); 
  $('#descmodal').find('#timeSlot').val(item.time); 
  $('#descmodal').find('#description-text').val(item.description); 
}
function getDisplayTime(_time) {
  if (_time == "12:00 AM") {
    return "00:00 AM";
  }
  return _time;
}
// Disabled save button if event is passed
function toggleModalSaveButton(toggle) {
  if (toggle) {
    alert("This event is already passed, wont be able to add/edit.");
  } 
  $('#modalsavebtn').attr("disabled", toggle);
}

// Method to get current time color code - past ,present or future=
function getColor(_slot, _actual) {
  
  if (_slot.isBefore(_actual)) {
    return "past";
  } else if (_slot.isSame(_actual)) {
    return "present";  
  } else if (_slot.isAfter(_actual)) {
    return "future";   
  }
}

// Method to get Save item from local storage
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

// Method to Load saved events in view 
function loadEvents(_item) {
  var savedData = JSON.parse(getEvent());
  if (savedData == null) {
    return ;
  }
  return filterItem(savedData, _item);
}
// Method to filter items from array
function filterItem(array, _item) {
  
  for (var i=0; i<array.length; i++) {
    if (array[i].date == _item.date && (array[i].time == _item.time || _item.time == "")) {
      return array[i];
    } 
  }
  return null;
}

// Method to get display format for date
function getDisplayDate(_date) {
  return _date.format("MM/DD/YYYY");
}
// Method to set Title for the view
function setTitle() {
  if (currentView == view.day) {
    dateEl.text("Date: " +  day_date.format("dddd, MM/DD/YYYY"));
  } else if (currentView == view.week) {
    dateEl.text("Week: " +  week[0].format("MM/DD/YYYY") + " to " + week[week.length - 1].format("MM/DD/YYYY"));
  }  else {
    dateEl.text(months[currentMonth]  + " " + currentYear);
  }
}

// Method to Validate text if its empty
function  validateText(text) {
  return text == "" ? false : true;
}




