import { formatLongDate } from "../../../formatting";
import React from "react";
import { _ } from "../../../compat/compat";

interface BirthdayProps {
    birthday: string;
}

export function Birthday(props: BirthdayProps) {
    const { birthday } = props;
    if (!birthday) return null;

    return (
        <span className="dt-birthday">
            <time dateTime={birthday}>{formatLongDate(birthday)}</time>{" "}
            <Age birthday={birthday} />
        </span>
    );
}

function Age(props: BirthdayProps) {
    const { birthday } = props;
    const age = yearsSince(birthday);
    if (!age) return null;
    const ageMessage = _("hcard_age", age.toString());
    return <span>{`(${ageMessage})`}</span>;
}

// Calculate the age of someone given their birthday in yyyy-mm-dd format
function yearsSince(date: string): number | null {
    try {
        const then = new Date(date);
        const now = new Date();

        const diffMillis = now.getTime() - then.getTime();
        const years = diffMillis / (1000 * 60 * 60 * 24 * 365);
        return Math.floor(years);
    } catch (e) {
        console.error('could not parse date "' + date + '": ' + e);
        return null;
    }
}
