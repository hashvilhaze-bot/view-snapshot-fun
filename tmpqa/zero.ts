import { runMatch, TIME_OPTIONS, PACE_OPTIONS } from "@/lib/match";
import { INTEREST_TAGS } from "@/lib/catalog";
let zero=0, one=0, tot=0; const ex:string[]=[];
for (const time of TIME_OPTIONS) for (const pace of PACE_OPTIONS) for (const i of INTEREST_TAGS) {
  const a={time,pace,interests:[i],fitness:"בכושר סביר",trekExperience:"כמה ימי הליכה"};
  const r=runMatch(a).results; tot++;
  if(r.length===0){zero++; if(ex.length<4)ex.push(`${time}/${pace}/${i}`);}
  if(r.length===1)one++;
  if(i!=="הרים וטרקים" && r.some(x=>x.item.kind==="trek")) ex.push(`LEAK ${time}/${pace}/${i}: ${r.filter(x=>x.item.kind==="trek").map(x=>x.item.name)}`);
}
console.log({tot,zero,one,ex:ex.slice(0,10)});
