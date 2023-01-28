/**
 * A class to simplify the construction of well-formatted HTML tags.
 */
class TagBuilder {
    constructor(tagname, classname = null) {
        // The type of tag e.g. 'span', 'div'
        this.tagname = tagname;

        // Stuff between the start and end tags
        // May be raw data or another TagBuilder instance
        this.children = [];

        // Separators can be inserted between child items to construct a nice list.
        this.separator = "";
        this.finalSeparator = "";

        // Conditional elements, constructed in the same way as normal content
        // except these will only be used if content does not render to an
        // empty string.
        // This can be overriden by setting hideIfEmpty to false;
        this.hideIfEmpty = true;
        this.prefix = [];
        this.suffix = [];

        // As with prefix/suffix, these are conditional on the main content
        // but these appear as siblings to the main tag instead of children to it.
        this.before = [];
        this.after = [];

        // Stuff defined within the start tag
        this.id = "";
        this.classes = [];
        this.styles = [];
        this.attrs = [];

        // If false, only the children of this tag will be rendered - the wrapper will be discarded
        // Useful for constructing a list of tags with no additional parent
        this.renderContainer = true;

        if (classname) {
            this.addClass(classname);
        }
    }

    setId(id) {
        this.id = id;
        return this;
    }

    addClass(classname) {
        this.classes.push(classname);
        return this;
    }

    // content may be a TagBuilder instance or raw data
    addContent(content) {
        if (content instanceof TagBuilder && content.isEmpty()) {
            // Don't bother adding items that will render as empty
            return this;
        }
        this.children.push(content);
        return this;
    }

    // alias for addContent()
    addChild(child) {
        return this.addContent(child);
    }

    // alias for addContent()
    add(content) {
        return this.addContent(content);
    }

    addStyle(style) {
        this.styles.push(style);
        return this;
    }

    addAttr(attr) {
        this.attrs.push(attr);
        return this;
    }

    addPrefix(item) {
        this.prefix.push(item);
        return this;
    }

    addSuffix(item) {
        this.suffix.push(item);
        return this;
    }

    addBefore(item) {
        this.before.push(item);
        return this;
    }

    addAfter(item) {
        this.after.push(item);
        return this;
    }

    setSeparator(separator, finalSeparator = null) {
        this.separator = separator;
        this.finalSeparator = finalSeparator || separator;
        return this;
    }

    allowEmpty(allow = true) {
        this.hideIfEmpty = !allow;
        return this;
    }

    isEmpty() {
        if (!this.hideIfEmpty) {
            return false;
        }

        const children = this.children;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                let content = null;
                if (item instanceof TagBuilder) {
                    content = item.render("");
                } else {
                    content = item;
                }

                if (content) {
                    return false;
                }
            }
        }
        return true;
    }

    getFormattedSpecialAttributes() {
        return "";
    }

    /**
     * Make a copy of another TagBuilder instance
     */
    clone(other) {
        function copyArray(arr) {
            const a = [];
            for (let i = 0; i < arr.length; i++) {
                a.push(arr[i]);
            }
            return a;
        }
        this.tagname = other.tagname;
        this.children = copyArray(other.children);
        this.hideIfEmpty = other.hideIfEmpty;
        this.prefix = copyArray(other.prefix);
        this.suffix = copyArray(other.suffix);
        this.id = other.id;
        this.classes = copyArray(other.classes);
        this.styles = copyArray(other.styles);
        this.attrs = copyArray(other.attrs);
    }

    // Only render children of this tag, not the tag itself
    renderChildren(empty = "") {
        this.renderContainer = false;
        return this.render(empty);
    }

    /**
     * @param  {object} empty value to return if this TagBuilder has no content
     * @return {string} String representation of this tag, or the value of empty
     */
    render(empty = "") {
        if (this.hideIfEmpty && this.children.length === 0) {
            return empty;
        }

        // Compile any child TagBuilder instances to a string representation
        function renderContent(content_array) {
            const rendered = [];
            for (let i = 0; i < content_array.length; i++) {
                const item = content_array[i];
                if (item instanceof TagBuilder) {
                    rendered.push(item.render(empty));
                } else {
                    rendered.push(item);
                }
            }
            return rendered;
        }

        // Concat a list together using the appropriate item separators
        function joinWithSeparators(content_array, separator, finalSeparator) {
            if (separator === finalSeparator) {
                return content_array.join(separator);
            }

            let formatted = "";

            for (let i = 0; i < content_array.length; i++) {
                formatted +=
                    (i === 0
                        ? ""
                        : i === content_array.length - 1
                        ? finalSeparator
                        : separator) + content_array[i];
            }
            return formatted;
        }

        const formattedPrefix = renderContent(this.prefix);
        const formattedSuffix = renderContent(this.suffix);
        const formattedChildren = renderContent(this.children);

        if (!this.renderContainer) {
            return formatOrEmpty(
                formattedPrefix.join("") + "{}" + formattedSuffix.join(""),
                joinWithSeparators(
                    formattedChildren,
                    this.separator,
                    this.finalSeparator
                )
            );
        }

        const formattedBefore = renderContent(this.before);
        const formattedAfter = renderContent(this.after);

        return (
            formatOrEmpty("{}", formattedBefore.join("")) +
            format("<{}", this.tagname) +
            formatOrEmpty(' id="{}"', this.id) +
            formatOrEmpty(' class="{}"', this.classes.join(" ")) +
            formatOrEmpty(' style="{}"', this.styles.join(";")) +
            this.getFormattedSpecialAttributes() + // Include tag-specific attributes like rel and href
            formatOrEmpty(" {}", this.attrs.join(" ")) +
            ">" +
            formatOrEmpty(
                formattedPrefix.join("") + "{}" + formattedSuffix.join(""),
                joinWithSeparators(
                    formattedChildren,
                    this.separator,
                    this.finalSeparator
                )
            ) +
            format("</{}>", this.tagname) +
            formatOrEmpty("{}", formattedAfter.join(""))
        );
    }
}

class DivBuilder extends TagBuilder {
    constructor(classname = null) {
        super("div", classname);
    }
}

class SpanBuilder extends TagBuilder {
    constructor(classname = null) {
        super("span", classname);
    }
}

class SvgBuilder extends TagBuilder {
    constructor(classname = null) {
        super("svg", classname);
        this.viewbox = "";
    }

    setIcon(iconId) {
        this.setViewbox(getSvgViewbox(iconId));
        this.addContent(getIcon(iconId, null, true));
        return this;
    }

    setViewbox(viewbox) {
        this.viewbox = viewbox;
        return this;
    }

    /**
     * @override
     */
    getFormattedSpecialAttributes() {
        return formatOrEmpty(' viewBox="{}"', this.viewbox);
    }
}

class ABuilder extends TagBuilder {
    constructor() {
        super("a");
        this.href = "";
        this.rel = "";
    }

    setHref(target) {
        this.href = target;
        return this;
    }

    setRel(rel) {
        this.rel = rel;
        return this;
    }

    /**
     * @override
     */
    getFormattedSpecialAttributes() {
        return (
            formatOrEmpty(' href="{}"', this.href) +
            formatOrEmpty(' rel="{}"', this.rel)
        );
    }
}

class Tooltip extends TagBuilder {
    constructor() {
        super("div");
        this.addClass("mdl-tooltip");
    }

    setFor(targetId) {
        this.for_id = targetId;
        return this;
    }

    /**
     * @override
     */
    getFormattedSpecialAttributes() {
        return formatOrEmpty(' for="{}"', this.for_id);
    }
}
