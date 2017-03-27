chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getMicroformats"}, function(response) {
        render(response);
    });
});

function render(response) {
    const microformats = response.microformats;
    const webmention_endpoint = response.webmention_endpoint;

    let webmention = '';
    if (webmention_endpoint) {
        webmention = new DivBuilder('card').add(new ABuilder().setHref(webmention_endpoint).add(getMessage('webmentions_supported')));
    }

    if (microformats == '') {
        renderEmpty(webmention);
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




    // let relmeLinks = buildRelatedLinks(microformats);
    const relmeLinks = new RelatedLinks(microformats).build();
    console.log(relmeLinks.render('no related links!'));

    $('#content').html('')
        .append(webmention.render(null))
        .append(hCards.render(null))
        .append(hEntries.render(null))
        .append(relmeLinks.render(null));
    $('#content').append('<div class="card"><pre>' + JSON.stringify(microformats, null, 4) + '</pre></div>');

    updateEventListeners();
}

function renderEmpty(prefix) {
    $('#content').html('').append(prefix).append('<div class="card"><div class="card_content">No microformats found.</div></div>');
}

function updateEventListeners() {
    // Find dropdown content and make them usable
    setupDropdownListeners();

    // Make links in the popup left-clickable
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });

    try {
        // Notify mdl scripts that the DOM has changed (so that stuff like tooltips will work)
        componentHandler.upgradeDom();
    }
    catch(e) {}
}