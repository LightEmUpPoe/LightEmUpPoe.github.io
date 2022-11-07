
let timerObj = {};
initClock("EST", 'America/New_York');
initClock("CST", 'America/Chicago');
initClock("MST", 'America/Denver');
initClock("PST", 'America/Los_Angeles');
initClock("AST", 'America/Anchorage');
initClock("Query", 'Pacific/Honolulu');

var myTime = "";

window.enableHoldayPrevention = true; //Test Feature disabled by console.
window.enableBlackFridayHoliday = true; //Adds Black Friday to the results

let holidayList = [
    'New Year\'s Day',
    'Martin Luther King Jr. Day',
    'Memorial Day',
    'Independence Day',
    'Labor Day',
    'Thanksgiving Day',
    'Black Friday',
    'Christmas Day'
];


let allHolidays = [];
let holidays = [];
const endpoint = 'https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday@group.v.calendar.google.com/events?key=AIzaSyBYJR0bTOkaQGscXkcAhGBwcJG95CvK5SM';
fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
        if(!data.items) throw 'No JSON Response';
        allHolidays = data.items;
    })
    .then(() => {
        for(let i = 0; i<allHolidays.length; i++){
            //console.log(allHolidays[i].summary, allHolidays[i]);
            if(!allHolidays[i].description.startsWith("Observance") && isIncluded(allHolidays[i].summary)){
                holidays.push(allHolidays[i]);
                if(enableBlackFridayHoliday && allHolidays[i].summary.includes('Thanksgiving Day')){
                    let blackFriday = JSON.parse(JSON.stringify(allHolidays[i]));
                    blackFriday.summary = "Black Friday";
                    let bfHold = blackFriday.start.date.split("-");
                    blackFriday.start.date = `${bfHold[0]}-${bfHold[1]}-${Number(bfHold[2])+1}`;
                    bfHold = blackFriday.end.date.split("-");
                    blackFriday.end.date = `${bfHold[0]}-${bfHold[1]}-${Number(bfHold[2])+1}`;
                    holidays.push(blackFriday);
                }
            }
        }
    }).then(() => {
        setInterval(updateDates, 1000);
        updateDates();
    }).catch(e => {
        console.error("Fetch Error > ",e)
        console.warn("Starting updates manually without holidays");
        enableHoldayPrevention = false;
        setInterval(updateDates, 1000);
        updateDates();
    })


function isIncluded(holidayCheck){
    for(let i = 0; i< holidayList.length; i++){
        if(holidayCheck.includes(holidayList[i])){
            return true;
        }
    }
    return false;
    
}
//setInterval(updateDates, 1000);
//updateDates();

var dateNow = new Date();
console.log(dateNow);

let datePicker = document.getElementById('date');
datePicker.value = `${dateNow.getFullYear()}-${dateNow.getMonth() < 9 ? `0${dateNow.getMonth() + 1}` : dateNow.getMonth() + 1}-${dateNow.getDate() <= 9 ? `0${dateNow.getDate()}` : dateNow.getDate()}`;
datePicker.addEventListener('change', (e) => {
    console.log(e.target.value);
    dateNow = new Date(e.target.value + "T00:00:00");
})

let dateResetButton = document.getElementById('dateReset');
dateResetButton.addEventListener('click',() => {
    dateNow = new Date();
    datePicker.value = `${dateNow.getFullYear()}-${dateNow.getMonth() < 9 ? `0${dateNow.getMonth() + 1}` : dateNow.getMonth() + 1}-${dateNow.getDate() <= 9 ? `0${dateNow.getDate()}` : dateNow.getDate()}`;;
})

var checkbox = document.getElementById("checkbox");

checkbox.addEventListener("change", () => {
    document.getElementById('fortyDiv').classList.toggle('hidden');
})

function updateDates(){
    var today = document.getElementById("today");
    var seven = document.getElementById("seven");
    var thirty = document.getElementById("thirty");
    var forty = document.getElementById("forty");
    var ninety = document.getElementById("ninety");

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    var offsetModifier = 0;
    var holidayString = "";


    var date = getOffsetDate(0);
    today.innerHTML = date.toLocaleDateString("en-US", options)
    holidayString.length > 1 ? today.nextElementSibling.innerHTML = `Today | ${holidayString}` : `Today`;
    holidayString = "";

    date = getOffsetDate(7);
    seven.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        seven.nextElementSibling.innerHTML = `C2 | +5 Business Days (${7-offsetModifier} Actual${holidayString.length > 0 ? ` | ${holidayString}`:""})`
    }else{
        seven.nextElementSibling.innerHTML = `C2 | +5 Business Days${holidayString.length > 0 ? ` | ${holidayString}`: ""}`;
    }
    holidayString = "";

    date = getOffsetDate(30);
    thirty.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        thirty.nextElementSibling.innerHTML = `+30 Days (${30-offsetModifier} Actual${holidayString.length > 0 ? ` | ${holidayString}`:""})`
    }else{
        thirty.nextElementSibling.innerHTML = `+30 Days${holidayString.length > 0 ? ` | ${holidayString}`: ""}`
    }
    holidayString = "";

    date = getOffsetDate(42);
    forty.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        forty.nextElementSibling.innerHTML = `+42 Days (${30-offsetModifier} Actual${holidayString.length > 0 ? ` | ${holidayString}`:""})`
    }else{
        forty.nextElementSibling.innerHTML = `+42 Days${holidayString.length > 0 ? ` | ${holidayString}`: ""}`
    }
    holidayString = "";

    date = getOffsetDate(90);
    ninety.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        ninety.nextElementSibling.innerHTML = `+90 Days (${90-offsetModifier} Actual${holidayString.length > 0 ? ` | Avoids ${holidayString}`:""})`
    }else{
        ninety.nextElementSibling.innerHTML = `+90 Days${holidayString.length > 0 ? ` | ${holidayString}`: ""}`
    }
    holidayString = "";


    function getOffsetDate(offset){
        var now = new Date(dateNow);
        //console.log(now);
        now.setDate(now.getDate() + offset)
        offsetModifier = 0;
        if(offset == 0){ 
            ifOnHoliday(now);
            return now 
        }
        while( now.getDay() == 0 || now.getDay() == 6 || ifOnHoliday(now) ){
            if(offset == 7){
                offsetModifier--;
                now.setDate(now.getDate() + 1);
            }else{
                offsetModifier++;
                now.setDate(now.getDate() - 1);
            }
        }
        return now;
    }

    
    function ifOnHoliday(now){
        if(holidays.length < 1) return;
        for(var i = 0; i < holidays.length; i++){
            var holiDate = new Date(holidays[i].start.date + "T00:00:00");
            if(holiDate.getFullYear() === now.getFullYear() &&
                holiDate.getMonth() === now.getMonth() &&
                holiDate.getDate() === now.getDate()){
                    
                console.debug(`${now} is ${holidays[i].summary}`)
                holidayString = holidays[i].summary;
                //If holiday prevention is disabled, this function will always return false
                return enableHoldayPrevention;
            }
        }
        return false
    }
    

}

let locationQueryButton = document.getElementById('locationSubmit');
locationQueryButton.addEventListener('click',() => {
    let query = document.getElementById('location');
    let queryValue = query.value
    if(!isNaN(queryValue)){
        queryValue += ' USA';
    }
    fetch(`https://timezone.abstractapi.com/v1/current_time/?api_key=0227e32b89f34f6d9923aeef412eccd8&location=${queryValue}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if(data.error){
            alert(`Location Query Error:\n${data.error.message}\n${data.error.details}`);
            return;
        }
        initClock("Query", data.timezone_location);
        document.getElementById('Query_Location').innerHTML = data['requested_location'];


    })
    .catch(e => {
        console.error("Location Query Error> ", e);
    })
})

function initClock(id, offset){
    var canvas = document.getElementById(id);
    canvas.width = self.innerWidth;
    canvas.height = self.innerWidth;
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    drawClock();
    if(Object.keys(timerObj).includes(id)){
        clearInterval(timerObj[id]);
    }
    timerObj[id] = setInterval(drawClock, 500);

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
        if(offset === myTime){
            ctx.strokeStyle = '#228b22';
        }else if(id === 'Query'){
            ctx.strokeStyle = 'blue';
        }else{
            ctx.strokeStyle = 'black';
        }
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
            console.debug(`You're in the ${offset} timezone!`, id, myTime);
            myTime = offset;
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
            //console.log(`${offset} Timezone is Daylight Savings`)
        }else{
            //console.log(`${offset} Timezone is not in Daylight Savings`)
        }
     
     }

    //console.groupEnd(`${id}`);
}
