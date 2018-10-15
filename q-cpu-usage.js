// Library to make track cpuUsage
// if not installed run npm install request
const os = require('os-utils');

const q = require('daskeyboard-applet');

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
      const numberOfKeys = 10;
      // multiply the cpu percentage by the number total of keys 
      const numberOfKeysToLight = Math.round(numberOfKeys * v) + 1;
      let points = [];

      for (let i =0; i<numberOfKeys; i++) {        
        points.push(new q.Point(this.getColor(i, numberOfKeysToLight)));
      };

      q.Send(new q.Signal([points]))
    });
  }
}

const cpuUsage = new CpuUsage();