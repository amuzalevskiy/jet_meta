module.exports = require('../baseClass')
    .extend()
    .setModuleInfo(module)
    .mixin({
        load: function (className, constructor) {}
    });
