var meta = require('../jet_meta.js'),
    assert = require('assert');

describe('Inheritance', function () {

    it('instanceof should work', function () {
        var childClass = meta.BaseClass.extend(),
            secondChildClass = meta.BaseClass.extend(),
            childChildClass = childClass.extend(),
            child = new childClass(),
            secondChild = new secondChildClass(),
            childChild = new childChildClass();

        assert(child instanceof meta.BaseClass);
        assert(child instanceof childClass);
        assert(secondChild instanceof meta.BaseClass);
        assert(secondChild instanceof secondChildClass);
        assert(childChild instanceof meta.BaseClass);
        assert(childChild instanceof childClass);
        assert(!(childChild instanceof secondChildClass));
    });

    it('constructor should be replaced', function () {
        var childClass = meta.BaseClass.extend(function () {
                this.x = 5;
            }),
            childChildClass = childClass.extend(),
            child = new childClass(),
            childChild = new childChildClass();

        assert.equal(child.x, 5);
        assert.equal(childChild.x, 5);
    });

    it('mixin() should work', function () {
        var childClass = meta.BaseClass.extend(),
            childChildClass = childClass.extend()
            childChildChildClass = childChildClass.extend(),
            child = new childClass(),
            childChild = new childChildClass()
            childChildChild = new childChildChildClass();

        childClass.mixin({x: 5});
        childChildClass.mixin({y: 5});
        childChildChildClass.mixin({z: 5});

        assert.equal(child.x, 5);
        assert.equal(childChild.x, 5);
        assert.equal(childChildChild.x, 5);
        assert.equal(child.y, undefined);
        assert.equal(childChild.y, 5);
        assert.equal(childChildChild.y, 5);
        assert.equal(child.z, undefined);
        assert.equal(childChild.z, undefined);
        assert.equal(childChildChild.z, 5);
    });

    it('mixStatic() should work', function () {
        var childClass = meta.BaseClass.extend(),
            childChildClass = childClass.extend(),
            childChildChildClass = childChildClass.extend();

        childClass.mixStatic({x: 5});
        childChildClass.mixStatic({y: 5});
        childChildChildClass.mixStatic({z: 5});

        assert.equal(childClass.x, 5);
        assert.equal(childChildClass.x, 5);
        assert.equal(childChildChildClass.x, 5);
        assert.equal(childClass.y, undefined);
        assert.equal(childChildClass.y, 5);
        assert.equal(childChildChildClass.y, 5);
        assert.equal(childClass.z, undefined);
        assert.equal(childChildClass.z, undefined);
        assert.equal(childChildChildClass.z, 5);
    });
});
