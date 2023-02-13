import React from "react";

export const TODO = (message?: string) => {
    console.debug(`[TODO]: ${message}`);
};

interface TodoProps {
    message?: string;
}
export const Todo = (props: TodoProps) => {
    return <div className="TODO">{`[TODO] ${props.message ?? ""}`}</div>;
};

export const timeIt = (
    callable: () => unknown,
    label?: string,
    repeats: number = 1000
) => {
    const start = Date.now();
    for (let i = 0; i < repeats; i++) {
        callable();
    }

    const end = Date.now();
    const millis = end - start;
    console.debug(
        `Function ${label ?? callable} completed ${repeats}x in ${millis}ms`
    );
};
