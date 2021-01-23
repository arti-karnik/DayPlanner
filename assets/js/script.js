

$(document).ready(function() {

    const now = moment()
    
    $('textarea').each(function(index, obj){
      console.log(this);

      var time = obj.innerHTML;
      var hour = moment().format('hh A');
      var beginningTime = moment(obj.innerHTML, 'hh A');
      var endTime = moment(hour, 'hh A');

      $(this).css("background", "yellow");
      if (beginningTime.isSame(endTime)) {
        console.log("current " + time + " " + hour); 


      } else if ( beginningTime.isBefore(endTime)) {
        console.log("befire " + time + " " + hour);
      } else {
        console.log("after " + time + " " + hour);
      }
      //you can use this to access the current item
    });

    /*var objects = $(".hour");
    for (var obj of objects) {
      console.log(this);
      var time = obj.innerHTML;
      var hour = moment().format('hh A');
      var beginningTime = moment(obj.innerHTML, 'hh A');
      var endTime = moment(hour, 'hh A');

      if (beginningTime.isSame(endTime)) {
        console.log("current " + time + " " + hour); 
        obj.addClass("past");

      } else if ( beginningTime.isBefore(endTime)) {
        console.log("befire " + time + " " + hour);
      } else {
        console.log("after " + time + " " + hour);
      }
       checkTime(obj.innerHTML);

    }*/


    function checkTime(time) {
        var hour = moment().format('hh A');
       
        var beginningTime = moment(time, 'hh A');
        var endTime = moment(hour, 'hh A');
       
        if (beginningTime.isSame(endTime)) {
          console.log("current " + time + " " + hour); 

        } else if ( beginningTime.isBefore(endTime)) {
          console.log("befire " + time + " " + hour);
        } else {
          console.log("after " + time + " " + hour);
        }
    //    console.log("current time: " + time + "current : " + hour + " " + beginningTime.isBefore(endTime)); // true

        //console.log(moment().format("hh A").isBefore("07:00 PM")) ;
        
    }
  });