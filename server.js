const http = require('http');
const { Server } = require("socket.io");
const Gpio = require('onoff').Gpio; 
const piGpio = require('pigpio').Gpio;
const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD( 1, 0x27, 16, 2 );

const sensor = require("node-dht-sensor"); //dht
const express = require('express');
const wiresensor = require('ds18b20-raspi');
const servo = new piGpio(19, {mode: Gpio.OUTPUT});
const water = new piGpio(13, {mode: Gpio.OUTPUT});
const light = new Gpio(6, 'out');
const soil = new Gpio(17, 'in','both');
const motor = new Gpio(12, 'out',);
const fan = new Gpio(16, 'out',);
const dhtpin = 26;



const app = express();
const server = http.createServer(app);
app.use(express.static('./')); 
app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/index.html'); // Serve the HTML file
  res.type('html');
});
console.log('Server started');
const io = new Server(server, { allowEIO3: true});
server.listen(3000);
lcd.beginSync();
lcd.clearSync();
lcd.setCursorSync(0, 1);
lcd.printSync( 'Server Started' );
water.servoWrite(2500);


io.sockets.on('connection', function (socket) 
{   
setInterval(() =>{ 
  sensor.read(11, dhtpin, function(err, temp, hum) {
    if(err){console.log(`dht11err: ${err}`);}
    if (!err) {
      dhtdata={temp,hum}
     /*console.log(`temp: ${temp}°C, humidity: ${hum}%`);*/
     socket.emit('dht11',JSON.stringify(dhtdata));
     lcd.clearSync();
     lcd.setCursorSync(0, 0);
     lcd.printSync( 'Temparature:  °C' );
     lcd.setCursorSync(12, 0);
     lcd.printSync(temp);
     lcd.setCursorSync(0, 1);
     lcd.printSync( 'Humidity: ' );
     lcd.setCursorSync(9, 1);
     lcd.printSync(hum);
         if(temp>29){
           
         }
    }
    
 });
 
},6000);



setInterval(() =>{ 
  wiresensor.readSimpleC(1,(err, temp) => {
    if(err){console.log(`onewireerr: ${err}`);}
    if (!err) {
   /* console.log(`${temp} degC`);*/
     socket.emit('onewire',temp);
     lcd.clearSync();
     lcd.setCursorSync(0, );
     lcd.printSync( 'Ambient ' );
     lcd.setCursorSync(0, 1);
     lcd.printSync( 'Temparature:' );
     lcd.setCursorSync(12, 1);
     lcd.printSync(temp);
    }
  });

},4000);

  soil.watch((err,value)=>{
      if(value===0){
        var str='Wet';
      }
      else{str="Dry";}
      socket.emit('soil',str);
    
  })

  
  /*socket.on('light', function(data) {
    light.writeSync(data);     
  });*/
  socket.on('pump', function(data) {
    
    motor.writeSync(data);     
  });
  socket.on('fan', function(data) {
    fan.writeSync(data);     
  });

  socket.on('servo',(data)=>{
    if(data===1){
      servo.servoWrite(2000);
    }
    else if(data===0) {
      servo.servoWrite(500);
    }
  })


});



process.on('SIGINT', function () { 
  light.writeSync(0); 
  light.unexport(); 
  process.exit(); 
});

