function initOptions() {
    getOptions(function(items) {
        document.getElementById('show_raw_json').checked = items.show_raw_json;
    });
    const inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', saveOptions);
    }
}

document.addEventListener('DOMContentLoaded', initOptions);