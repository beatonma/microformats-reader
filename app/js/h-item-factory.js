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
    constructor(microformat_json) {
        this.microformat_json = microformat_json;
    }

    get(key, default_value='') {
        return getValueOr(this.microformat_json, key, default_value);
    }

    // Given a list of possible keys, find the first one that returns usable data
    // and return its metadata in an object.
    choose(candidates_keys) {
        let key = null;
        let value = null;
        let classes = null;

        if (!Array.isArray(candidates_keys)) {
            candidates_keys = [candidates_keys];
        }
        for (let i = 0; i < candidates_keys.length; i++) {
            let v = getValueOr(this.microformat_json, candidates_keys[i]);
            if (v) {
                value = v;
                key = candidates_keys[i];
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

    // label_key is a messages key for either a string or an svg icon
    // itemTemplate is a TagBuilder instance used as a base template for each item view
    make(tagname, candidate_microformat_keys, label_key=null, itemTemplate=null) {
        let content = null;
        let microformat_key = null;

        // Convert keys to an array if it isn't already
        if (!Array.isArray(candidate_microformat_keys)) {
            candidate_microformat_keys = [candidate_microformat_keys];
        }
        for (let i = 0; i < candidate_microformat_keys.length; i++) {
            content = getValueOr(this.microformat_json, candidate_microformat_keys[i], null);
            if (content) {
                microformat_key = candidate_microformat_keys[i];
                // console.log('make() content found - using key=' + microformat_key + ', content="' + content + '"');
                break;
            }
        }

        if (!content) {
            // TODO null keys generating empty tag groups
            // console.log(format('no content for key="{}" from candidates [{}]', microformat_key, candidate_microformat_keys));
            return new TagBuilder(tagname);
        }

        let classes = getValueOr(microformats_map, microformat_key);


        function makeItem(item) {
            const builder = new TagBuilder(tagname);
            if (itemTemplate) {
                builder.clone(itemTemplate);
            }
            builder
                    .add(linkify(item))
                    .addClass(classes);

            if (label_key) {
                if (label_key.indexOf('svg_icon_') >= 0) {
                    builder.addPrefix(new SvgBuilder().setIcon(label_key).addClass('h-item-icon'));
                }
                else {
                    builder.addPrefix(new SpanBuilder().add(format('{}:', getMessage(label_key))).addClass('h-item-label'));
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

    // candidate_microformat_keys is a list of keys which should be tried.
    // The key names should correspond to items in microformats_map.
    // They will be be tried in order until one of them returns a usable value.
    // That key will then be used for the rest of the method.
//     make(tagname, candidate_microformat_keys, label_key=null, raw_label=null, content_tag='span', kwargs={}) {
//         let content = null;
//         let microformat_key = null;

//         // Convert keys to an array if it isn't already
//         if (!Array.isArray(candidate_microformat_keys)) {
//             candidate_microformat_keys = [candidate_microformat_keys];
//         }
//         for (let i = 0; i < candidate_microformat_keys.length; i++) {
//             content = getValueOr(this.microformat_json, candidate_microformat_keys[i], null);
//             if (content) {
//                 microformat_key = candidate_microformat_keys[i];
//                 // console.log('make() content found - using key=' + microformat_key + ', content="' + content + '"');
//                 break;
//             }
//         }

//         if (!content) {
//             return new TagBuilder(tagname);
//         }

//         let classes = getValueOr(microformats_map, microformat_key);

//         if (content.length > 1) {
//             return this.makeGroup(tagname, content, classes, label_key, raw_label);
//         }
//         else {
//             content = linkify(content[0]);
//         }

//         let b = new TagBuilder(tagname);

//         if (label_key) {
//             b.content = new TagBuilder(
//                 content_tag,
//                 {
//                     'content': content,
//                     'classes': classes
//                 }
//             ).build(null);
//             b.prefix = new SpanBuilder({
//                 'content': format('{}:', getMessage(label_key)),
//                 'classes': 'h-item-label'
//             }).build(null);
//         }
//         else if (raw_label) {
//             b.content = new TagBuilder(
//                 content_tag,
//                 {
//                     'content': content,
//                     'classes': classes
//                 }
//             ).build(null);
//             b.prefix = new SpanBuilder({
//                 'content': raw_label
//                 // 'classes': 'h-item-icon'
//             }).build(null);
//         }
//         else {
//             b.content = content;
//             b.classes = classes;
//         }

//         return b;
//     }

//     makeGroup(tagname, contents, classes, label_key=null, raw_label=null) {
//         let b = new GroupBuilder(new TagBuilder(tagname));

//         for (let i = 0; i < contents.length; i++) {
//             let t = new TagBuilder(tagname);
//             let content = linkify(contents[i]);
//             if (label_key) {
//                 t.content = new SpanBuilder({
//                     'content': content,
//                     'classes': classes
//                 }).build(null);
//                 t.prefix = new SpanBuilder({
//                     'content': format('{}:', getMessage(label_key)),
//                     'classes': 'h-item-label'
//                 }).build(null);
//             }
//             else if (raw_label) {
//                 t.content = new SpanBuilder({
//                     'content': content,
//                     'classes': classes
//                 }).build(null);
//                 t.prefix = new SpanBuilder({
//                     'content': raw_label
//                 }).build(null);
//             }
//             else {
//                 t.content = content;
//                 t.classes = classes;
//             }

//             b.add(t);
//         }

//         return b;
//     }
}