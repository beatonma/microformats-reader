function dropdown(id, content) {
    if (!content || content === "") {
        return null;
    }

    const icon_id = id + "_icon";
    const dropdown_id = id + "_dropdown";

    const button = new SpanBuilder("dropdown")
        .setId(id)
        .add(
            new SvgBuilder("dropdown-icon")
                .setId(icon_id)
                .setIcon("svg_icon_action_arrow_down")
        );
    // .add(new Tooltip().setFor(icon_id).add(getMessage('dropdown_tooltip_default'))));

    const dropdown = new DivBuilder("dropdown-content")
        .setId(dropdown_id)
        .add(content);

    dropdown.addBefore(button);
    return dropdown;
}

function toggleDropdown(id) {
    document.getElementById(id + "_icon").classList.toggle("showdrop");
    document.getElementById(id + "_dropdown").classList.toggle("showdrop");
}

function setupDropdownListeners() {
    let dropdowns = document.getElementsByClassName("dropdown");
    for (let i = 0; i < dropdowns.length; i++) {
        let el = dropdowns[i];
        el.addEventListener("click", function () {
            toggleDropdown(this.id);
        });
    }
}
