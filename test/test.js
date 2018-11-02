const assert = require('assert');
const t = require('../q-cpu-usage');

const black = '#000000';

describe('CpuUsage', function () {
  let app = new t.CpuUsage();

  it('#getCpuUsage', function () {
    app.getCpuUsage().then(percent => {
      console.log("CPU Usage is: " + percent);
      assert.ok(percent);
    })
  });

  it('#getColor', function() {
    assert.equal(black, app.getColor(0, 0));
    assert.notEqual(black, app.getColor(0, 1));

    assert.equal(black, app.getColor(9, 9));
    assert.notEqual(black, app.getColor(9, 10));
  })

  it('#generatePoints', function () {
    const testLights = function (percent) {
      const points = app.generatePoints(percent);
      for (let i = 0; i < points.length; i += 1) {
        if (points[i].color === black) {
          return i;
        }
      }

      return points.length;
    }

    const assertLights = function (percent, expected) {
      const actual = testLights(percent);
      const message = `For CPU usage ${percent}, I have ${actual} lights `
        + `(expected ${expected})`;  
      assert(expected === actual, message);
    }

    assertLights(0.04, 0);
    assertLights(0.05, 1);
    assertLights(0.1, 1);
    assertLights(0.2, 2);
    assertLights(0.3, 3);
    assertLights(0.4, 4);
    assertLights(0.5, 5);
    assertLights(0.6, 6);
    assertLights(0.7, 7);
    assertLights(0.8, 8);
    assertLights(0.9, 9);
    assertLights(0.95, 10);
    assertLights(1.0, 10);
    assertLights(1.1, 10);
  });

  it('#run()', function () {
    app.run().then((signal) => {
      console.log(JSON.stringify(signal));
      assert.ok(signal);
    }).catch(error => {
      assert.fail(error);
    });
  });
})