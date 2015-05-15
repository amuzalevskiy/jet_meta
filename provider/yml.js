var fs = require('fs'),
    yaml = require('js-yaml');

module.exports = require('./base')
    .extend(function (filename) {
        this.anno = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
    })
    .mixin({
        load: function (className, id, constructor) {
            if (this.anno[className]) {
                return this.anno[className];
            }
        }
    });
