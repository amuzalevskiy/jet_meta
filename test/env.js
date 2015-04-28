var meta = require('../index.js'),
    assert = require('assert');

describe('Env', function () {
    it('should find valid class name', function () {
        var class1 = meta.BaseClass.extend().setModuleInfo({
                id: "projects\\jet_meta\\index.js"
            }),
            class2 = meta.BaseClass.extend().setModuleInfo({
                id: "projects\\jet_meta\\node_modules\\test\\index.js"
            }),
            class3 = meta.BaseClass.extend().setModuleInfo({
                id: "projects/jet_meta/node_modules/jet_meta/node_modules/jet_meta/node_modules/test/index2.js"
            });
        assert.equal(class1.prototype.$meta.info.className, 'projects/jet_meta/index');
        assert.equal(class2.prototype.$meta.info.className, 'test/index');
        assert.equal(class3.prototype.$meta.info.className, 'test/index2');
    });
});
