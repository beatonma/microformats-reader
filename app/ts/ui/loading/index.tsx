import React from "react";

export const Loading = (props: { reason?: string }) => (
    <div className="loading-spinner" data-loading-reason={props.reason}>
        <div className="spinner-wrapper">
            <div />
            <div />
            <div />
        </div>
    </div>
);
