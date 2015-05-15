exports.InfoBuilder = require('./base')
    .extend()
    .setModuleInfo(module)
    .mixin({
        key: 'info'
    });
