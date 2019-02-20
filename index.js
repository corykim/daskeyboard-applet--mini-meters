// Library to track cpuUsage
const os = require('os-utils');

// Library to send signal to Q keyboards
const q = require('daskeyboard-applet');

// Library to process colors
const colorsys = require('colorsys');

const logger = q.logger;

const ModeEnum = Object.freeze({
  CPU: 'cpu',
  FREE_MEM: 'freemem',
  AVERAGE_LOAD: 'avg1',
});

// the default mode, if none is specified
const ModeDefault = ModeEnum.CPU;

// defines the properties of each available mode
const ModeMap = {
  cpu: {
    name: 'CPU Usage',
    metric: function() {
      return new Promise((resolve) => {
        os.cpuUsage(v => {
          resolve(v);
        })
      })
    }
  },
  avg1: {
    name: 'Average Load',
    metric: async function() {
      return os.loadavg(1);
    }
  },
  freemem: {
    name: 'Free Memory',
    metric: async function() {
      return os.freememPercentage();
    }
  }
}

class MiniMeter extends q.DesktopApp {
  constructor() {
    super();
    // run every 3000 ms
    this.pollingInterval = 3000;
  }

  // call this function every pollingInterval
  async run() {
    let mode = this.config.mode || ModeDefault
    return this.getMetric(mode).then(percent => {
      logger.debug(`Got ${percent} percent`);
      this.deleteOldSignals();

      return new q.Signal({
        points: [this.generatePoints(percent)],
        name: ModeMap[mode].name,
        message: Math.round(percent * 100) + "%",
        isMuted: true, // don't flash the Q button on each signal
      });
    });
  }

  async getMetric(mode) {
    logger.debug(`Mode is ${mode}`);
    if (!mode) {
      mode = ModeDefault;
      logger.debug(`Defaulted mode to ${mode}`);
    }
   
    return ModeMap[mode].metric();
  }

  /**
   * Delete all previous signals
   */
  async deleteOldSignals() {
    // delete the previous signals
    while (this.signalLog && this.signalLog.length) {
      const signal = this.signalLog.pop().signal;
      logger.debug(`Deleting previous signal: ${signal.id}`)
      await q.Signal.delete(signal).catch(error => {
        logger.error(`Error deleting signal ${signal.id}: ${error}`);
      });

      logger.debug(`Deleted the signal: ${signal.id}`);
    }
  }

  generatePoints(percent) {
    return [new q.Point(this.getColor(percent))];
  }

  getColor(percent) {
    if (percent < 0 || percent > 1) {
      return 'black'
    } else {
      return colorsys.hslToHex({
        // hue ranges from blue to red
        h: 256 - Math.round(percent * 256),
        s: 100,
        // lightness ranges from 25 - 50
        l: percent * 25 + 25
      });
    }
  }

  async shutdown() {
    await this.deleteOldSignals();
    await super.shutdown();
  }
}

module.exports = {
  MiniMeter: MiniMeter,
  ModeEnum: ModeEnum
};

const miniMeter = new MiniMeter();