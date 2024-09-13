/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ["app/", "node_modules/"],

    moduleNameMapper: {
        "\\.svg$": "<rootDir>/app/ts/test/__mocks__/svg.js",
    },

    modulePathIgnorePatterns: ["dist/", "env/", "node_modules/"],

    // A map from regular expressions to paths to transformers
    // transform: undefined,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },

    verbose: true,
};
