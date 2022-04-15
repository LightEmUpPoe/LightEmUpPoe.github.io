
initClock("EST", 'America/New_York');
initClock("CST", 'America/Chicago');
initClock("MST", 'America/Denver');
initClock("PST", 'America/Los_Angeles');
initClock("AST", 'America/Anchorage');
initClock("HST", 'Pacific/Honolulu');

var myTime = "";

/*
let allHolidays = [];
let holidays = [];
const endpoint = 'https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday@group.v.calendar.google.com/events?key=AIzaSyBYJR0bTOkaQGscXkcAhGBwcJG95CvK5SM';
fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
        allHolidays = data.items;
    })
    .then(() => {
        for(let i = 0; i<allHolidays.length; i++){
            if(!allHolidays[i].description.startsWith("Observance")){
                holidays.push(allHolidays[i]);
            }
        }
        console.log(holidays);
    }).then(() => {
        setInterval(updateDates, 5*60*60);
        updateDates();
    }).catch(e => console.log("Fetch Error > ",e))
*/

setInterval(updateDates, 1000);
updateDates();

function updateDates(){
    var today = document.getElementById("today");
    var seven = document.getElementById("seven");
    var thirty = document.getElementById("thirty");
    var fourty = document.getElementById("fourty");
    var ninety = document.getElementById("ninety");

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    var offsetModifier = 0;

    var date = getOffsetDate(0);
    //ifOnHoliday(date);
    today.innerHTML = date.toLocaleDateString("en-US", options)

    date = getOffsetDate(7);
    //ifOnHoliday(date);
    seven.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        seven.nextElementSibling.innerHTML = `+7 Days (${7-offsetModifier} Actual)`
    }else{
        seven.nextElementSibling.innerHTML = `+7 Days`
    }

    date = getOffsetDate(30);
    //ifOnHoliday(date);
    thirty.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        thirty.nextElementSibling.innerHTML = `+30 Days (${30-offsetModifier} Actual)`
    }else{
        thirty.nextElementSibling.innerHTML = `+30 Days`
    }

    date = getOffsetDate(42);
    //ifOnHoliday(date);
    fourty.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        fourty.nextElementSibling.innerHTML = `+42 Days (${42-offsetModifier} Actual)`
    }else{
        fourty.nextElementSibling.innerHTML = `+42 Days`
    }

    date = getOffsetDate(90);
    //ifOnHoliday(date);
    ninety.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        ninety.nextElementSibling.innerHTML = `+90 Days (${90-offsetModifier} Actual)`
    }else{
        ninety.nextElementSibling.innerHTML = `+90 Days`
    }


    function getOffsetDate(offset){
        var now = new Date();
        now.setDate(now.getDate() + offset)
        offsetModifier = 0;
        if(offset == 0){ return now }
        var day = now.getDay();
        while( day == 0 || day == 7){
            offsetModifier++;
            now.setDate(now.getDate() - offsetModifier);
            day = now.getDay();
        }
        return now;
    }

    /*
    function ifOnHoliday(now){
        for(var i = 0; i < allHolidays.length; i++){
            var holiDate = new Date(allHolidays[i].start.date);
            if(holiDate.getFullYear() === now.getFullYear() &&
                holiDate.getMonth() === now.getMonth() &&
                holiDate.getDate() === now.getDate()){
                    
                console.log(`${now} is ${allHolidays[i].summary}`)
            }
        }
    }
    */

}

function initClock(id, offset){
    var canvas = document.getElementById(id);
    canvas.width = self.innerWidth;
    canvas.height = self.innerWidth;
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    drawClock();
    setInterval(drawClock, 1000);

    function drawClock() {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    }

    function drawFace(ctx, radius) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2*Math.PI);
        ctx.fillStyle = "#77b7ff"
        ctx.fill();
        ctx.strokeStyle = id == myTime ? 'darkblue' : 'black';
        ctx.lineWidth = radius*0.05;
        ctx.stroke();
        ctx.beginPath();
    }

    function drawNumbers(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius*0.15 + "px arial";
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        ctx.fillStyle = 'black';
        for(num = 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius){
        var now = new Date();

        let modified = new Date( now.toLocaleString('en-US', {timeZone: offset,}) )

        if(modified.getHours() == now.getHours()){
            //console.log(`Your in the ${offset} timezone!`);
            myTime = id;
        }

        getCurrentTimeZoneOffset(modified);

        //now.setHours(now.getHours() + offset)
        var hour = modified.getHours()
        var minute = modified.getMinutes();
        var second = modified.getSeconds();


        var label = document.getElementById(`${id}_Label`);
        label.innerHTML = `${modified.toLocaleTimeString("en-us", {hour: "2-digit", minute: "2-digit", hour12: true})}`
        //hour
        hour=hour%12;
        hour=(hour*Math.PI/6)+
        (minute*Math.PI/(6*60))+
        (second*Math.PI/(360*60));
        drawHand(ctx, hour, radius*0.5, radius*0.07);
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        drawHand(ctx, minute, radius*0.65, radius*0.07);
        // second
        second=(second*Math.PI/30);
        drawHand(ctx, second, radius*0.9, radius*0.01);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }
}

function getCurrentTimeZoneOffset(now){
   let date = new Date();
   
   date.setDate = 1;
   date.setMonth = 1;
   date.setYear = now.getFullYear();
   let notDST =  date.getTimezoneOffset() / 60;
   date.setMonth = 7;
   let DST = date.getTimezoneOffset() / 60;

   let nowOffset = date.getTimezoneOffset() / 60;

   if(DST === nowOffset){
        //console.log("Time is DST > ", now)
   }else{
        //console.log("Time is not DST > ", now)
   }

}
