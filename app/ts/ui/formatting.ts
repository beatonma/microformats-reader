import { _, compatBrowser } from "ts/compat";

export const formatLongDate = (date: string): string => {
    return new Date(date).toLocaleDateString(
        compatBrowser.i18n.getUILanguage(),
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
};

export const formatLatLong = (
    latitude?: string | null,
    longitude?: string | null
): string | null => {
    if (latitude == null || longitude == null) return null;

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    if (isNaN(lat) || isNaN(long)) {
        return `${latitude}, ${longitude}`;
    }

    let latDirection = "";
    if (lat > 0.0) latDirection = _("direction_cardinal_north");
    else if (lat < 0.0) latDirection = _("direction_cardinal_south");

    let longDirection = "";
    if (long > 0.0) longDirection = _("direction_cardinal_east");
    else if (long < 0.0) longDirection = _("direction_cardinal_west");

    const latString = `${latitude.replace(/[-+]/, "")}${latDirection}`;
    const longString = `${longitude.replace(/[-+]/, "")}${longDirection}`;

    return `${latString}, ${longString}`;
};

export const formatUri = (uri: string | null | undefined): string | null => {
    if (!uri) return null;

    return uri.replace(/^(https?|irc|mailto|tel):(\/\/)?/g, "");
};
