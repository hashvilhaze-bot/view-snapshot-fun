import { runMatch, PACE_OPTIONS, FITNESS_OPTIONS, EXPERIENCE_OPTIONS, TIME_OPTIONS } from "../src/lib/match";
import { INTEREST_TAGS } from "../src/lib/catalog";
const out:any[]=[];
for(const time of TIME_OPTIONS) for(const pace of PACE_OPTIONS) for(const tag of INTEREST_TAGS) for(const fitness of [undefined,...FITNESS_OPTIONS] as any) for(const trekExperience of [undefined,...EXPERIENCE_OPTIONS] as any){
  const a={time,pace,interests:[tag],fitness,trekExperience};
  const n=runMatch(a).results.length;
  if(n===0||n===1) out.push({n,...a});
}
console.log(out.filter(o=>o.n===0).slice(0,6));
console.log(out.filter(o=>o.n===1).slice(0,6));
