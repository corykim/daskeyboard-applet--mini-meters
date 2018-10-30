const assert = require('assert');
const t = require('../q-cpu-usage');

describe('CpuUsage', function () {
  let app = new t.CpuUsage();

  it('#run()', function () {
    app.run().then((signal) => {
      console.log(JSON.stringify(signal));
      assert.ok(signal);      
    }).catch(error => {
      assert.fail(error);
    });
  });
})