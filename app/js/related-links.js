function buildRelatedLinks(microformats) {
    let builder = new GroupBuilder(new DivBuilder({'classes': 'card'}), separator='');

    try {
        let rels = microformats['rels']['me'];
        rels.push(microformats['rels']['pgpkey']);

        let sortableLinks = [];
        for (let i = 0; i < rels.length; i++) {
            let link = rels[i];
            sortableLinks.push(new SortableLink(link));
        }

        sortableLinks.sort(function(a, b) {
            return a.domain.localeCompare(b.domain);
        });

        for (let i = 0; i < sortableLinks.length; i++) {
            let link = sortableLinks[i];
            let metadata = microformats['rel-urls'][link.url];

            let a = new DivBuilder({'classes': 'single-line'});
            if (getValueOr(metadata, 'rels', []).indexOf('pgpkey') >= 0) {
                a.prefix = getIcon('svg_icon_pgpkey', 'h-item-icon');
            }
            else {
                a.prefix = getIconForLink(link.url);
            }
            a.content = linkify(link.url, link.domain + link.path);
            let alt = getValueOr(metadata, 'text', getValueOr(metadata, ['title']));
            a.suffix = new SpanBuilder({'content': alt, 'prefix': ' (', 'suffix': ')'}).build('');
            builder.add(a);
        }
    }
    catch(e) {
        console.log('error building related links: ' + e);
    }

    builder.before(new DivBuilder({'content': getMessage('section_related_links'), 'classes': 'h-section-label'}));

    return builder.build(null);
}
class RelatedLinks {
    constructor(microformats) {
        this.rels = getValueOr(microformats, 'rels', {});
        this.relurls = getValueOr(microformats, 'rel-urls', {});
    }

    build() {
        const card = new DivBuilder('card');
        const links = getValueOr(this.rels, 'me', []);
        this.rels['pgpkey'] = getValueOr(this.rels, 'pgpkey', []);

        const sortableLinks = [];
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            sortableLinks.push(new SortableLink(link));
        }
        sortableLinks.sort(function(a, b) {
            return a.domain.localeCompare(b.domain);
        });

        for (let i = 0; i < sortableLinks.length; i++) {
            const link = sortableLinks[i];
            const metadata = this.relurls[link.url];

            const a = new DivBuilder('single-line');
            if (getValueOr(metadata, 'rels', []).indexOf('pgpkey') >= 0) {
                a.addPrefix('svg_icon_pgpkey', 'h-item-icon');
            }
            else {
                a.addPrefix(getIconForLink(link.url));
            }
            a.add(linkify(link.url, link.domain + link.path));
            const alt = getValueOr(metadata, 'text', getValueOr(metadata, ['title']));
            a.addSuffix(new SpanBuilder().add(alt).addPrefix(' (').addSuffix(')'));
            card.add(a);
        }

        card.addPrefix(new DivBuilder('h-section-label').add(getMessage('section_related_links')))

        return card;
    }
}

class SortableLink {
    constructor(url) {
        this.url = String(url);
        this.protocol = '';
        this.domain = '';
        this.path = '';

        this.parse();
    }

    parse() {
        let stub = this.url;
        let protocol = stub.match(/^(\w+):(\/\/)?(.*)/);
        if (protocol) {
            this.protocol = String(protocol[1]);
            stub = protocol[3];
        }

        let domain = stub.match(/^(www\.)?([^\/]*)(.*)?/);
        if (domain) {
            this.domain = String(domain[2]);
            this.path = String(getValueOr(domain, 3, ''));
        }

        console.log(this.asString());
    }

    asString() {
        return format('{}|{}|{}:{}', this.protocol, this.domain, this.path, this.url);
    }
}