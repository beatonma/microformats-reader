import { registerTypeExtensions } from "ts/data/util";

/**
 * Register prototype extension functions so they can be used in code.
 */
export const init = () => {
    registerTypeExtensions();
};
