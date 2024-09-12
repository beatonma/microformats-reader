import path from "path";
import webpack from "webpack";
import child_process from "child_process";
import CopyPlugin from "copy-webpack-plugin";
import merge from "webpack-merge";

type Configuration = object;

const git = (command: string) =>
    child_process.execSync(`git ${command}`, { encoding: "utf8" }).trim();

const gitVersionCode = git("rev-list HEAD --count");

const common: Configuration = {
    entry: {
        "content-script": "./app/ts/entrypoint/content-script.ts",
        "service-worker": "./app/ts/entrypoint/service-worker.ts",
        popup: "./app/ts/entrypoint/popup/index.tsx",
        options: "./app/ts/entrypoint/options/options.tsx",
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["swc-loader"],
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
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            icon: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [path.resolve(__dirname, "./app"), "node_modules"],
        alias: {
            process: "process/browser",
        },
    },
    output: {
        filename: "[name].js",
        clean: true,
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            VERSION_CODE: gitVersionCode,
            VERSION_HASH: git("rev-parse HEAD"),
            VERSION_DESCRIPTION: git("describe --always"),
            VERSION_DATE: git("log -1 --format=%as"),
        }),
    ],
};

namespace Flavor {
    export const Development: Configuration = {
        mode: "development",
        devtool: "inline-source-map",
        optimization: {
            minimize: false,
        },
        performance: {
            hints: false,
        },
        entry: {
            server: "./app/ts/dev/server.dev.tsx",
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: "./app/static",
                        filter: filepath => !filepath.endsWith("manifest.json"),
                    },
                ],
            }),
        ],
    };

    export const Production: Configuration = {
        mode: "production",
        devtool: "source-map",
        optimization: {
            minimize: true,
        },
        performance: {
            hints: "warning",
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: "./app/static",
                        filter: filepath =>
                            !filepath.endsWith("manifest.json") &&
                            !filepath.includes(".dev."),
                    },
                ],
            }),
        ],
    };
}

namespace Browser {
    /*
     * Browser-specific configuration.
     */

    type Manifest = Record<string, any>;
    const buildManifest = (
        transform?: (manifest: Manifest) => Manifest,
    ): CopyPlugin.Pattern => {
        return {
            from: "./app/static/manifest.json",
            transform(content: Buffer, absoluteFilename: string) {
                const manifest = JSON.parse(content.toString());
                manifest.version = gitVersionCode;
                return JSON.stringify(transform?.(manifest) ?? manifest);
            },
        };
    };
    export const Chrome: Configuration = {
        plugins: [
            new CopyPlugin({
                patterns: [buildManifest()],
            }),
        ],
    };
    export const Firefox: Configuration = {
        plugins: [
            new CopyPlugin({
                patterns: [
                    buildManifest(manifest => {
                        manifest.background = {
                            scripts: ["service-worker.js"],
                        };
                        manifest.browser_specific_settings = {
                            gecko: {
                                // ID required for browser.storage.sync API.
                                // (Not a valid email address, just for the record.)
                                id: "microformats-reader@beatonma.org",
                            },
                        };
                        return manifest;
                    }),
                ],
            }),
        ],
    };
}

module.exports = (env: Record<string, any>, argv: any) => {
    const base = merge(
        common,
        argv.mode === "development" ? Flavor.Development : Flavor.Production,
        {
            output: {
                path: path.resolve(
                    __dirname,
                    `dist/${env.browser}-${argv.mode}`,
                ),
            },
        },
    );

    switch (env.browser) {
        case "chrome":
            return merge(base, Browser.Chrome);
        case "firefox":
            return merge(base, Browser.Firefox);
        default:
            throw `Unhandled browser '${argv.browser}'`;
    }
};
