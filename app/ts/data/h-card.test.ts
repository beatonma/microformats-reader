import { describe, expect, test } from "@jest/globals";
import { HCardData, parseHCards } from "./h-card";
import { mf2 } from "microformats-parser";

const mf = (html: string) => {
    const _mf = mf2(html, { baseUrl: "http://sally.example.com" });
    console.log(`_mf: ${JSON.stringify(_mf, null, 2)}`);
    return _mf;
};

const firstHCard = (html: string) => parseHCards(mf(html))[0];

// From example at https://microformats.org/wiki/h-card
const SampleFlatHCard = `
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

const SampleHCardNestedGeo = `
  <div class="h-card">
    <span class="p-name">Sally Ride</span>
    <span class="p-honorific-prefix">Dr.</span>
    <span class="p-given-name">Sally</span>
    <abbr class="p-additional-name">K.</abbr>
    <span class="p-family-name">Ride</span>
    <span class="p-honorific-suffix">Ph.D.</span>,
    <span class="p-nickname">sallykride</span> (IRC)
    <div class="p-org">Sally Ride Science</div>
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
        test("Simple name", () => {
            const html = '<div class="h-card">Sally Ride</div>';
            const hcard = firstHCard(html);

            expect(hcard.name).toBe("Sally Ride");
        });

        test("Name detail", () => {
            const hcard = firstHCard(SampleFlatHCard);
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
        test("No location", () => {
            const html = '<div class="h-card">Sally Ride</div>';
            const hcard = firstHCard(html);

            expect(hcard.location).toBeNull();
        });

        test("Simple address", () => {
            const html = `<div class="h-card"><div class="p-adr">My address</div>`;
            const hcard = firstHCard(html);

            expect(hcard.location.value).toBe("My address");
        });

        test("Nested p-adr", () => {
            const html = `
                  <div class="h-card">
                    <div class="p-adr h-adr">
                      <span class="p-locality">Los Angeles</span> |
                      <span class="p-region">California</span> |
                      <span class="p-country-name">U.S.A</span> |
                      <span class="p-postal-code">91316</span>
                    </div>
                  </div>`;

            const hcard = firstHCard(html);
            const location = hcard.location;

            expect(location.locality).toBe("Los Angeles");
            expect(location.region).toBe("California");
            expect(location.countryName).toBe("U.S.A");
            expect(location.postalCode).toBe("91316");
        });

        test("Address directly in h-card", () => {
            const hcard = firstHCard(SampleFlatHCard);

            testLocation(hcard);
        });

        test("Address with nested p-geo", () => {
            const hcard = firstHCard(SampleHCardNestedGeo);
            testLocation(hcard);
        });
    });

    test("Complex h-card", () => {
        const html = `
              <div class="h-card">
                Some miscellaneous text with <span class="p-name">Sally Ride</span>
                and a <a href="https://beatonma.org" class="u-url">Homepage</a> and a <time class="dt-bday" datetime="1987-05-16">birthday</time>
                and a place like <div class="p-adr h-adr">
                  <span class="p-locality">Los Angeles</span> |
                  <span class="p-region">California</span> |
                  <span class="p-country-name">U.S.A</span> |
                  <span class="p-postal-code">91316</span>
                </div>
                <img loading="lazy" class="u-photo" src="http://example.com/sk.jpg" alt="Photo of Sally Ride" />
              </div>`;

        const hcard = firstHCard(html);
        const location = hcard.location;

        expect(hcard.name).toBe("Sally Ride");
        expect(hcard.url).toBe("https://beatonma.org");
        expect(hcard.birthday).toBe("1987-05-16");

        expect(location.locality).toBe("Los Angeles");
        expect(location.region).toBe("California");
        expect(location.countryName).toBe("U.S.A");

        expect(hcard.photo.value).toBe("http://example.com/sk.jpg");
        expect(hcard.photo.alt).toBe("Photo of Sally Ride");
    });
});
