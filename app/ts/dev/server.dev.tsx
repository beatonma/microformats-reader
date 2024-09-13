import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import React, { useEffect, useState } from "react";
import { PopupUI } from "ts/entrypoint/popup/popup";
import { Loading } from "ts/ui/loading";
import { parse, MicroformatData } from "ts/data/parsing";

const sourceUrl = "http://localhost:3000/";

const FakePopup = () => {
    const [microformats, setMicroformats] = useState<
        MicroformatData | null | undefined
    >(undefined);

    useEffect(() => {
        fetch(sourceUrl).then(async response => {
            const html = await response.text();
            setMicroformats(await parse(html, sourceUrl));
        });
    }, []);

    if (!microformats) return <Loading />;

    return <PopupUI {...microformats} />;
};

initEntrypointUi("extension_name", "container", <FakePopup />);
