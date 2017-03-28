function getCardIcon(elementId, iconId, tooltipId, title=null) {
    elementId = makeHtmlId(elementId) + '_type_icon';

    const typeIcon = new TagBuilder().addClass('flex-box-row').allowEmpty();
    if (title) {
        typeIcon.add(new DivBuilder().addClass('h-section-label').add(title));
    }
    typeIcon.add(new DivBuilder().addClass('mdl-layout-spacer').allowEmpty());
    typeIcon.add(new SvgBuilder().addClass('card-type-icon').setId(elementId).setIcon(iconId));
    typeIcon.add(new Tooltip().setFor(elementId).add(getMessage(tooltipId)));

    return typeIcon;
}

class HObject {
    constructor(properties) {
        this.svgIconId = '';
        this.svgIconDescription = '';
    }

    getCardIcon(name) {
        return getCardIcon(name, this.svgIconId, this.svgIconDescription);
    }
}

class HItemFactory {
    constructor(microformatJson) {
        this.microformatJson = microformatJson;
    }

    get(key, default_value='') {
        return getValueOr(this.microformatJson, key, default_value);
    }

    // Given a list of possible keys, find the first one that returns usable data
    // and return its metadata in an object.
    choose(candidatesKeys) {
        let key = null;
        let value = null;
        let classes = null;

        if (!Array.isArray(candidatesKeys)) {
            candidatesKeys = [candidatesKeys];
        }
        for (let i = 0; i < candidatesKeys.length; i++) {
            let v = getValueOr(this.microformatJson, candidatesKeys[i]);
            if (v) {
                value = v;
                key = candidatesKeys[i];
                break;
            }
        }

        if (value && key) {
            return {
                'key': key,
                'value': value,
                'classes': getValueOr(microformats_map, key)
            }
        }
        return null;
    }

    // labelKey is a messages key for either a string or an svg icon
    // itemTemplate is a TagBuilder instance used as a base template for each item view
    make(tagname, candidateMicroformatKeys, labelKey=null, itemTemplate=null) {
        let content = null;
        let microformatKey = null;

        // Convert keys to an array if it isn't already
        if (!Array.isArray(candidateMicroformatKeys)) {
            candidateMicroformatKeys = [candidateMicroformatKeys];
        }
        for (let i = 0; i < candidateMicroformatKeys.length; i++) {
            content = getValueOr(this.microformatJson, candidateMicroformatKeys[i], null);
            if (content) {
                microformatKey = candidateMicroformatKeys[i];
                break;
            }
        }

        if (!content) {
            return new TagBuilder(tagname);
        }

        let classes = getValueOr(microformats_map, microformatKey);


        function makeItem(item) {
            const builder = new TagBuilder(tagname);
            if (itemTemplate) {
                builder.clone(itemTemplate);
            }
            builder
                .add(linkify(item))
                .addClass(classes);

            if (labelKey) {
                if (labelKey.indexOf('svg_icon_') >= 0) {
                    builder.addPrefix(new SvgBuilder().setIcon(labelKey).addClass('h-item-icon'));
                }
                else {
                    builder.addPrefix(new SpanBuilder().add(format('{}:', getMessage(labelKey))).addClass('h-item-label'));
                }
            }
            return builder;
        }

        let container = new TagBuilder(tagname);
        for (let i = 0; i < content.length; i++) {
            container.add(makeItem(content[i]));
        }

        return container;
    }
}