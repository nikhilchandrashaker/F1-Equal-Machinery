// Race engine: qualifying + race for one Grand Prix. All cars are identical (EM-01);
// only driver ratings, tire/wet/consistency/reliability rules and seeded randomness differ.
const DATA=require('./drivers.json');
const D=DATA.drivers,P=DATA.params,REL=P.car_reliability;
const S=P.driver_rating_effect_strength;
const PTS=[25,18,15,12,10,8,6,4,2,1];
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(r){return Math.sqrt(-2*Math.log(1-r()))*Math.cos(2*Math.PI*r())}

function pickField(cfg,r){
 if(cfg.fmt==='all')return D.slice();
 const n=Math.min(cfg.fs,D.length);
 if(cfg.sel==='top')return D.slice().sort((a,b)=>b.pk-a.pk).slice(0,n);
 const a=D.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n);
}
function race(field,tr,wet,v,r,laps){
 const q=field.map(d=>({d,t:(100-d.q)*S*.03+gauss(r)*.15*v})).sort((a,b)=>a.t-b.t);
 const grid=new Map(q.map((x,i)=>[x.d.id,i+1]));
 const res=field.map(d=>{
  const g=grid.get(d.id);
  let lapSd=.35*(1.5-d.c/100)*v;
  let t=laps*(100-d.r)*S*.03;
  t+=(100-d.tm)/100*.004*laps*laps/2;
  t+=wet*(100-(.7*d.w+.3*d.ad))*.035*laps;
  t+=(g-1)*.12*(1-d.rc/150);
  t+=gauss(r)*lapSd*Math.sqrt(laps)+gauss(r)*.08*laps*v;
  const pf=(100-REL)/100*.024*v, pi=P.incident_rate_base*Math.pow((100-d.ea)/100,1.5)*v;
  let dnf=0,out=Infinity;
  const lf=Math.ceil(Math.log(1-r())/Math.log(1-pf));
  if(lf<=laps){dnf=1;out=lf}
  const li=Math.ceil(Math.log(1-r())/Math.log(1-pi));
  if(li<=laps){ if(r()<.4){if(li<out){dnf=2;out=li}} else t+=8+r()*17 }
  return{d,g,t,dnf,laps:dnf?out:laps};
 });
 res.sort((a,b)=>(b.laps-a.laps)||(a.t-b.t));
 res.forEach((x,i)=>x.pos=i+1);
 return{res,pole:q[0].d,tr,wet};
}

module.exports={race,rng,gauss,pickField,PTS,D,P};
