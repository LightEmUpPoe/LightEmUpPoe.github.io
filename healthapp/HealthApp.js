

initClock("EST", 0);
initClock("CST", -1);
initClock("MST", -2);
initClock("PST", -3);

setInterval(updateDates, 5*60*60);
updateDates();
function updateDates(){
    var today = document.getElementById("today");
    var thirty = document.getElementById("thirty");
    var fourty = document.getElementById("fourty");
    var ninety = document.getElementById("ninety");

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    var offsetModifier = 0;

    var date = getOffsetDate(0);
    today.innerHTML = date.toLocaleDateString("en-US", options)

    date = getOffsetDate(30);
    thirty.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        thirty.nextElementSibling.innerHTML = `30 Days (${30-offsetModifier} Actual)`
    }else{
        thirty.nextElementSibling.innerHTML = `30 Days`
    }

    date = getOffsetDate(42);
    fourty.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        fourty.nextElementSibling.innerHTML = `42 Days (${42-offsetModifier} Actual)`
    }else{
        fourty.nextElementSibling.innerHTML = `42 Days`
    }

    date = getOffsetDate(90);
    ninety.innerHTML = date.toLocaleDateString("en-US", options)
    if(offsetModifier!= 0){
        ninety.nextElementSibling.innerHTML = `90 Days (${90-offsetModifier} Actual)`
    }else{
        ninety.nextElementSibling.innerHTML = `90 Days`
    }
    


    function getOffsetDate(offset){
        var now = new Date();
        now.setDate(now.getDate() + offset)
        offsetModifier = 0;
        if(offset == 0){ return now }
        var day = now.getDay();
        while( day >= 6){
            offsetModifier++;
            now.setDate(now.getDate() - offsetModifier);
            day = now.getDay();
        }
        return now;
    }

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
        ctx.strokeStyle = 'black';
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
        now.setHours(now.getHours() + offset)
        var hour = now.getHours()
        var minute = now.getMinutes();
        var second = now.getSeconds();

        //TODO - Need to handle DST 
        var label = document.getElementById(`${id}_Label`);
        label.innerHTML = `${now.toLocaleTimeString("en-us", {hour: "2-digit", minute: "2-digit", hour12: true})} ${id}`
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