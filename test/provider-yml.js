var meta = require('../jet_meta.js'),
    yml_provider = require('../provider/yml.js'),
    assert = require('assert'),
    fs = require('fs');

describe('YML meta provider', function () {

    it('should load valid annotations', function () {
        // recreate env
        var oldEnv = meta.env;
        meta.env = new meta.Env();
        meta.env.registerProvider(new yml_provider(fs.realpathSync('test/node_modules/test_yml/anno.yml')));

        var test_yml = require('test_yml');
        assert.equal(test_yml.prototype.$meta.info.description, 'some extra description');

        meta.env = oldEnv;
    });

});
