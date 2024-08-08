import React, { useId } from "react";
import { _ } from "ts/compat";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { AppConfig, PopupSection, useOptions } from "ts/options";
import "ts/entrypoint/options/options.scss";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { Loading } from "ts/ui/loading";

const Options = () => {
    const [options, setOptions] = useOptions();

    if (!options) return <Loading />;

    return (
        <main>
            <section>
                <Column space={Space.Medium}>
                    <Checkbox
                        label={_("options_dropdown_expanded_by_default")}
                        checked={options.dropdownExpandByDefault}
                        onChange={checked =>
                            setOptions({
                                ...options,
                                dropdownExpandByDefault: checked,
                            })
                        }
                    />
                    <Checkbox
                        label={_("options_group_by_type")}
                        checked={options.groupByType}
                        onChange={checked =>
                            setOptions({ ...options, groupByType: checked })
                        }
                    />

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
                </Column>
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

const Checkbox = (props: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) => {
    const id = useId();
    const { label, checked, onChange } = props;
    return (
        <Row space={Space.Small} vertical={Alignment.Baseline}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={ev => onChange(ev.target.checked)}
            />
            <label htmlFor={id}>{label}</label>
        </Row>
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
                    return (
                        <Checkbox
                            label={value}
                            checked={selected.includes(value)}
                            onChange={checked =>
                                setSelected(
                                    checked
                                        ? [...selected, value]
                                        : selected.filter(it => it !== value),
                                )
                            }
                        />
                    );
                })}
            </Column>
        </fieldset>
    );
};

initEntrypointUi("options_title", "container", <Options />);
