var EventEmitter = require('events').EventEmitter;

module.exports = require('./baseClass')
    .extend(function () {
        EventEmitter.call(this);
    })
    .mixin(EventEmitter.prototype);
