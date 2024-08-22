import { registerArrayExtensions } from "ts/data/util/arrays";
import { registerObjectExtensions } from "ts/data/util/object";

/**
 * Register prototype extension functions so they can be used in code.
 */
export const init = () => {
    registerObjectExtensions();
    registerArrayExtensions();
};
