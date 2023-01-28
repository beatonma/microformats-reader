module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: false,
                targets: {
                    node: "current",
                },
            },
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
    ],
    plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties",
    ],
    env: {
        production: {
            only: ["src"],
            plugins: [
                [
                    "transform-react-remove-prop-types",
                    {
                        removeImport: true,
                    },
                ],
                "@babel/plugin-transform-react-inline-elements",
                "@babel/plugin-transform-react-constant-elements",
            ],
        },
        test: {
            plugins: ["@babel/plugin-transform-modules-commonjs"],
        },
    },
};
