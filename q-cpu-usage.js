// Library to track cpuUsage
const os = require('os-utils');

// Library to send signal to Q keyboards
const q = require('daskeyboard-applet');

// Color associated to cpu activity from low (green) to high (red).
const colors = ['#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FF0000',
  '#FF0000', '#FF0000', '#FF0000'
];

const logger = q.logger;


class CpuUsage extends q.DesktopApp {
  constructor() {
    super();
    // run every 3000 ms
    this.pollingInterval = 3000;
    logger.info("CPU Usage Meter ready to go!");
  }

  // call this function every pollingInterval
  async run() {
    return this.getCpuUsage();
  }

  /** get a color of a zone depending on it's index on the zone array */
  getColor(zoneIndex, numberOfKeysToLight) {
    if (zoneIndex > numberOfKeysToLight) {
      // if the zone is after the number max of keys to light. Turn off the light
      // Black color = no light
      return '#000000';
    } else {
      // turn on the zone with the proper color
      return colors[zoneIndex];
    }
  }

  /** get the cpu usage percentage  */
  getCpuUsage() {
    return new Promise((resolve, reject) => {
      os.cpuUsage((v) => {
        const numberOfKeys = 10;
        // multiply the cpu percentage by the number total of keys 
        const numberOfKeysToLight = Math.round(numberOfKeys * v) + 1;
        let points = [];

        // create a list of points (zones) with a color). Each point 
        // correspond to an LED
        for (let i = 0; i < numberOfKeys; i++) {
          points.push(new q.Point(this.getColor(i, numberOfKeysToLight)));
        }

        // send list of RGB zones to Q keyboard
        resolve(new q.Signal({
          points: [points],
          name: "CPU Usage",
          message: Math.round(v * 100) + "%",
          isMuted: true,
        }));
      });
    })
  }
}

module.exports = {
  CpuUsage: CpuUsage
};

const cpuUsage = new CpuUsage();