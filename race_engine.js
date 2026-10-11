// Race engine v2 (lap-by-lap): qualifying, tire compounds, one planned pit stop, safety cars,
// dirty-air traffic, mechanical failures and driver incidents. Every car is the identical EM-01;
// only driver ratings and seeded randomness differ.
const DATA=require('./drivers.json');
const D=DATA.drivers,P=DATA.params,REL=P.car_reliability,S=P.driver_rating_effect_strength;
const K={pitLoss:21,scLaps:4,softGain:.5,hardRate:.012,softRate:.045,gap:.5,mech:.014,inc:6,scDnf:.7,scSpin:.25};
const PTS=[25,18,15,12,10,8,6,4,2,1];
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(r){return Math.sqrt(-2*Math.log(1-r()))*Math.cos(2*Math.PI*r())}
function pickField(cfg,r){
 if(cfg.fmt==='all')return D.slice();
 const n=Math.min(cfg.fs,D.length);
 if(cfg.sel==='top')return D.slice().sort((a,b)=>b.pk-a.pk).slice(0,n);
 const a=D.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n);
}
// opt: {sc:false} disables safety cars, {pits:false} forces a no-stop race, {rec:true} records a lap log
function race(field,tr,wet,v,r,laps,opt){
 opt=opt||{};const useSC=opt.sc!==false,usePit=opt.pits!==false;
 const q=field.map(d=>({d,t:(100-d.q)*S*.03+gauss(r)*.15*v})).sort((a,b)=>a.t-b.t);
 const pf=(100-REL)/100*K.mech*v;
 const st=q.map((x,i)=>{const d=x.d,soft=usePit&&r()<.5;
  const pit=usePit?Math.max(8,Math.min(laps-8,Math.round((soft?16:26)*(.85+.3*d.tm/100)+gauss(r)*2))):9999;
  return{d,g:i+1,t:i*.12*(1-d.rc/150),soft,pit,age:0,stopped:false,pits:0,dnf:0,laps:0,
   base:(100-d.r)*S*.03+wet*(100-(.7*d.w+.3*d.ad))*.035,form:gauss(r)*.08*v,sd:.35*(1.5-d.c/100)*v,
   pi:P.incident_rate_base*Math.pow((100-d.ea)/100,1.5)*K.inc*v,best:1e9}});
 let scLeft=0,scN=0,last=-99;const log=opt.rec?[]:null;
 for(let lap=1;lap<=laps;lap++){
  const act=st.filter(s=>!s.dnf).sort((a,b)=>a.t-b.t),sc=scLeft>0,pits=[],out=[];
  for(let i=0;i<act.length;i++){const s=act[i];let lt=0;
   if(!sc){lt=s.base+(1.5-s.d.tm/100)*(s.soft?K.softRate:K.hardRate)*s.age-(s.soft?K.softGain:0)+s.form+gauss(r)*s.sd;
    if(i>0&&s.t-act[i-1].t<1)lt+=.25*(1-s.d.rc/150);
    if(lt<s.best)s.best=lt}
   s.age++;
   if(!s.stopped&&lap>=5&&(lap>=s.pit||(sc&&lap>=s.pit-6))){lt+=sc?K.pitLoss*.45:K.pitLoss+gauss(r)*.6*(1.4-s.d.c/100);s.stopped=true;s.pits++;s.soft=!s.soft;s.age=0;pits.push(s.d.id)}
   s.t+=lt;s.laps=lap}
  let ev=0;
  for(const s of act){
   if(r()<pf){s.dnf=1;out.push(s.d.id);continue}
   if(r()<s.pi){if(r()<.4){s.dnf=2;out.push(s.d.id);ev=Math.max(ev,K.scDnf)}else{s.t+=8+r()*17;ev=Math.max(ev,K.scSpin)}}}
  if(useSC&&!sc&&ev&&scN<3&&lap-last>=10&&r()<ev){scLeft=K.scLaps;scN++;last=lap}
  if(scLeft>0){const a=st.filter(s=>!s.dnf).sort((x,y)=>x.t-y.t);
   if(a.length){let po=a[0].t,pn=po;for(let i=1;i<a.length;i++){const o=a[i].t;pn+=Math.min(o-po,K.gap);po=o;a[i].t=pn}}
   if(sc)scLeft--}
  if(log){const o=st.filter(s=>!s.dnf).sort((a,b)=>a.t-b.t);
   log.push({lap,sc,order:o.slice(0,20).map(s=>[s.d.id,+(s.t-o[0].t).toFixed(1)]),pits,out})}
 }
 const res=st.map(s=>({d:s.d,g:s.g,t:s.t,dnf:s.dnf,laps:s.laps,pits:s.pits}));
 res.sort((a,b)=>(b.laps-a.laps)||(a.t-b.t));res.forEach((x,i)=>x.pos=i+1);
 const fl=st.slice().sort((a,b)=>a.best-b.best)[0].d;
 return{res,pole:q[0].d,tr,wet,sc:scN,fl,log};
}
module.exports={race,rng,gauss,pickField,PTS,D,P,K};
