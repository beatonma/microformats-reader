class HCard extends HObject {
    constructor(properties) {
        super(properties);
        this.svgIconId = "svg_icon_hcard";
        this.svgIconDescription = "card_type_hcard";
        this.factory = new HItemFactory(properties);
    }

    get() {
        const card = new DivBuilder("card h-card");

        card.addPrefix(this.getCardIcon(this.factory.get("name")))
            .add(this.getImages(this.factory))
            .add(this.getIdentity(this.factory))
            .add(this.getLinks(this.factory))
            .add(this.getAffiliations(this.factory))
            .add(this.getLocation(this.factory))
            .add(this.getNote(this.factory))
            .add(this.getOtherStuff(this.factory));

        return card;
    }

    getImages(factory) {
        const display = new DivBuilder("card-section hcard-image-container");
        let imageClass = "hcard-image primary";
        let photos = factory.get("photo");
        let logos = factory.get("logo");

        if (photos) {
            photos = photos[0];
        }
        if (logos) {
            logos = logos[0];
        }

        if (photos) {
            display.add(
                new DivBuilder(imageClass)
                    .addStyle(format("background-image:url('{}')", photos))
                    .allowEmpty()
            );
            imageClass = "hcard-image secondary";
        }
        if (logos && photos !== logos) {
            display.add(
                new DivBuilder(imageClass)
                    .addStyle(format("background-image:url('{}')", logos))
                    .allowEmpty()
            );
        }
        return display;
    }

    getIdentity(factory) {
        const display = new DivBuilder("card-section")
            .setSeparator(" ")
            .addPrefix(
                new DivBuilder("h-section-label").add(
                    getMessage("hcard_section_identity")
                )
            )
            .add(factory.make("span", "honorific-prefix"))
            .add(factory.make("span", "name"))
            .add(factory.make("span", "honorific-suffix"));

        const extended = new DivBuilder()
            .add(factory.make("div", "nickname", "hcard_identity_nickname"))
            .add(factory.make("div", "sex", "hcard_identity_sex"))
            .add(
                factory.make("div", "gender-identity", "hcard_identity_gender")
            );

        display.addSuffix(dropdown("identity_extended", extended));

        return display;
    }

    getLinks(factory) {
        const display = new DivBuilder("card-section")
            .add(
                new DivBuilder("h-section-label").add(
                    getMessage("hcard_section_links")
                )
            )
            .add(factory.make("div", "url", "svg_icon_link"))
            .add(factory.make("div", "email", "svg_icon_email"))
            .add(factory.make("div", "tel", "svg_icon_phone"));

        return display;
    }

    getLocation(factory) {
        const display = new DivBuilder("card-section")
            .setSeparator(", ")
            .addPrefix(
                new DivBuilder("h-section-label").add(
                    getMessage("hcard_section_location")
                )
            )
            .add(factory.make("span", "locality"))
            .add(factory.make("span", "region"))
            .add(factory.make("span", "country-name"));

        const extended = new DivBuilder()
            .add(factory.make("div", "extended-address"))
            .add(factory.make("div", "street-address"))
            .add(factory.make("div", "locality"))
            .add(factory.make("div", "region"))
            .add(factory.make("div", "country-name"))
            .add(factory.make("div", "postal-code"));

        const gmapsLink = format(
            '<a href="{}">{}</a>',
            getMapsUrl(
                [
                    factory.get("extended-address"),
                    factory.get("street-address"),
                    factory.get("locality"),
                    factory.get("region"),
                    factory.get("country-name"),
                    factory.get("postal-code"),
                ].join(" ")
            ),
            getMessage("link_show_gmap")
        );

        extended.addSuffix(new DivBuilder("h-section-label").add(gmapsLink));
        display.addSuffix(dropdown("location_extended", extended));

        return display;
    }

    getNote(factory) {
        const display = new DivBuilder("card-section")
            .addPrefix(
                new DivBuilder("h-section-label").add(
                    getMessage("hcard_section_note")
                )
            )
            .add(factory.make("div", "note"));

        return display;
    }

    getOtherStuff(factory) {
        const display = new DivBuilder("card-section").addPrefix(
            new SpanBuilder("h-section-label").add(
                getMessage("hcard_section_other")
            )
        );

        const extended = new DivBuilder();
        const date = factory.get("bday");
        const bday = factory
            .make("span", "bday", "svg_icon_cake")
            .addSuffix(
                new SpanBuilder().add(
                    format(
                        " ({} {})",
                        yearsSince(date),
                        getMessage("hcard_other_years_old")
                    )
                )
            );

        extended.add(bday);
        extended.add(
            new DivBuilder()
                .addPrefix(
                    new SpanBuilder("h-item-label").add(
                        format("{}: ", getMessage("hcard_other_publickey"))
                    )
                )
                .add(new TagBuilder("pre").add(factory.get("key")))
        );

        display.add(dropdown("other_extended", extended));
        return display;
    }

    getAffiliations(factory) {
        const display = new DivBuilder("card-section").addPrefix(
            new DivBuilder("h-section-label").add(
                getMessage("hcard_section_affiliation")
            )
        );

        const org = factory.get("org");
        if (org) {
            display.add(this.buildAffiliateHCards(org));
            display.add(this.buildSimpleAffiliate(factory));
        }

        return display;
    }

    // Build a collection of views to represent embedded h-cards
    buildAffiliateHCards(json_hcard_list) {
        const display = new DivBuilder("affiliate-hcards");
        for (let i = 0; i < json_hcard_list.length; i++) {
            const item = json_hcard_list[i];
            if (getValueOr(item, "type", "").indexOf("h-card") < 0) {
                continue;
            }

            const card = new DivBuilder("hcard-affiliate flex-horizontal");
            const factory = new HItemFactory(item["properties"]);

            const image = factory.choose(["logo", "photo"]);
            if (image) {
                card.add(
                    new DivBuilder("hcard-image affiliate " + image["classes"])
                        .allowEmpty()
                        .addStyle(
                            format(
                                "background-image:url('{}');",
                                image["value"]
                            )
                        )
                );
            } else {
                card.add(
                    new SvgBuilder("hcard-image affiliate").setIcon(
                        "svg_icon_work"
                    )
                );
            }

            const textContainer = new DivBuilder("hcard-affiliate-text");
            const jobTitle = factory.choose(["job-title", "role"]);
            const orgName = factory.make("span", "name");
            if (jobTitle) {
                textContainer.add(
                    new SpanBuilder()
                        .add(
                            new SpanBuilder(jobTitle.classes).add(
                                jobTitle.value
                            )
                        )
                        .addSuffix(
                            orgName
                                ? format(
                                      " {} ",
                                      getMessage(
                                          "role_at_organisation_preposition"
                                      )
                                  )
                                : ""
                        )
                );
            }

            textContainer
                .add(orgName)
                .add(factory.make("div", "url", "svg_icon_link"));
            card.add(textContainer);

            display.add(card);
        }
        return display;
    }

    // Build a view to represent a simple affiliation i.e. using 'role', 'job-title' properties, not embedded h-card
    buildSimpleAffiliate(factory) {
        if (typeof factory.get("org")[0] != "string") {
            return;
        }

        const card = new DivBuilder("hcard-affiliate flex-horizontal").add(
            new SvgBuilder("hcard-image affiliate icon").setIcon(
                "svg_icon_work"
            )
        );

        const textContainer = new DivBuilder("hcard-affiliate-text");
        const jobTitle = factory.choose(["job-title", "role"]);

        let orgName = factory.make("span", "org");
        if (jobTitle) {
            textContainer.add(
                new SpanBuilder()
                    .add(new SpanBuilder(jobTitle.classes).add(jobTitle.value))
                    .addSuffix(
                        orgName
                            ? format(
                                  " {} ",
                                  getMessage("role_at_organisation_preposition")
                              )
                            : ""
                    )
            );
        }
        textContainer.add(orgName);

        // Try to include both a job title and a description if both available
        if (jobTitle && jobTitle["key"] === "job-title") {
            textContainer.add(factory.make("div", "role"));
        }
        card.add(textContainer);
        return card;
    }
}
