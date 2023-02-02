const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Based on https://github.com/sszczep/chrome-extension-webpack
module.exports = {
    optimization: {
        minimize: false,
    },
    entry: {
        "service-worker": "./app/ts/service-worker.ts",
        "content-script": "./app/ts/content-script.ts",
        popup: "./app/ts/popup.tsx",
        options: "./app/ts/options.ts",
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new CopyPlugin({
            patterns: [{ from: "./app/static" }],
        }),
    ],
};
