import React, { useEffect, useState } from "react";
import { mf2 } from "microformats-parser";
import { ParsedDocument } from "@microformats-parser";
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
import { parseDocument } from "ts/entrypoint/content-script";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { Popup, PopupProps, PopupUI } from "ts/entrypoint/popup/popup";
import { copyToClipboard } from "ts/ui/actions/clipboard";
import { Row } from "ts/ui/layout";
import { Loading } from "ts/ui/loading";
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

interface DebugUIProps {
    microformats: PopupProps | null;
    parsedDocument: ParsedDocument | null;
    setParsedDocument: (data: ParsedDocument) => void;
    onHide: () => void;
}
const DebugUI = (props: DebugUIProps) => {
    const [page, setPage] = useState<keyof typeof Samples>(
        "Sample: h-card, h-feed",
    );
    useEffect(() => {
        props.setParsedDocument(
            mf2(Samples[page], { baseUrl: "https://example.beatonma.org" }),
        );
    }, [page]);

    return (
        <section className="dev">
            <Row>
                <select
                    value={page}
                    onChange={event =>
                        setPage(event.target.value as keyof typeof Samples)
                    }
                >
                    {Object.keys(Samples).map(name => (
                        <option value={name} key={name}>
                            {name}
                        </option>
                    ))}
                </select>

                <button onClick={() => copyToClipboard(props.parsedDocument)}>
                    Copy ParsedDocument
                </button>

                <button onClick={() => copyToClipboard(props.microformats)}>
                    Copy result
                </button>

                <button onClick={props.onHide}>x</button>
            </Row>
        </section>
    );
};

const PopupDev = () => {
    const [showSamples, setShowSamples] = useState(true);
    const [parsedDocument, setParsedDocument] = useState<ParsedDocument | null>(
        null,
    );
    const [microformats, setMicroformats] = useState<PopupProps | null>(null);

    useEffect(() => {
        if (parsedDocument) {
            parseDocument(parsedDocument).then(setMicroformats);
        }
    }, [parsedDocument]);

    if (!showSamples) {
        return <Popup />;
    }

    return (
        <>
            <DebugUI
                microformats={microformats}
                parsedDocument={parsedDocument}
                setParsedDocument={setParsedDocument}
                onHide={() => setShowSamples(false)}
            />

            {microformats ? <PopupUI {...microformats} /> : <Loading />}
        </>
    );
};

initEntrypointUi("extension_name", "container", <PopupDev />);
