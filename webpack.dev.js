const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

module.exports = (env, argv) => {
    const injectedEnv = Object.keys(env).reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(env[key]);
        return acc;
    }, {});

    return merge(common, {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
            static: "./dist",
        },
        entry: {
            popup: "./app/ts/dev/popup.dev.tsx",
        },
        plugins: [new webpack.DefinePlugin(injectedEnv)],
    });
};
