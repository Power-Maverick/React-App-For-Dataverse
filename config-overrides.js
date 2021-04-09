const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appBuild = paths.appBuild.replace("build", "dist");
        return paths;
    },
    webpack: function (config, env) {
        if (env === "production") {
            config.optimization.runtimeChunk = false;
            config.optimization.splitChunks = {
                cacheGroups: {
                    default: false
                }
            };

            //JS Overrides
            config.output.filename = 'js/SuperHeroScript.js';
            config.output.chunkFilename = 'js/SuperHeroScript.chunk.js';

            //CSS Overrides
            config.plugins[5].options.filename = 'css/SuperHeroStyles.css';
            config.plugins[5].options.moduleFilename = () => 'css/SuperHeroStyles.css';

            // //Media and Assets Overrides
            // config.module.rules[1].oneOf[0].options.name = 'media/[name].[ext]';
            // config.module.rules[1].oneOf[3].options.name = 'media/[name].[ext]';
        }

        return config;
    }
}