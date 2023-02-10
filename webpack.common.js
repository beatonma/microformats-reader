const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

// Based on https://github.com/sszczep/chrome-extension-webpack
module.exports = {
    optimization: {
        minimize: false,
    },
    entry: {
        "service-worker": "./app/ts/entrypoint/service-worker.ts",
        "content-script": "./app/ts/entrypoint/content-script.ts",
        popup: "./app/ts/entrypoint/popup.tsx",
        options: "./app/ts/entrypoint/options.ts",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /.svg$/,
                use: [
                    "babel-loader",
                    {
                        loader: "react-svg-loader",
                        options: {
                            jsx: true,
                            svgo: {
                                plugins: [{ removeViewBox: false }],
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [path.resolve(__dirname, "./app"), "node_modules"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "./app/static" }],
        }),
    ],
};
