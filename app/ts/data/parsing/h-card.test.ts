import { describe, expect, test } from "@jest/globals";
import { HCardData } from "ts/data/types";
import { parseTestHtml } from "ts/test";

const firstHCard = async (html: string) =>
    parseTestHtml(html).then(data => data.hcards?.[0] ?? null);

const makeHCard = async (content: string, name: string = "Sally Ride") =>
    firstHCard(
        `<div class="h-card"><div class="p-name">${name}</div>${content}</div>`,
    );

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
    <img class="u-photo" src="https://example.com/sk.jpg" alt=""/>
    <a class="u-url" href="https://sally.example.com">w</a>,
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
    <img class="u-photo" src="https://example.com/sk.jpg" alt="photo"/>
    <a class="u-url" href="https://sally.example.com">w</a>,
    <a class="u-email" href="mailto:sally@example.com">e</a>
    <div class="p-tel">+1.818.555.1212</div>
    <div class="p-street-address">123 Main st.</div> 
    <span class="p-locality">Los Angeles</span>,
    <abbr class="p-region" title="California">CA</abbr>,
    <span class="p-postal-code">91316</span>
    <div class="p-country-name">U.S.A</div>
    <div class="p-geo h-geo">
      <div class="p-latitude">34.06648088793238</div>
      <div class="p-longitude">-118.22042689866892</div>
    </div>
    <time class="dt-bday">1951-05-26</time> birthday
    <div class="p-category">physicist</div>
    <div class="p-note">First American woman in space.</div>
  </div>`;

describe("HCard parsing", () => {
    test("Empty h-card yields null", async () => {
        const html = "<div>Sally Ride</div>";
        const hcard = await firstHCard(html);

        expect(hcard).toBeNull();
    });

    describe("Names", () => {
        test("Simple name", async () => {
            const html = '<div class="h-card">Sally Ride</div>';
            const hcard = await firstHCard(html);

            expect(hcard?.name).toEqual(["Sally Ride"]);
        });

        test("Name detail", async () => {
            const hcard = await firstHCard(SampleHCardFlat);
            const nameDetail = hcard!.nameDetail!;

            expect(hcard?.name).toEqual(["Sally Ride"]);
            expect(nameDetail.honorificPrefix).toEqual(["Dr."]);
            expect(nameDetail.honorificSuffix).toEqual(["Ph.D."]);
            expect(nameDetail.givenName).toEqual(["Sally"]);
            expect(nameDetail.additionalName).toEqual(["K."]);
            expect(nameDetail.familyName).toEqual(["Ride"]);
            expect(nameDetail.nickname).toEqual(["sallykride"]);
        });
    });

    describe("Locations", () => {
        const testLocation = (hcard: HCardData | null) => {
            const location = hcard!.location![0];

            expect(location.locality).toEqual(["Los Angeles"]);
            expect(location.region).toEqual(["California"]);
            expect(location.postalCode).toEqual(["91316"]);
            expect(location.countryName).toEqual(["U.S.A"]);
            expect(location.latitude).toBe("34.06648088793238");
            expect(location.longitude).toBe("-118.22042689866892");
        };

        test("No location", async () => {
            const html = '<div class="h-card">Sally Ride</div>';
            const hcard = await firstHCard(html);

            expect(hcard?.location).toBeNull();
        });

        test("Simple address", async () => {
            const html = `<div class="h-card"><div class="p-adr">My address</div></div>`;
            const hcard = await firstHCard(html);

            expect(hcard!.location![0].value).toBe("My address");
        });

        test("Nested p-adr", async () => {
            const hcard = await firstHCard(`<div class="h-card">
<div class="p-adr h-adr">
    <div class="p-street-address">123 Main st.</div>
    <span class="p-locality">Los Angeles</span>,
    <abbr class="p-region" title="California">CA</abbr>,
    <span class="p-postal-code">91316</span>
    <div class="p-country-name">U.S.A</div>
</div>
</div>`);
            const location = hcard!.location![0];

            expect(location.locality).toEqual(["Los Angeles"]);
            expect(location.region).toEqual(["California"]);
            expect(location.countryName).toEqual(["U.S.A"]);
            expect(location.postalCode).toEqual(["91316"]);
        });

        test("Address directly in h-card", async () => {
            const hcard = await firstHCard(SampleHCardFlat);

            testLocation(hcard);
        });

        test("Address with nested p-geo", async () => {
            const hcard = await firstHCard(SampleHCardNested);
            expect(hcard?.location?.[0]?.latitude).toBe("34.06648088793238");
            expect(hcard?.location?.[0]?.longitude).toBe("-118.22042689866892");
        });
    });

    describe("Organisation", () => {
        test("Simple name", async () => {
            const hcard = await firstHCard(SampleHCardFlat);

            expect(hcard?.job?.organisation?.[0]?.name).toEqual([
                "Sally Ride Science",
            ]);
        });

        test("Nested h-card", async () => {
            const hcard = await firstHCard(SampleHCardNested);
            const org = hcard!.job!.organisation![0];

            expect(org.name).toEqual(["Sally Ride Science"]);
            expect(org.hcard?.name).toEqual(["Sally Ride Science"]);
            expect(org.hcard?.contact?.url).toEqual([
                "https://sallyridescience.com",
            ]);
        });
    });

    describe("Pronouns", () => {
        // Examples from https://microformats.org/wiki/pronouns-brainstorming
        test("Not available", async () => {
            const hcard = await firstHCard(SampleHCardFlat);

            expect(hcard?.gender).toBeNull();
        });

        test("x-pronoun-___", async () => {
            const hcard = await makeHCard(`
                <span class="p-x-pronoun-nominative">she</span>
                <span class="p-x-pronoun-oblique">her</span>
                <span class="p-x-pronoun-possessive">hers</span>`);

            expect(hcard?.gender?.pronouns).toEqual(["she", "her", "hers"]);
        });

        test("pronoun-___", async () => {
            const hcard = await makeHCard(`
                <span class="p-pronoun-nominative">she</span>
                <span class="p-pronoun-oblique">her</span>
                <span class="p-pronoun-possessive">hers</span>`);

            expect(hcard?.gender?.pronouns).toEqual(["she", "her", "hers"]);
        });

        test("u-pronoun", async () => {
            const hcard = await makeHCard(`<p>
              I use male pronouns (
              <a href="https://nl.wiktionary.org/wiki/hij#Persoonlijk_voornaamwoord" lang="nl" class="u-pronoun">hij</a>,
              <a href="https://sv.wiktionary.org/wiki/han#Pronomen" lang="sv" class="u-pronoun">han</a>,
              <a href="https://en.wiktionary.org/wiki/he#Pronoun" class="u-pronoun">he</a>,
              <a href="https://de.wiktionary.org/wiki/er#Personalpronomen" lang="de" class="u-pronoun">er</a>
              ) but also accept gender-neutral pronouns (
              <a href="https://sv.wiktionary.org/wiki/hen#Pronomen" lang="sv" class="u-pronoun">hen</a>,
              <a href="https://en.wiktionary.org/wiki/they#Pronoun" class="u-pronoun">they</a>
              ). If you are writing about me and are in doubt: ask.
            </p>`);

            expect(hcard?.gender?.pronouns).toEqual([
                "https://nl.wiktionary.org/wiki/hij#Persoonlijk_voornaamwoord",
                "https://sv.wiktionary.org/wiki/han#Pronomen",
                "https://en.wiktionary.org/wiki/he#Pronoun",
                "https://de.wiktionary.org/wiki/er#Personalpronomen",
                "https://sv.wiktionary.org/wiki/hen#Pronomen",
                "https://en.wiktionary.org/wiki/they#Pronoun",
            ]);
        });
    });
});
