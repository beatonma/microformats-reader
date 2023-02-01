import { compatBrowser } from "./compat";
import { _ } from "./compat/compat";

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
    latitude?: string,
    longitude?: string
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
