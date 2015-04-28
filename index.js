var util = require('util');
var EventEmitter = require('events').EventEmitter;

var BaseClass = exports.BaseClass = function () {};

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

    constructor.__proto__ = Object.create(this.__proto__);

    return constructor;
};

BaseClass.__proto__.setModuleInfo = function (module) {
    exports.env.emit('addModule', this, module);
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

exports.EventEmitter = BaseClass.extend(function () {
        EventEmitter.call(this);
    })
    .mixin(EventEmitter.prototype);

exports.Provider = BaseClass.extend()
    .mixin({
        load: function (className, constructor) {}
    });
/*
exports.AnnotationMetaProvider = exports.Provider.extend()
    .mixin({
        load: function (className, constructor) {
            // that requires esprima parser, etc...
        }
    });
exports.YmlMetaProvider = exports.Provider.extend()
    .mixin({
        load: function (className, constructor) {
            // yml loader
        }
    });
exports.JsonMetaProvider = exports.Provider.extend()
    .mixin({
        load: function (className, constructor) {
            // json loader
        }
    });
*/

exports.Builder = BaseClass.extend()
    .mixin({
        add: function (constructor, meta) {},
        build: function (constructor) {}
    });
exports.InfoBuilder = BaseClass.extend()
    .mixin({
        key: 'info',
        add: function (constructor, meta) {
            if (!constructor.prototype.$meta.info) {
                constructor.prototype.$meta.info = {};
            }
            util._extend(constructor.prototype.$meta.info, meta);
        }
    });

exports.Env = exports.EventEmitter.extend(function () {
        exports.EventEmitter.call(this);
        this.builders = [];
        this.providers = [];
        this.registerBuilder(new exports.InfoBuilder());
        this.on('addModule', this.onAddModule.bind(this));
    })
    .mixin({
        registerProvider: function (provider) {
            this.providers.push(provider);
        },
        registerBuilder: function (builder) {
            this.builders[builder.key] = builder;
        },
        onAddModule: function (constructor, module) {
            var i,
                builder,
                meta,
                metaKey,
                className = module.id.split('node_modules').pop()
                .replace(/\\/g, '/')   // windows fix
                .replace(/^\//, '')    // remove starting slash
                .replace(/\.js$/, ''); // remove '.js' extension

            // add $meta to prototype
            if (constructor.prototype.$meta) {
                meta = constructor.prototype.$meta;
                constructor.prototype.$meta = {};
                this.processMeta(meta);
            } else {
                constructor.prototype.$meta = {};
            }

            // add class name
            this.builders.info.add(constructor, {
                className: className
            });

            for (i = this.providers.length - 1; i >= 0; i--) {
                meta = this.providers[i].load(className, constructor);
                if (meta) {
                    this.processMeta(meta);
                }
            }
            for (i = this.builders.length - 1; i >= 0; i--) {
                builder = this.builders[i];
                builder.build(constructor);
            }
        },
        processMeta: function (constructor, meta) {
            var metaKey;
            for (metaKey in meta) {
                if (meta.hasOwnProperty(metaKey)) {
                    if (this.builders.hasOwnProperty(metaKey)) {
                        this.builders[metaKey].add(constructor, meta[metaKey]);
                    }
                }
            }
        }
    });

exports.env = new exports.Env();

/*
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
