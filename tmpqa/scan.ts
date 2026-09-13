import { runMatch, PACE_OPTIONS, FITNESS_OPTIONS, EXPERIENCE_OPTIONS, TIME_OPTIONS } from "../src/lib/match";
import { INTEREST_TAGS } from "../src/lib/catalog";
let zero=0, one=0, tot=0, min=99;
const subsets:string[][]=[];
for(let m=1;m<(1<<INTEREST_TAGS.length);m++){const s=INTEREST_TAGS.filter((_,i)=>m&(1<<i));if(s.length<=3)subsets.push([...s]);}
for(const time of TIME_OPTIONS) for(const pace of PACE_OPTIONS) for(const interests of subsets) for(const fitness of FITNESS_OPTIONS) for(const trekExperience of EXPERIENCE_OPTIONS){
  const {results}=runMatch({time,pace,interests,fitness,trekExperience}); tot++;
  min=Math.min(min,results.length);
  if(results.length===0)zero++; if(results.length===1)one++;
}
console.log({tot,zero,one,minResults:min});
