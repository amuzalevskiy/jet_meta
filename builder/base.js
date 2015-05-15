module.exports = require('../baseClass')
    .extend()
    .setModuleInfo(module)
    .mixin({
        add: function (constructor, meta) {
            if (!constructor.prototype.$meta[this.key]) {
                constructor.prototype.$meta[this.key] = {};
            }
            util._extend(constructor.prototype.$meta[this.key], meta);
        },
        build: function (constructor) {}
    });
