const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const child_process = require("child_process");

const git = command =>
    child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();

const gitVersionCode = git("rev-list HEAD --count");

module.exports = {
    optimization: {
        minimize: false,
    },
    entry: {
        "service-worker": "./app/ts/entrypoint/service-worker.ts",
        "content-script": "./app/ts/entrypoint/content-script.ts",
        popup: "./app/ts/entrypoint/popup.tsx",
        options: "./app/ts/entrypoint/options.tsx",
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
            {
                test: /\.html/,
                type: "asset/source",
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
            patterns: [
                { from: "./app/static" },
                {
                    from: "./app/static/manifest.json",
                    transform(content, absoluteFrom) {
                        const manifest = JSON.parse(content.toString());

                        manifest.version = gitVersionCode;

                        return JSON.stringify(manifest);
                    },
                },
            ],
        }),
        new webpack.EnvironmentPlugin({
            VERSION_CODE: gitVersionCode,
            VERSION_HASH: git("rev-parse HEAD"),
            VERSION_DESCRIPTION: git("describe --always"),
            VERSION_DATE: git("log -1 --format=%as"),
        }),
    ],
};
