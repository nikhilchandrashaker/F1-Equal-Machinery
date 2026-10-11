// Season engine: runs a full championship using race_engine.js and calendar.json.
// Usage: node season_engine.js [races=24] [format=grid|all] [fieldSize=20] [seed=20261010] [variability=1]
const {race,rng,pickField,PTS,P}=require('./race_engine');
const CAL=require('./calendar.json').calendar;
function season(cfg,seed){
 const r=rng(seed),field=pickField(cfg,r),tot=new Map(field.map(d=>[d.id,{d,pts:0,w:0,p:0,pl:0,dnf:0}])),races=[];
 for(let i=0;i<cfg.nr;i++){
  const tr=CAL[i%CAL.length];let wet=tr.baseline_wetness;
  if(wet===0&&r()<.15)wet=.4;
  const rc=race(field,tr,wet,cfg.v,r,P.race_distance_laps);races.push(rc);
  tot.get(rc.pole.id).pl++;
  rc.res.forEach(x=>{const s=tot.get(x.d.id);if(x.pos<=10)s.pts+=PTS[x.pos-1];if(x.pos===1)s.w++;if(x.pos<=3)s.p++;if(x.dnf)s.dnf++});
 }
 const st=[...tot.values()].sort((a,b)=>b.pts-a.pts||b.w-a.w||b.p-a.p);
 return{st,races,field};
}

module.exports={season};
if(require.main===module){
 const [nr=24,fmt='grid',fs=20,seed=P.failure_random_seed,v=1]=process.argv.slice(2);
 const out=season({fmt,fs:+fs,sel:'rand',nr:+nr,v:+v},+seed);
 require('./export').write(out);
}
