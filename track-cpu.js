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


// using vector to target the second line of the DK5Q keyboard
const zoneIds = ['1,1', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '8,1', '9,1', '10,1'];
// Color associated to each zone
const colors = ['#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FF0000', '#FF0000', '#FF0000', '#FF0000'];



/** post a signal to the localAPI  */
function sendSignal(signal) {
  // HTTP POST request to the cloud
  request.post({
    url: backendUrl + '/api/1.0/signals',
    headers: headers,
    body: signal,
    json: true
  });
}

/** get a color of a zone depending on it's index on the zone array */
function getColor(zoneIndex) {
  return colors[zoneIndex];
}

function getCpuUsage() {
  os.cpuUsage(function (v) {
    const numberOfKeys = zoneIds.length;
    // multiply the cpu percentage by the number total of keys 
    const numberOfKeysToLight = Math.round(numberOfKeys * v) + 1;
    zoneIds.forEach((zone, index) => {
      // if the zone is after the number max of keys to light. Turn off the zone light
      if (index > numberOfKeysToLight) {
        // Construct the signal to send
        var signal = {
          'zoneId': zone.toString(),
          'color': '#000000',
          'effect': 'SET_COLOR',
          'pid': 'DK5QPID',
          'isMuted': 'true',
          'clientName': 'Node script',
          'message': 'cpeUsage',
          'name': 'cpeUsage'
        };
        sendSignal(signal);
      } else {
        // turn on the zone with the proper color
        var signal = {
          'zoneId': zone.toString(),
          'color': getColor(index, numberOfKeysToLight),
          'effect': 'SET_COLOR',
          'pid': 'DK5QPID',
          'isMuted': 'true',
          'clientName': 'Node script',
          'message': 'cpuUsage',
          'name': 'cpuUsage'
        };
        sendSignal(signal);
      }
    });


  });
}

setInterval(() => {
  getCpuUsage();
}, 2000);



