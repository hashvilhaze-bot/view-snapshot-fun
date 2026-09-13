import { runMatch, PACE_OPTIONS, FITNESS_OPTIONS, EXPERIENCE_OPTIONS, TIME_OPTIONS, needsFitnessQuestion, needsTrekQuestion } from "../src/lib/match";
import { INTEREST_TAGS } from "../src/lib/catalog";
const subs:string[][]=[];
for(let m=1;m<(1<<INTEREST_TAGS.length);m++){const s=INTEREST_TAGS.filter((_,i)=>m&(1<<i));if(s.length<=3)subs.push([...s]);}
const zeros:any[]=[];
for(const time of TIME_OPTIONS) for(const pace of PACE_OPTIONS) for(const interests of subs){
  const fits = needsFitnessQuestion({interests} as any)?FITNESS_OPTIONS:[undefined];
  const exps = needsTrekQuestion({interests} as any)?EXPERIENCE_OPTIONS:[undefined];
  for(const fitness of fits as any) for(const trekExperience of exps as any){
    const a={time,pace,interests,fitness,trekExperience};
    if(runMatch(a).results.length===0) zeros.push(a);
  }
}
console.log("reachable zero-result combos:", zeros.length);
console.log(zeros.slice(0,3));
