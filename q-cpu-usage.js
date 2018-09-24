// Library to make track cpuUsage
// if not installed run npm install request
var os = require('os-utils');
// Library to make simplified HTTP client requests
// if not installed run npm install request
var request = require('request');


var backendUrl = 'http://localhost:27301';
var headers = {
  "Content-Type": "application/json"
}


// Coordinates of keys [`,1,2,3,4,5,6,7,8,9]
const zoneIds = ['1,1', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '8,1', '9,1', '10,1'];
// Color associated to each coordinate
const colors = ['#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FF0000',
  '#FF0000', '#FF0000', '#FF0000'];



/** post a signal to the localAPI  */
function sendSignal(signal) {
  // HTTP POST request to the cloud
  request.post({
    url: backendUrl + '/api/1.0/signals',
    headers: headers,
    body: signal,
    json: true
  }, (err) => {
    if (err && err.code === 'ECONNREFUSED') {
      console.error(`Error: failed to connect to ${backendUrl}, make sure the Das Keyboard Q software`
        + ' is running');
    }
  });
}

/** get a color of a zone depending on it's index on the zone array */
function getColor(zoneIndex, numberOfKeysToLight) {
  if (zoneIndex > numberOfKeysToLight) {
    // if the zone is after the number max of keys to light. Turn off the light
    return '#000000'; // Black color = no light
  } else {
    // turn on the zone with the proper color
    return colors[zoneIndex];
  }
}

/** get the cpu usage percentage  */
function getCpuUsage() {
  os.cpuUsage(function (v) {
    const numberOfKeys = zoneIds.length;
    // multiply the cpu percentage by the number total of keys 
    const numberOfKeysToLight = Math.round(numberOfKeys * v) + 1;
    zoneIds.forEach((zone, index) => {
      // send signal to Q Device
      var signal = {
        'zoneId': zone.toString(),
        'color': getColor(index, numberOfKeysToLight),
        'effect': 'SET_COLOR',
        'pid': 'Q_MATRIX',
        'isMuted': 'true', // attribute to not notify on the screen and on the Q-button
        'clientName': 'q-cpu-usage',
        'message': '',
        'name': ''
      };
      sendSignal(signal);
    });


  });
}

setInterval(() => {
  getCpuUsage();
}, 2000);



