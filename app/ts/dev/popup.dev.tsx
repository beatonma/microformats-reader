import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { mf2 } from "microformats-parser";
import { ParsedDocument } from "microformats-parser/dist/types";
// @ts-ignore
import SampleEmpty from "ts/dev/samples/empty.html";
// @ts-ignore
import SampleHCardFlat from "ts/dev/samples/h-card_flat.html";
// @ts-ignore
import SampleHCardSimple from "ts/dev/samples/h-card_simple.html";
// @ts-ignore
import SampleHFeed from "ts/dev/samples/h-feed.html";
// @ts-ignore
import SampleHFeedEmpty from "ts/dev/samples/h-feed_empty.html";
// @ts-ignore
import SampleHFeedImplied from "ts/dev/samples/h-feed_implied.html";
// @ts-ignore
import SampleHFeedNoProperties from "ts/dev/samples/h-feed_no-properties.html";
// @ts-ignore
import SampleHCardHFeed from "ts/dev/samples/sample_h-card_h-feed.html";
import { PopupUI, parseDocument } from "ts/entrypoint/popup";
import "./dev.scss";

const Samples = {
    empty: SampleEmpty,
    "h-card - simple": SampleHCardSimple,
    "h-card - flat": SampleHCardFlat,
    "h-feed": SampleHFeed,
    "h-feed - empty": SampleHFeedEmpty,
    "h-feed - implied": SampleHFeedImplied,
    "h-feed - no properties": SampleHFeedNoProperties,
    "Sample: h-card, h-feed": SampleHCardHFeed,
};

const PopupDev = () => {
    const [page, setPage] = useState<keyof typeof Samples>(
        "Sample: h-card, h-feed"
    );
    const [parsedDocument, setParsedDocument] = useState<ParsedDocument | null>(
        null
    );
    const microformats = parseDocument(parsedDocument);
    useEffect(() => {
        setParsedDocument(
            mf2(Samples[page], { baseUrl: "https://example.beatonma.org" })
        );
    }, [page]);

    if (!microformats) return null;

    return (
        <>
            <section className="dev">
                <select
                    value={page}
                    onChange={event =>
                        setPage(event.target.value as keyof typeof Samples)
                    }
                >
                    {Object.keys(Samples).map(name => (
                        <option value={name}>{name}</option>
                    ))}
                </select>
            </section>

            <PopupUI {...microformats} />
        </>
    );
};

const container = document?.getElementById("container.dev");
if (container) {
    const root = createRoot(container);
    root.render(<PopupDev />);
}
