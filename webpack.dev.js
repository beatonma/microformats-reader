const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

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
            port: 3002,
        },
        entry: {
            popup: "./app/ts/dev/popup.dev.tsx",
            server: "./app/ts/dev/server.dev.tsx",
        },
        module: {
            rules: [
                {
                    test: /\.html/,
                    type: "asset/source",
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin(injectedEnv),
            new CopyPlugin({
                patterns: [
                    {
                        from: "./app/static",
                        filter: filepath => filepath.includes(".dev."),
                    },
                ],
            }),
        ],
    });
};
