import React, { useContext } from "react";
import { HEventData } from "ts/data/types/h-event";
import { Column, Row, Space } from "ts/ui/layout";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { _, _pluralize } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { NullablePropsOf } from "ts/ui/props";
import {
    CategoryPropertyRow,
    DetailSection,
    displayValueProperties,
    linkedValueProperties,
    EmbeddedHCardProperty,
    PropertyRow,
} from "ts/ui/microformats/common";
import {
    LocationPropertiesTable,
    LocationProperty,
} from "ts/ui/microformats/common/location";
import { HAdrData, isHAdrData } from "ts/data/types";
import { LocationData } from "ts/data/types/h-adr";
import { OptionsContext } from "ts/options";
import { DateTime } from "ts/ui/time";
import {
    formatDateTime,
    formatShortDateTime,
    formatTime,
    isDate,
    isSameDay,
} from "ts/ui/formatting/time";
import { Error } from "ts/ui/error";
import { Icons } from "ts/ui/icon";

interface HEventProps extends NullablePropsOf<HEventData> {}
export const HEvent = (props: HEventProps) => {
    const event = props.data;
    if (event == null) return null;

    return (
        <ExpandableCard
            microformat={Microformat.H.Event}
            bannerLayout="column"
            sharedContent={<Shared {...event} />}
            summaryContent={
                <PropertyRow
                    microformat={Microformat.P.Summary}
                    values={displayValueProperties(event.summary)}
                />
            }
            detailContent={<Detail {...event} />}
        />
    );
};

const Shared = (props: HEventData) => {
    const { name, url, location, category } = props;

    return (
        <Column space={Space.None}>
            <PropertyRow
                microformat={Microformat.P.Name}
                hrefMicroformat={Microformat.U.Url}
                values={linkedValueProperties(name, url)}
                renderString={node => <h1>{node}</h1>}
            />

            <Row wrap space={Space.Medium} className="event--meta">
                <LocationProperty
                    microformat={Microformat.P.Location}
                    locations={location}
                />

                <EventDatetime {...props} />

                <CategoryPropertyRow data={category} />
            </Row>
        </Column>
    );
};

const Detail = (props: HEventData) => {
    const options = useContext(OptionsContext);
    const { description, location, people } = props;

    return (
        <Column>
            <PropertyRow
                microformat={Microformat.P.Description}
                values={displayValueProperties(description)}
            />

            <DetailSection
                options={options}
                sectionTitle={_("hevent_location_detail")}
                dependsOn={location?.filter(isHAdrData)?.nullIfEmpty() ?? null}
                render={(data: HAdrData[]) => (
                    <>
                        {data.map(it => (
                            <LocationDetail location={it} />
                        ))}
                    </>
                )}
            />

            <DetailSection
                options={options}
                sectionTitle={_("hevent_people")}
                dependsOn={people}
                render={({ organizer, attendee }) => (
                    <>
                        <EmbeddedHCardProperty
                            icon={Icons.Person}
                            microformat={Microformat.X.Event.Organizer}
                            property={{
                                displayName: _pluralize(
                                    organizer,
                                    "hevent_organizer",
                                ),
                            }}
                            embeddedHCards={organizer}
                        />
                        <EmbeddedHCardProperty
                            icon={Icons.Person}
                            microformat={Microformat.X.Event.Attendee}
                            property={{
                                displayName: _pluralize(
                                    attendee,
                                    "hevent_attendee",
                                ),
                            }}
                            embeddedHCards={attendee}
                        />
                    </>
                )}
            />
        </Column>
    );
};

const LocationDetail = (props: { location: LocationData }) => {
    const { location } = props;
    if (isHAdrData(location))
        return <LocationPropertiesTable data={location} />;

    return (
        <Error
            message={`should only rendre HAdrData here, got ${JSON.stringify(location)}`}
        />
    );
};

const EventDatetime = (props: HEventData) => {
    const { dateStart, dateEnd, dateDuration } = props;

    if (isDate(dateStart) && isDate(dateEnd)) {
        // If event starts and ends on same day, only render the date once.
        const startFormatter = isSameDay(dateStart, dateEnd)
            ? formatTime
            : formatShortDateTime;
        return (
            <Row className="event--dates">
                <PropertyRow
                    className="event--dates-start"
                    microformat={Microformat.Dt.Start}
                    values={displayValueProperties([dateStart])}
                    renderDate={(it, title) => (
                        <DateTime
                            datetime={it}
                            title={title}
                            formatter={startFormatter}
                        />
                    )}
                />
                <PropertyRow
                    className="event--dates-end"
                    microformat={Microformat.Dt.End}
                    values={displayValueProperties([dateEnd])}
                    renderDate={(it, title) => (
                        <DateTime
                            datetime={it}
                            title={title}
                            formatter={formatDateTime}
                        />
                    )}
                />
                <PropertyRow
                    className="event--dates-duration"
                    microformat={Microformat.Dt.Duration}
                    values={dateDuration?.let((it: string) =>
                        displayValueProperties([it]),
                    )}
                />
            </Row>
        );
    }
};
