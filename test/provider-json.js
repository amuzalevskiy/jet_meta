var meta = require('../jet_meta.js'),
    json_provider = require('../provider/json.js'),
    assert = require('assert'),
    fs = require('fs');

describe('JSON meta provider', function () {

    it('should load valid annotations', function () {
        // recreate env
        var oldEnv = meta.env;
        meta.env = new meta.Env();
        meta.env.registerProvider(new json_provider(fs.realpathSync('test/node_modules/test_json/anno.json')));

        var test = require('test_json');
        assert.equal(test.prototype.$meta.info.description, 'some extra description');

        meta.env = oldEnv;
    });

});
