// Repeated-season experiments. Usage: node run_multi.js [seasons=100]
const fs=require('fs');const {season}=require('./season_engine');const {D,P}=require('./race_engine');
const N=+(process.argv[2]||100),B=P.failure_random_seed;
const best=f=>f.slice().sort((p,q)=>q.r-p.r)[0].id;
function run(c,n,opt,keep){let ent=0,mech=0,inc=0,sc=0,races=0,hit=0,titles=new Map(),pts=new Map(D.map(d=>[d.id,[0,0]])),wetW=[],dryW=[],ssc=[];
 for(let i=0;i<n;i++){const s=season(c,B+i*101,opt);
  s.races.forEach(r=>{races++;sc+=r.sc;const w=r.res[0].d;(r.wet>0?wetW:dryW).push(w.w-w.r);r.res.forEach(x=>{ent++;if(x.dnf===1)mech++;if(x.dnf===2)inc++})});
  if(s.st[0].d.id===best(s.field))hit++;
  const t=s.st[0].d;titles.set(t.id,(titles.get(t.id)||0)+1);
  s.st.forEach(x=>{const a=pts.get(x.d.id);a[0]+=x.pts;a[1]++});}
 const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
 const o={seasons:n,hit_rate:+(hit/n).toFixed(3),dnf_pct:+((mech+inc)/ent*100).toFixed(2),mech_pct_of_starts:+(mech/ent*100).toFixed(2),incident_pct_of_starts:+(inc/ent*100).toFixed(2),safety_cars_per_race:+(sc/races).toFixed(2),distinct_champions:titles.size,wet_winner_w_minus_r:+mean(wetW).toFixed(2),dry_winner_w_minus_r:+mean(dryW).toFixed(2),wet_races:wetW.length};
 if(keep){o._titles=titles;o._pts=pts}return o}
const g=(extra)=>Object.assign({fmt:'grid',fs:20,sel:'rand',nr:24,v:1},extra||{});
const out={generated_for:'EM-SIM engine v2',base_seed:B,seasons_per_config:N,configs:{}};
const A=run(g(),N);out.configs.grid20_random=A;
out.configs.grid20_top_rated=run(g({sel:'top'}),N);
const C=run({fmt:'all',fs:214,sel:'rand',nr:24,v:1},N,null,true);
const titles=C._titles,pts=C._pts;delete C._titles;delete C._pts;out.configs.all214=C;
out.variability_sweep={};for(const v of [.5,1,1.8])out.variability_sweep[v]=run(g({v}),N).hit_rate;
out.ablation={};const ab=[['full',{}],['no_safety_cars',{sc:false}],['no_pit_stops',{pits:false,sc:false}]];
for(const [k,o] of ab){const r=run(g(),2*N,o);out.ablation[k]={hit_rate:r.hit_rate,dnf_pct:r.dnf_pct,sc_per_race:r.safety_cars_per_race}}
// rank correlation rating vs average points (all-214)
const rows=D.map(d=>({d,avg:pts.get(d.id)[0]/pts.get(d.id)[1],t:titles.get(d.id)||0}));
const rk=a=>{const o=a.map((v,i)=>[v,i]).sort((x,y)=>x[0]-y[0]),r=[];o.forEach((e,k)=>r[e[1]]=k);return r};
const x=rk(rows.map(r=>r.d.r)),y=rk(rows.map(r=>r.avg));let sd=0;const n=rows.length;for(let i=0;i<n;i++)sd+=(x[i]-y[i])**2;
out.configs.all214.spearman_race_pace_vs_avg_points=+(1-6*sd/(n*(n*n-1))).toFixed(3);
fs.writeFileSync('results/multi_season_summary.json',JSON.stringify(out,null,1));
fs.writeFileSync('results/driver_avg_points_all214.csv','driver_id,driver,race_pace,qualifying_pace,avg_points_per_season,titles\n'+rows.sort((a,b)=>b.avg-a.avg).map(r=>[r.d.id,'"'+r.d.name+'"',r.d.r,r.d.q,r.avg.toFixed(2),r.t].join(',')).join('\n'));
fs.writeFileSync('results/title_counts_all214.csv','driver,titles\n'+rows.filter(r=>r.t).sort((a,b)=>b.t-a.t).map(r=>`"${r.d.name}",${r.t}`).join('\n'));
console.log(JSON.stringify(out));
