class HEntry extends HObject {
    constructor(properties) {
        super(properties);
        this.svgIconId = 'svg_icon_hentry';
        this.svgIconDescription = 'card_type_hentry';
        this.factory = new HItemFactory(properties);
    }

    get() {
        const card = new DivBuilder();

        card.addChild(this.getHeader(this.factory));

        return card;
    }

    getHeader(factory) {
        const entryTitle = factory.get('name');

        const display = new DivBuilder().addClass('card-section hentry-header');
        const firstLine =
            new DivBuilder()
                .addClass('flex-box-row')
                .addContent(
                    new SpanBuilder()
                        .addClass('p-name hentry-title')
                        .addContent(
                            new ABuilder()
                                    .setHref(factory.get('url'))
                                    .addContent(entryTitle)))
                .addContent(
                    new DivBuilder()
                        .allowEmpty()
                        .addClass('mdl-layout-spacer'));

        const datePublished = factory.get('published');
        const dateUpdated = factory.get('updated');

        if (datePublished || dateUpdated) {
            const dates =
                new DivBuilder()
                    .addClass('hentry-dates');

            const idRoot = makeHtmlId(entryTitle) + Math.round(Math.random() * 1000) + '_';
            const idPublished = idRoot + 'published';
            const idUpdated = idRoot + 'updated';

            if (datePublished) {
                dates.add(
                    new SvgBuilder()
                        .setId(idPublished)
                        .setIcon('svg_icon_published')
                        .addClass('h-item-icon inline')
                        .addSuffix(
                            new Tooltip()
                                    .setFor(idPublished)
                                    .add(format('{}: {}', getMessage('hentry_published'), datePublished))
                        )
                );
            }

            if (dateUpdated) {
                dates.add(
                    new SvgBuilder()
                        .setId(idUpdated)
                        .setIcon('svg_icon_updated')
                        .addClass('h-item-icon inline')
                        .addSuffix(
                            new Tooltip()
                                    .setFor(idUpdated)
                                    .add(format('{}: {}', getMessage('hentry_updated'), dateUpdated))
                        )
                );
            }
            firstLine.add(dates);
        }

        display.add(firstLine);

        const subLine = new DivBuilder().addClass('flex-box-row hentry-subtitle');
        subLine.add(factory.make('span', 'author').addClass('hentry-author'));

        const category_template =
            new SpanBuilder()
                    .addPrefix('#')
                    .addClass('hentry-category');

        subLine.add(
            factory
                    .make('span', 'category', null, category_template)
                    .addPrefix(new SpanBuilder().add(' - '))
                    .setSeparator(', ')
                    .render('', true)); // Render children only - discard parent wrapper
        display.add(subLine);

        return display;
    }
}