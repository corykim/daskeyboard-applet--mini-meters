// Library to make track cpuUsage
// if not installed run npm install request
const os = require('os-utils');

const q = require('daskeyboard-applet');

// Coordinates of keys [`,1,2,3,4,5,6,7,8,9]
const zoneIds = ['1,1', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '8,1', '9,1', '10,1'];
// Color associated to each coordinate
const colors = ['#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FF0000',
  '#FF0000', '#FF0000', '#FF0000'];


class CpuUsage extends q.DesktopApp {
  async run() {
    this.getCpuUsage();
  }

  /** get a color of a zone depending on it's index on the zone array */
  getColor(zoneIndex, numberOfKeysToLight) {
    if (zoneIndex > numberOfKeysToLight) {
      // if the zone is after the number max of keys to light. Turn off the light
      return '#000000'; // Black color = no light
    } else {
      // turn on the zone with the proper color
      return colors[zoneIndex];
    }
  }

  /** get the cpu usage percentage  */
  getCpuUsage() {
    os.cpuUsage((v) => {
      const numberOfKeys = zoneIds.length;
      // multiply the cpu percentage by the number total of keys 
      const numberOfKeysToLight = Math.round(numberOfKeys * v) + 1;
      let points = [];

      zoneIds.forEach((zone, index) => {
        points.push(new q.Point(this.getColor(index, numberOfKeysToLight)));
      });

      q.Send(new q.Signal([points]))
    });
  }
}

const cpuUsage = new CpuUsage();
cpuUsage.start();



