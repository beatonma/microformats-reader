// function dropdown(id, content) {
//     if (!content || content == '') {
//         return null;
//     }

//     const icon_id = id + '_icon';
//     const dropdown_id = id + '_dropdown';

//     let buttonBuilder = new SpanBuilder({});
//     buttonBuilder.id = id;
//     buttonBuilder.classes = 'dropdown';
//     // buttonBuilder.content = format('<i id="{}" class="dropdown-icon">arrow_drop_down</i>', icon_id);
//     buttonBuilder.content = new SvgBuilder({'classes': 'dropdown-icon'}, 'svg_icon_action_arrow_down').build();
//     buttonBuilder.allow_separators = false;

//     let dropdownBuilder = new DivBuilder();
//     dropdownBuilder.id = dropdown_id;
//     dropdownBuilder.classes = 'dropdown-content';
//     dropdownBuilder.content = content;

//     return [buttonBuilder, dropdownBuilder];
// }

function dropdown(id, content) {
    if (!content || content == '') {
        return null;
    }

    const icon_id = id + '_icon';
    const dropdown_id = id + '_dropdown';

    const button =
        new SpanBuilder('dropdown')
            .setId(id)
            .add(new SvgBuilder('dropdown-icon')
                    .setId(icon_id)
                    .setIcon('svg_icon_action_arrow_down'));

    const dropdown =
        new DivBuilder('dropdown-content')
            .setId(dropdown_id)
            .add(content);

    dropdown.addBefore(button);
    return dropdown;
}

function toggleDropdown(id) {
    console.log(format('toggleDropdown({})', id));
    $('#' + id + '_icon').toggleClass('showdrop');
    $('#' + id + '_dropdown').toggleClass('showdrop');
}

function setupDropdownListeners() {
    let dropdowns = document.getElementsByClassName('dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        let el = dropdowns[i];
        el.addEventListener('click', function() {
            toggleDropdown(this.id);
        });
    }
}