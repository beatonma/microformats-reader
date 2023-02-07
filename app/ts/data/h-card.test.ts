import { describe, expect, test } from "@jest/globals";
import { mf2 } from "microformats-parser";
import { HCardData, parseHCards } from "./h-card";

const mf = (html: string) => mf2(html, { baseUrl: "http://sally.example.com" });

const firstHCard = async (html: string) =>
    parseHCards(mf(html)).then(data => data[0]);

// From example at https://microformats.org/wiki/h-card
const SampleHCardFlat = `
  <div class="h-card">
    <span class="p-name">Sally Ride</span>
    <span class="p-honorific-prefix">Dr.</span>
    <span class="p-given-name">Sally</span>
    <abbr class="p-additional-name">K.</abbr>
    <span class="p-family-name">Ride</span>
    <span class="p-honorific-suffix">Ph.D.</span>,
    <span class="p-nickname">sallykride</span> (IRC)
    <div class="p-org">Sally Ride Science</div>
    <img class="u-photo" src="http://example.com/sk.jpg"/>
    <a class="u-url" href="http://sally.example.com">w</a>,
    <a class="u-email" href="mailto:sally@example.com">e</a>
    <div class="p-tel">+1.818.555.1212</div>
    <div class="p-street-address">123 Main st.</div>
    <span class="p-locality">Los Angeles</span>,
    <abbr class="p-region" title="California">CA</abbr>,
    <span class="p-postal-code">91316</span>
    <div class="p-country-name">U.S.A</div>
    <div class="p-latitude">34.06648088793238</div>
    <div class="p-longitude">-118.22042689866892</div>
    <time class="dt-bday">1951-05-26</time> birthday
    <div class="p-category">physicist</div>
    <div class="p-note">First American woman in space.</div>
  </div>`;

const SampleHCardNested = `
  <div class="h-card">
    <span class="p-name">Sally Ride</span>
    <span class="p-honorific-prefix">Dr.</span>
    <span class="p-given-name">Sally</span>
    <abbr class="p-additional-name">K.</abbr>
    <span class="p-family-name">Ride</span>
    <span class="p-honorific-suffix">Ph.D.</span>,
    <span class="p-nickname">sallykride</span> (IRC)
    <div class="p-org h-card">
        <div class="p-name">Sally Ride Science</div>
        <a href="https://sallyridescience.com" class="u-url">sallyridescience.com</a>
    </div>
    <img class="u-photo" src="http://example.com/sk.jpg" alt="photo"/>
    <a class="u-url" href="http://sally.example.com">w</a>,
    <a class="u-email" href="mailto:sally@example.com">e</a>
    <div class="p-tel">+1.818.555.1212</div>
    <div class="p-street-address">123 Main st.</div>
    <span class="p-locality">Los Angeles</span>,
    <abbr class="p-region" title="California">CA</abbr>,
    <span class="p-postal-code">91316</span>
    <div class="p-country-name">U.S.A</div>
    <div class="p-geo">
      <div class="p-latitude">34.06648088793238</div>
      <div class="p-longitude">-118.22042689866892</div>
    </div>
    <time class="dt-bday">1951-05-26</time> birthday
    <div class="p-category">physicist</div>
    <div class="p-note">First American woman in space.</div>
  </div>`;

function testLocation(hcard: HCardData) {
    const location = hcard.location;

    expect(location.locality).toBe("Los Angeles");
    expect(location.region).toBe("California");
    expect(location.postalCode).toBe("91316");
    expect(location.countryName).toBe("U.S.A");
    expect(location.latitude).toBe("34.06648088793238");
    expect(location.longitude).toBe("-118.22042689866892");
}

describe("HCard parsing", () => {
    describe("Names", () => {
        test("Simple name", async () => {
            const html = '<div class="h-card">Sally Ride</div>';
            const hcard = await firstHCard(html);

            expect(hcard.name).toBe("Sally Ride");
        });

        test("Name detail", async () => {
            const hcard = await firstHCard(SampleHCardFlat);
            const nameDetail = hcard.nameDetail;

            expect(hcard.name).toBe("Sally Ride");
            expect(nameDetail.honorificPrefix).toBe("Dr.");
            expect(nameDetail.honorificSuffix).toBe("Ph.D.");
            expect(nameDetail.givenName).toBe("Sally");
            expect(nameDetail.additionalName).toBe("K.");
            expect(nameDetail.familyName).toBe("Ride");
            expect(nameDetail.nickname).toBe("sallykride");
        });
    });

    describe("Locations", () => {
        test("No location", async () => {
            const html = '<div class="h-card">Sally Ride</div>';
            const hcard = await firstHCard(html);

            expect(hcard.location).toBeNull();
        });

        test("Simple address", async () => {
            const html = `<div class="h-card"><div class="p-adr">My address</div>`;
            const hcard = await firstHCard(html);

            expect(hcard.location.value).toBe("My address");
        });

        test("Nested p-adr", async () => {
            const hcard = await firstHCard(SampleHCardNested);
            const location = hcard.location;

            expect(location.locality).toBe("Los Angeles");
            expect(location.region).toBe("California");
            expect(location.countryName).toBe("U.S.A");
            expect(location.postalCode).toBe("91316");
        });

        test("Address directly in h-card", async () => {
            const hcard = await firstHCard(SampleHCardFlat);

            testLocation(hcard);
        });

        test("Address with nested p-geo", async () => {
            const hcard = await firstHCard(SampleHCardNested);
            testLocation(hcard);
        });
    });

    describe("Organisation", () => {
        test("Simple name", async () => {
            const hcard = await firstHCard(SampleHCardFlat);

            expect(hcard.job.orgName).toBe("Sally Ride Science");
        });

        test("Nested h-card", async () => {
            const hcard = await firstHCard(SampleHCardNested);

            expect(hcard.job.orgName).toBe("Sally Ride Science");
            expect(hcard.job.orgHCard.name).toBe("Sally Ride Science");
            expect(hcard.job.orgHCard.contact.url).toBe(
                "https://sallyridescience.com"
            );
        });
    });
});
