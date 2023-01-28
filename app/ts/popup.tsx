import React from "react";
import { createRoot } from "react-dom/client";
import "./popup.scss";
import { Message } from "./message";

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const url = new URL(tabs[0].url);
    chrome.tabs.sendMessage(
        tabs[0].id,
        { action: Message.getMicroformats },
        {},
        (response: MicroformatsMessage) => {
            // render(url, response);
            console.log(response);
        }
    );
});

const PopupUI = () => {
    return (
        <div>
            <h1>HELLO POPUP</h1>
        </div>
    );
};

const root = createRoot(document.getElementById("container"));
root.render(<PopupUI />);
