const ws = io();
window.addEventListener("load", function(){ 
    
/*var lightbox = document.getElementById("light");
lightbox.addEventListener("change", function(){
     ws.emit("light", Number(this.checked));});*/

var servo = document.getElementById("servo");
servo.addEventListener("change", function(){
     ws.emit("servo", Number(this.checked));});

var pump = document.getElementById("pump");
pump.addEventListener("change", function(){
     ws.emit("pump", Number(this.checked));});

var fan = document.getElementById("fan");
fan.addEventListener("change", function(){
     ws.emit("fan", Number(this.checked));});

}); 




ws.on('dht11', (dhtdata) =>{
     var dhtd=JSON.parse(dhtdata);
     document.getElementById('temp').textContent = dhtd.temp;
     document.getElementById('hum').textContent = dhtd.hum;
});

ws.on('onewire', (wiredata)=>{
     document.getElementById('wire').textContent = wiredata;
});
ws.on('soil', (soildata)=>{
     document.getElementById('soil').textContent = soildata;
});
