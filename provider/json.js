var fs = require('fs');
module.exports = require('./base')
    .extend(function (filename) {
        // sync read
        this.anno = JSON.parse(fs.readFileSync(filename, 'utf8'));
    })
    .mixin({
        load: function (className, id, constructor) {
            if (this.anno[className]) {
                return this.anno[className];
            }
        }
    });
