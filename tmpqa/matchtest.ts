import { runMatch, scoreItem, needsFitnessQuestion, needsTrekQuestion, MATCH_THRESHOLD } from "../src/lib/match";
import { catalog } from "../src/lib/catalog";

const show = (label: string, a: any) => {
  const { results } = runMatch(a);
  console.log(label, "→", results.map(r => `${r.item.kind}:${r.item.slug}(${r.score.toFixed(2)})`).join(", ") || "NONE");
};

// 1 non-trek scenario
show("A relaxed culture, 2wk", { time: "שבועיים", pace: "רגוע", interests: ["תרבות וערים", "טבע רגוע ומנוחה"] });
// 2 short time blocks long trek
const long = catalog.filter(i => (i.totalDaysMin ?? 0) > 7).map(i => i.slug);
console.log("items >7 days:", long.join(","));
show("B short week + mountains", { time: "עד שבוע", pace: "מאתגר", interests: ["הרים וטרקים"], fitness: "בכושר טוב", trekExperience: "טרקים ארוכים" });
console.log("  any >7d in results?", runMatch({ time: "עד שבוע", pace: "מאתגר", interests: ["הרים וטרקים"], fitness: "בכושר טוב", trekExperience: "טרקים ארוכים" }).results.some(r => (r.item.totalDaysMin ?? 0) > 7));
// 3 single result over threshold?
show("C jungle only", { time: "עד שבוע", pace: "רגוע", interests: ["חיות וג׳ונגל"] });
show("D rafting only", { time: "עד שבוע", pace: "מאתגר", interests: ["מים ואדרנלין"], fitness: "בכושר טוב" });
// 4 zero results
show("E yoga+mountains conflicting w/ 1 day?", { time: "עד שבוע", pace: "רגוע", interests: ["הרים וטרקים"], fitness: "בכושר בסיסי", trekExperience: "אין כמעט" });
// conditional questions
console.log("needsFitness(culture)", needsFitnessQuestion({interests:["תרבות וערים"]}), "needsFitness(mountains)", needsFitnessQuestion({interests:["הרים וטרקים"]}), "needsFitness(rafting)", needsFitnessQuestion({interests:["מים ואדרנלין"]}));
console.log("needsTrek(rafting)", needsTrekQuestion({interests:["מים ואדרנלין"]}), "needsTrek(mountains)", needsTrekQuestion({interests:["הרים וטרקים"]}));
// normalisation: score bounded 0..1 with irrelevant params
const kat = catalog.find(i => i.slug === "kathmandu")!;
console.log("kathmandu w/ fitness+exp answered:", scoreItem(kat, {time:"שבועיים",pace:"רגוע",interests:["תרבות וערים"],fitness:"בכושר בסיסי",trekExperience:"אין כמעט"})?.score.toFixed(3));
console.log("kathmandu w/o them:", scoreItem(kat, {time:"שבועיים",pace:"רגוע",interests:["תרבות וערים"]})?.score.toFixed(3));
console.log("threshold", MATCH_THRESHOLD, "catalog size", catalog.length);
