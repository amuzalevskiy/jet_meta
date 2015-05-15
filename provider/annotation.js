var esprima = require('esprima'),
    fs = require('fs');
module.exports = require('./base')
    .extend()
    .mixin({
        load: function (className, id, constructor) {
            console.log(fs.readFileSync(id));
            var tokens = esprima.parse(fs.readFileSync(id), {
                attachComment: true
            });
            console.log(tokens.body[1]);
        },
        getExportStatement: function (tokenTree) {
            return {

            };
        },
        findMemberDeclarations: function () {

        },
        findStaticDeclarations: function () {

        },
        parseCommentBlock: function () {
            /*
             * support @expr
             */
            /*
             * support jsdoc like @expr <token> ...
             */
            /*
             * support @expr (name=val, ...)
             */
        }
    });
