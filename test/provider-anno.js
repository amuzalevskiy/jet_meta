var meta = require('../jet_meta.js'),
    AnnotationProvider = require('../provider/annotation.js'),
    assert = require('assert'),
    fs = require('fs');

describe('Annotation meta provider', function () {

    it('should load valid annotations', function () {
        // recreate env
        var oldEnv = meta.env;
        meta.env = new meta.Env();
        meta.env.registerProvider(new AnnotationProvider());

        var test_anno = require('test_anno');
        assert.equal(test_anno.prototype.$meta.info.description, 'some extra description');

        // restore
        meta.env = oldEnv;
    });

});
