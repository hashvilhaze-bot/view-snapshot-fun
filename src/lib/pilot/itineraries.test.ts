import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { examples, validPilotSlug, parseStages, storageKey } from "./itineraries";
describe("pilot itinerary rules", () => {
  test("all eight real trek choices are supported", () => {
    assert.deepEqual(
      Object.keys(examples).sort(),
      [
        "annapurna-base-camp",
        "annapurna-circuit",
        "everest-base-camp",
        "langtang-valley",
        "manaslu-circuit",
        "mardi-himal",
        "pokhara-hills",
        "poon-hill",
      ].sort(),
    );
    for (const slug of Object.keys(examples)) assert.equal(validPilotSlug(slug), slug);
  });
  test("direct and invalid selection do not choose a trek", () => {
    assert.equal(validPilotSlug(undefined), undefined);
    assert.equal(validPilotSlug("not-a-trek"), undefined);
    assert.equal(validPilotSlug("__proto__"), undefined);
  });
  test("example walking days are distinct from transfers and acclimatization", () => {
    const e = examples["manaslu-circuit"];
    if (!e) throw new Error("missing Manaslu");
    assert.equal(e.stages.length, 12);
    assert.equal(e.stages.filter((s) => s.kind === "walk").length, 9);
    assert.equal(e.stages.filter((s) => s.kind === "transfer").length, 2);
  });
  test("no daily hours are invented where the ABC source has only distances", () => {
    const e = examples["annapurna-base-camp"];
    if (!e) throw new Error("missing ABC");
    assert.equal(e.stages.length, 7);
    assert.equal(
      e.stages.every((s) => s.time === ""),
      true,
    );
  });
  test("local edits remain isolated by slug and malformed saved data is rejected", () => {
    assert.notEqual(storageKey("poon-hill"), storageKey("manaslu-circuit"));
    assert.equal(parseStages('[{"id":"bad"}]'), undefined);
    const s = { id: "local-1", start: "א", end: "ב", kind: "walk", time: "", story: "דוגמה" };
    assert.equal(parseStages(JSON.stringify([s]))?.[0]?.end, "ב");
    assert.equal(parseStages(JSON.stringify([s, s])), undefined);
  });
});
