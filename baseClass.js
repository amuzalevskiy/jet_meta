var BaseClass,
    bus = require('./bus.js'),
    util = require('util');

/*
 // temp

 function cloneFunction (fn, protoProps) {
     var res = fn.toString().match(/^[^(]*\(([^\)]*)\)[^\{]*\{(.*)\}[^\}]*$/im);
     function MyFunction() {
         Function.apply(this, arguments);
     };
     MyFunction.prototype = Object.create(Function.prototype);
     util._extend(MyFunction.prototype, protoProps);
     MyFunction.prototype.constructor = MyFunction;
     return new MyFunction(res[1], res[2]);
 }
 cloneFunction(fnToClone);
*/


module.exports = BaseClass = function () {};

BaseClass.__proto__ = Object.create(Function.prototype);
BaseClass.__proto__.extend = function (constructor) {
    var parent = this;
    if (!constructor) {
        constructor = function () { return parent.apply(this, arguments); };
    }

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () { this.constructor = constructor; };
    Surrogate.prototype = parent.prototype;
    constructor.prototype = new Surrogate;

    // it's not good, but working at least for backend
    // seems like it don't supported in IE9 and lower
    constructor.__proto__ = Object.create(this.__proto__);

    return constructor;
};

BaseClass.__proto__.setModuleInfo = function (module) {
    if (!this.prototype.hasOwnProperty('$meta')) {
        this.prototype.$meta = {};
    }
    if (!this.prototype.$meta.hasOwnProperty('info')) {
        this.prototype.$meta.info = {};
    }
    if (!this.prototype.$meta.info.hasOwnProperty('className')) {
        this.prototype.$meta.info.className = module.id.split('node_modules').pop()
            .replace(/\\/g, '/')   // windows fix
            .replace(/^\//, '')    // remove starting slash
            .replace(/\.js$/, ''); // remove '.js' extension;
    }

    bus.emit('addModule', this, module);
    return this;
};

BaseClass.__proto__.mixin = function (protoProps) {
    util._extend(this.prototype, protoProps);
    return this;
};

BaseClass.__proto__.mixStatic = function (staticProps) {
    util._extend(this.__proto__, staticProps);
    return this;
};

BaseClass.mixin({
    $meta: {
        info: {
            className: "jet_meta/baseClass"
        }
    }
});
