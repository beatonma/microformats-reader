chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getMicroformats"}, function(response) {
        render(response);
    });
});

function render(response) {
    const microformats = response.microformats;
    const webmentionEndpoint = response.webmentionEndpoint;

    const contentContainer = document.querySelector('#content');

    let webmention = '';
    if (webmentionEndpoint) {
        webmention = new DivBuilder('card').add(new ABuilder().setHref(webmentionEndpoint).add(getMessage('webmentions_supported')));
    }

    if (microformats == '') {
        contentContainer.innerHTML = format('{}{}', webmention, new DivBuilder('card').add(new DivBuilder('card_content').add(getMessage('nothing_to_show'))).render());
        return;
    }

    let hCards =
        new DivBuilder('h-card-container');

    let hEntries =
        new DivBuilder('card h-entry-container')
            .addPrefix(
                getCardIcon(
                    'hentries_card',
                    'svg_icon_hentry',
                    'card_type_hentry',
                    getMessage('section_hentries')
            ));

    if (microformats.items) {
        for (let i = 0; i < microformats.items.length; i++) {
            const item = microformats.items[i];
            if (item.type.indexOf('h-card') >= 0) {
                hCards.addContent(new HCard(item.properties).get());
            }
            if (item.type.indexOf('h-entry') >= 0) {
                hEntries.addContent(new HEntry(item.properties).get());
            }
        }
    }

    const relmeLinks = new RelatedLinks(microformats).build();

    contentContainer.innerHTML = (
        webmention.render()
        + hCards.render()
        + hEntries.render()
        + relmeLinks.render()
    );

    updateEventListeners();
}

function updateEventListeners() {
    // Find dropdown content and make them usable
    setupDropdownListeners();

    // Make links in the popup left-clickable
    const links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.addEventListener('click', function(event) {
            event.preventDefault();
            chrome.tabs.create({url: this.href});
            return false;
        });
    }


    try {
        // Notify mdl scripts that the DOM has changed (so that stuff like tooltips will work)
        componentHandler.upgradeDom();
    }
    catch(e) {}
}