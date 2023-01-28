function saveOptions() {
    const options = {
        show_raw_json: document.getElementById("show_raw_json").checked,
    };
    chrome.storage.sync.set(options);
}

function getOptions(callback) {
    chrome.storage.sync.get(
        {
            show_raw_json: false,
        },
        callback
    );
}
