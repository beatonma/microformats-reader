import { registerArrayExtensions } from "ts/data/util/arrays";
import { registerObjectExtensions } from "ts/data/util/object";
import { registerPrimitiveExtensions } from "ts/data/util/primitives";

export const registerTypeExtensions = () => {
    registerObjectExtensions();
    registerArrayExtensions();
    registerPrimitiveExtensions();
};
