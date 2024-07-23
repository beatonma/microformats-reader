import React from "react";
import { _ } from "ts/compat";
import { Todo } from "ts/dev";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { AppConfig } from "ts/options";
import "ts/entrypoint/options/options.scss";
import { Alignment, Row, Space } from "ts/ui/layout";

const Options = () => {
    return (
        <main>
            <section>
                <Todo message={"Options"} />
            </section>
            <Version />
        </main>
    );
};

const Version = () => {
    return (
        <section>
            <Row id="version" space={Space.Char} horizontal={Alignment.Center}>
                <span>{_("extension_version")}:</span>
                <code>{AppConfig.version}</code>
                &middot;
                <code>{AppConfig.versionDate}</code>
                &middot;
                <code>{AppConfig.versionDescription}</code>
            </Row>
        </section>
    );
};

initEntrypointUi("options_title", "container", <Options />);
