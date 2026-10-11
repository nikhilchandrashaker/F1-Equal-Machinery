const fs=require('fs');
const PTS=require('./race_engine').PTS;
exports.write=function(out){
 let st='pos,driver_id,driver,points,wins,podiums,poles,dnfs\n';
 out.st.forEach((s,i)=>st+=[i+1,s.d.id,'"'+s.d.name+'"',s.pts,s.w,s.p,s.pl,s.dnf].join(',')+'\n');
 fs.writeFileSync('standings.csv',st);
 let rr='round,track,wetness,pos,driver_id,driver,grid,laps_completed,status,gap_s,points\n';
 out.races.forEach((r,i)=>r.res.forEach(x=>rr+=[i+1,'"'+r.tr.name+'"',r.wet,x.pos,x.d.id,'"'+x.d.name+'"',x.g,x.laps,x.dnf?(x.dnf===1?'DNF_mechanical':'DNF_incident'):'finished',x.dnf?'':(x.t-r.res[0].t).toFixed(2),x.pos<=10?PTS[x.pos-1]:0].join(',')+'\n'));
 fs.writeFileSync('race_results.csv',rr);
 const top=out.st[0];
 fs.writeFileSync('season_summary.json',JSON.stringify({champion:top.d.name,champion_points:top.pts,field_size:out.field.length,races:out.races.length,wins_leader:out.st.slice().sort((a,b)=>b.w-a.w)[0].d.name,dnf_total:out.st.reduce((a,s)=>a+s.dnf,0),top10:out.st.slice(0,10).map(s=>({driver:s.d.name,points:s.pts,wins:s.w}))},null,1));
};
