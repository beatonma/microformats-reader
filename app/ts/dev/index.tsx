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
