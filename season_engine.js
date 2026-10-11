// Season engine: runs a championship with race_engine.js and calendar.json.
// Usage: node season_engine.js [races=24] [format=grid|all] [fieldSize=20] [seed=20261010] [variability=1]
const {race,rng,pickField,PTS,P}=require('./race_engine');
const CAL=require('./calendar.json').calendar;
function raceAt(field,i,cfg,seed,opt){
 const tr=CAL[i%CAL.length],rr=rng(((seed>>>0)+i*7919+1)>>>0);let wet=tr.baseline_wetness;
 if(wet===0&&rr()<.15)wet=.4;
 return race(field,tr,wet,cfg.v,rr,tr.laps,opt);
}
function season(cfg,seed,opt){
 const r=rng(seed),field=pickField(cfg,r),races=[];
 const tot=new Map(field.map(d=>[d.id,{d,pts:0,w:0,p:0,pl:0,dnf:0,fl:0,pits:0}]));
 for(let i=0;i<cfg.nr;i++){
  const rc=raceAt(field,i,cfg,seed,opt);races.push(rc);
  tot.get(rc.pole.id).pl++;tot.get(rc.fl.id).fl++;
  rc.res.forEach(x=>{const s=tot.get(x.d.id);if(x.pos<=10)s.pts+=PTS[x.pos-1];if(x.pos===1)s.w++;if(x.pos<=3)s.p++;if(x.dnf)s.dnf++;s.pits+=x.pits});
 }
 const st=[...tot.values()].sort((a,b)=>b.pts-a.pts||b.w-a.w||b.p-a.p);
 return{st,races,field};
}
module.exports={season,raceAt,CAL};
if(require.main===module){
 const [nr=24,fmt='grid',fs=20,seed=P.failure_random_seed,v=1]=process.argv.slice(2);
 require('./export').write(season({fmt,fs:+fs,sel:'rand',nr:+nr,v:+v},+seed));
}
