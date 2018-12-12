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
    return this.getCpuUsage().then(percent => {
      // delete the previous signal
      const lastLog = this.signalLog.slice(0,1);
      if (lastLog.length) {
        q.Signal.delete(lastLog[0].signal);
      }

      return new q.Signal({
        points: [this.generatePoints(percent)],
        name: "CPU Usage",
        message: Math.round(percent * 100) + "%",
        isMuted: true, // don't flash the Q button on each signal
      });
    });
  }

  async getCpuUsage() {
    return new Promise((resolve) => {
      os.cpuUsage(v => {
        resolve(v);
      })
    })
  }

  generatePoints(percent) {
    // multiply the cpu percentage by the number total of keys 
    const numberOfKeysToLight = Math.round(this.getWidth() * percent);
    let points = [];

    // create a list of points (zones) with a color). Each point 
    // correspond to an LED
    for (let i = 0; i < numberOfKeysToLight; i++) {
      points.push(new q.Point(this.getColor(i)));
    }

    return points;
  }

  /** get a color of a zone depending on it's index on the zone array */
  getColor(zoneIndex) {
    if (zoneIndex >= colors.length) {
      // if the zone is after the number max of keys to light. Turn off the light
      // Black color = no light
      return '#000000';
    } else {
      // turn on the zone with the proper color
      return colors[zoneIndex];
    }
  }
}

module.exports = {
  CpuUsage: CpuUsage
};

const cpuUsage = new CpuUsage();
