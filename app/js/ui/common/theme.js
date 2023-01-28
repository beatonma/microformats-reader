let theme = "day";
let accentColor = "";
let accentTextColor = "";
let accentApplied = false;

// Automatically change basic color themes depending on time of day
// Dark theme between 8pm - 8am
function setDayNightAutoTheme() {
    const h = new Date().getHours();
    if (h > 8 && h < 20) {
        theme = "day";
        setTheme(theme);
    } else {
        theme = "night";
        setTheme(theme);
    }
}

function setTheme(newtheme, args) {
    console.log("theme:" + newtheme);
    const stylesheet = document.getElementById("theme");
    if (newtheme === "day") {
        stylesheet.setAttribute(
            "href",
            chrome.extension.getURL("css/colors-day.css")
        );
        theme = newtheme;
    } else if (newtheme === "night") {
        stylesheet.setAttribute(
            "href",
            chrome.extension.getURL("css/colors-night.css")
        );
        theme = newtheme;
    } else if (newtheme === "") {
        if (theme === "") {
            // This should never happen, but better include it just in case to avoid apocalypse
            theme = "day";
        }
        setTheme(theme);
    }
}

function toggleTheme() {
    if (theme === "day") {
        theme = "night";
    } else {
        theme = "day";
    }

    setCookie("theme", theme, 3 * 60 * 60 * 1000); // Remember this theme selection for 3 hours

    setTheme(theme, true);
}

function setAccent(color, textColor) {
    accentColor = color;
    accentTextColor = textColor;
    accentApplied = false;
}

function applyAccent() {
    if (theme !== "day") {
        return;
    }
    if (accentColor === "" || accentTextColor === "") {
        return;
    }
    if (accentApplied) {
        return;
    }

    setTheme(accentColor, accentTextColor);
    accentApplied = true;
}

function removeAccent() {
    if (!accentApplied) {
        return;
    }
    setDayNightAutoTheme();
    accentApplied = false;
}

setDayNightAutoTheme();
