module.exports = require('./observable')
    .extend(function () {
        exports.EventEmitter.call(this);
        this.constructors = [];
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
                meta,
                className = constructor.$meta.info.className;

            this.constructors.push(constructor);

            // add $meta to prototype
            if (constructor.prototype.$meta) {
                meta = constructor.prototype.$meta;
                constructor.prototype.$meta = {};
                this.processMeta(constructor, meta);
            } else {
                constructor.prototype.$meta = {};
            }

            for (i = this.providers.length - 1; i >= 0; i--) {
                meta = this.providers[i].load(className, module.id, constructor);
                if (meta) {
                    this.processMeta(constructor, meta);
                }
            }

            this.build(constructor);
        },
        build: function (constructor) {
            var i, builder;
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
