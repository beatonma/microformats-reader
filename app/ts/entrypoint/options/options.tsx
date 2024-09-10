import React, { useId } from "react";
import { _ } from "ts/compat";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { AppConfig, AppOptions, defaultOptions, useOptions } from "ts/options";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { Loading } from "ts/ui/loading";
import "./options.scss";

const Options = () => {
    const [options, setOptions] = useOptions();
    const defaults = defaultOptions();

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
                        label={_("options_card_expanded_by_default")}
                        checked={options.cardExpandByDefault}
                        onChange={checked =>
                            setOptions({
                                ...options,
                                cardExpandByDefault: checked,
                            })
                        }
                    />

                    <MultipleChoice
                        title={_("options_popup_sections")}
                        values={{
                            ...defaults.popupContents,
                            ...options.popupContents,
                        }}
                        setSelected={it =>
                            setOptions({
                                ...options,
                                popupContents: it,
                            })
                        }
                    />

                    <SingleChoice
                        title={_("options_maps_provider")}
                        values={Object.values(AppOptions.MapProvider)}
                        selected={options.mapsProvider.apiName}
                        setSelected={selected => {
                            const value = Object.values(
                                AppOptions.MapProvider,
                            ).find(value => selected === value.apiName);

                            if (!value)
                                throw `Failed to update option from value '${selected}'`;

                            setOptions({
                                ...options,
                                mapsProvider: value,
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

interface InputProps {
    label: string;
    title?: string;
}
interface BooleanInputValue {
    uiName: string;
    apiName: string;
}
interface BooleanInputProps extends InputProps {
    group?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}
const BooleanInput = (
    props: {
        type: "checkbox" | "radio";
    } & BooleanInputProps,
) => {
    const id = useId();
    const { type, group, label, title, checked, onChange } = props;
    return (
        <Row space={Space.Small} vertical={Alignment.Baseline} title={title}>
            <input
                name={group}
                id={id}
                type={type}
                checked={checked}
                onChange={ev => onChange(ev.target.checked)}
            />
            <label htmlFor={id}>{label}</label>
        </Row>
    );
};
const Checkbox = (props: BooleanInputProps) => (
    <BooleanInput type="checkbox" {...props} />
);

const RadioButton = (props: BooleanInputProps) => (
    <BooleanInput type="radio" {...props} />
);

const MultipleChoice = (props: {
    title: string;
    values: Record<string, boolean>;
    setSelected: (selection: Record<string, boolean>) => void;
}) => {
    const { title, values, setSelected } = props;
    const groupName = useId();

    return (
        <fieldset>
            <legend>{title}</legend>
            <Column>
                {Object.entries(values).map(([key, value]) => (
                    <Checkbox
                        group={groupName}
                        key={key}
                        label={key}
                        checked={value}
                        onChange={checked => {
                            setSelected({ ...values, [key]: checked });
                        }}
                    />
                ))}
            </Column>
        </fieldset>
    );
};

const SingleChoice = (props: {
    title: string;
    values: BooleanInputValue[];
    selected: string;
    setSelected: (selection: string) => void;
}) => {
    const { title, values, selected, setSelected } = props;
    const groupName = useId();
    return (
        <fieldset>
            <legend>{title}</legend>
            <Column>
                {values.map(value => (
                    <RadioButton
                        group={groupName}
                        key={value.apiName}
                        label={value.uiName}
                        checked={selected === value.apiName}
                        onChange={() => setSelected(value.apiName)}
                    />
                ))}
            </Column>
        </fieldset>
    );
};

initEntrypointUi("options_title", "container", <Options />);
