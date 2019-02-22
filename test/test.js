const assert = require('assert');
const t = require('../index');

const black = '#000000';

describe('MiniMeter', function () {
  describe('#getMetric', function () {
    it('#getMetric(default)', async function () {
      return buildApp().then(app => app.getMetric(t.ModeEnum.CPU).then(percent => {
        console.log("CPU Usage is: " + percent);
        assert.ok(percent);
      }))
    });
    it('#getMetric(freemem)', async function () {
      return buildApp().then(app => app.getMetric(t.ModeEnum.FREE_MEM).then(percent => {
        console.log("Free Mem is: " + percent);
        assert.ok(percent);
      }))
    });
    it('#getMetric(average)', async function () {
      return buildApp().then(app => app.getMetric(t.ModeEnum.AVERAGE_LOAD).then(percent => {
        console.log("Average Load is: " + percent);
        // Windows always return 0
        assert.ok(percent || percent === 0);
      }))
    });
    it('#getMetric(nvidiaGpu)', async function () {
      return buildApp().then(app => app.getMetric(t.ModeEnum.NVIDIA_GPU).then(percent => {
        console.log("nVidia GPU is: " + percent);
        // Does not work unless nVidia GPU is present?
        assert.ok(percent || percent === 0);
      }).catch(error => {
        console.error("Is an nVidia GPU present?");
      }))
    });
  })

  it('#getColor', async function () {
    return buildApp().then(app => {
      assert.equal(black, app.getColor(99), 'Expected big number to return black');
      assert.equal(black, app.getColor(-1), 'Expected negative number to return black');

      assert(app.getColor(0), 'Expected 0 to return a color');
      assert.notEqual(black, app.getColor(0), 'Expected 0 to return a color');

      assert(app.getColor(.999), 'Expected .999 to return a color');
      assert.notEqual(black, app.getColor(.999), 'Expected .999 to return a color');
    })
  });

  it('#generatePoints', async function () {
    return buildApp().then(app => {
      for (let i = 0; i < 1; i += 0.01) {
        const points = app.generatePoints(i);
        assert.equal(1, points.length)
        assert.notEqual('black', points[0].color);
        assert(points[0].color.match(/^#[A-Fa-f0-9]{6}$/));
      }
    })
  });

  it('#run()', async function () {
    return buildApp().then(async app => {
      try {
        const signal = await app.run();
        console.log(JSON.stringify(signal));
        assert.ok(signal);
        assert.ok(signal.points[0][0], "I should have at least one point");
      }
      catch (error) {
        assert.fail(error);
      }
    })
  });

  it('deletes old signals', function () {
    return buildApp().then(app => {
      return app.deleteOldSignals();
    })
  })
});

async function buildApp(config) {
  config = config || {};
  let app = new t.MiniMeter();
  app.config = {
    mode: t.ModeEnum.CPU,
    geometry: {
      height: 1,
      width: 1,
      origin: {
        x: 1,
        y: 1
      }
    },

    ...config
  };

  return app;
}