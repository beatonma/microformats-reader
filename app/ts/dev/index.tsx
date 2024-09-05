import React from "react";

import { joinNotEmpty } from "ts/data/util/arrays";

export const TODO = (message?: string) => {
    console.debug(`[TODO]: ${message}`);
};

export const Todo = (props: { message?: string }) => {
    return <div className="TODO">{`[TODO] ${props.message ?? ""}`}</div>;
};

export const timeIt = (
    callable: () => unknown,
    label?: string,
    repeats: number = 1000,
) => {
    const start = Date.now();
    for (let i = 0; i < repeats; i++) {
        callable();
    }

    const end = Date.now();
    const millis = end - start;
    console.debug(
        `Function ${label ?? callable} completed ${repeats}x in ${millis}ms`,
    );
};

export const dump = <T extends any>(obj: T, label?: string): T => {
    const msg = joinNotEmpty(": ", [label, JSON.stringify(obj, null, 2)]);
    console.debug(msg);
    return obj;
};
