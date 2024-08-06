import React, { useId } from "react";
import { _ } from "ts/compat";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { AppConfig, PopupSection, useOptions } from "ts/options";
import "ts/entrypoint/options/options.scss";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { Loading } from "ts/ui/loading";
import { toggle } from "ts/data/util/arrays";

const Options = () => {
    const [options, setOptions] = useOptions();

    if (!options) return <Loading />;

    return (
        <main>
            <section>
                <MultipleChoice
                    title={_("options_popup_sections")}
                    values={Object.keys(PopupSection)}
                    selected={options.popupContents}
                    setSelected={it => {
                        setOptions({
                            ...options,
                            popupContents: it as PopupSection[],
                        });
                    }}
                />
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

const MultipleChoice = (props: {
    title: string;
    values: string[];
    selected: string[];
    setSelected: (selection: string[]) => void;
}) => {
    const { title, values, selected, setSelected } = props;
    return (
        <fieldset>
            <legend>{title}</legend>
            <Column>
                {values.map(value => {
                    const id = useId();
                    return (
                        <Row
                            key={value}
                            space={Space.Small}
                            vertical={Alignment.Baseline}
                        >
                            <input
                                id={id}
                                type="checkbox"
                                checked={selected.includes(value)}
                                onChange={ev =>
                                    setSelected(toggle(selected, value))
                                }
                            />
                            <label htmlFor={id}>{value}</label>
                        </Row>
                    );
                })}
            </Column>
        </fieldset>
    );
};

initEntrypointUi("options_title", "container", <Options />);
