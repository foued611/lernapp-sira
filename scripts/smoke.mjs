import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { IDBFactory } from 'fake-indexeddb';
import { fileURLToPath } from 'node:url';
const repo=fileURLToPath(new URL('..', import.meta.url));
async function bundle(entry){const r=await build({entryPoints:[repo+'/'+entry],bundle:true,format:'iife',write:false});return r.outputFiles[0].text}
async function boot(htmlFile,code,store={},idb=null){
  const html=readFileSync(repo+'/'+htmlFile,'utf8').replace(/<script[^>]*><\/script>/g,'').replace(/<link[^>]*>/g,'');
  const errors=[];
  const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/not implemented/i.test(e.message))errors.push(e.message)});
  const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://x.test/',virtualConsole:vc,pretendToBeVisual:true});
  const w=dom.window;w.scrollTo=()=>{};
  if(idb)w.indexedDB=idb;
  for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);
  w.addEventListener('error',e=>errors.push(String(e.message)));
  try{w.eval(code)}catch(e){errors.push('eval: '+e.stack)}
  await new Promise(r=>setTimeout(r,80));
  return {w,errors};
}
const click=(w,el)=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const $=(w,s)=>w.document.querySelector(s);
const $$=(w,s)=>[...w.document.querySelectorAll(s)];
const tick=()=>new Promise(r=>setTimeout(r,5));

async function playRound(w,maxSteps=40){
  let steps=0;
  while(steps++<maxSteps){
    if($(w,'.res'))return 'result';
    const q=$(w,'.qcard');if(!q)return 'noqcard';
    // match
    if($(w,'.match')){
      for(let guard=0;guard<60&&!$(w,'#nx');guard++){
        const half=$$(w,'.mb').length/2,lefts=()=>$$(w,'.mb').slice(0,half),rights=()=>$$(w,'.mb').slice(half);
        const li=lefts().findIndex(b=>!b.classList.contains('dn'));
        if(li<0)break;
        for(let j=0;j<half&&!$(w,'#nx');j++){
          if(lefts()[li].classList.contains('dn'))break;
          click(w,lefts()[li]);
          if(rights()[j]&&!rights()[j].classList.contains('dn'))click(w,rights()[j]);
        }
      }
    } else if($(w,'#ans')){
      const inp=$(w,'#ans');inp.value='x';inp.dispatchEvent(new w.Event('input',{bubbles:true}));click(w,$(w,'#chk'));
    } else {
      click(w,$(w,'.opt'));click(w,$(w,'#chk'));
    }
    const nx=$(w,'#nx');
    if(nx)click(w,nx);
    await tick();
  }
  return 'timeout';
}

const results=[];
const appCode=await bundle('apps/franzoesisch-verben/main.js');
const dashCode=await bundle('dashboard.js');
const infoCode=await bundle('apps/informatik/main.js');

// 1) Alle Seiten durchspielen
{
  const {w,errors}=await boot('apps/franzoesisch-verben/index.html',appCode);
  results.push(['Home rendert',!!$(w,'.hero')&&$$(w,'.node').length===6]);
  for(const id of ['etre','avoir','aller','faire','er','irre']){
    click(w,$(w,`.node[data-id="${id}"]`));
    results.push([`Theorie ${id}`,!!$(w,'.conj')&&$$(w,'.conj tr').length===6]);
    if(id==='er'){click(w,$(w,'[data-act="verb"][data-v="aimer"]'));results.push(['Verbwechsel',$(w,'.conj .stem').textContent==='aim']);click(w,$(w,'[data-act="cover"]'));results.push(['Abdecken',$$(w,'.fm.hid').length===6])}
    click(w,$(w,'[data-act="start"]'));
    const r=await playRound(w);
    results.push([`Runde ${id} -> ${r}`,r==='result']);
    click(w,$(w,'[data-act="home"]'));
  }
  // Quick, Blitz
  click(w,$(w,'[data-act="quick"]'));
  results.push(['Quick -> '+await playRound(w),!!$(w,'.res')]);
  click(w,$(w,'[data-act="home"]'));
  click(w,$(w,'[data-act="blitz"]'));
  results.push(['Blitz startet',!!$(w,'.timer')]);
  click(w,$(w,'.opt'));await new Promise(r=>setTimeout(r,400));
  click(w,$(w,'[data-act="exit"]'));
  results.push(['Blitz Exit -> Home',!!$(w,'.hero')]);
  // Name speichern
  const nm=$(w,'#nm');nm.value='Sira';click(w,$(w,'[data-act="savename"]'));
  results.push(['Name',$(w,'.hero h1').textContent.includes('Sira')]);
  const prof=JSON.parse(w.localStorage.getItem('lernwerkstatt:profile'));
  const appS=JSON.parse(w.localStorage.getItem('lernwerkstatt:app:fr-verben'));
  results.push(['Profil gespeichert',prof.name==='Sira'&&prof.xp>0&&prof.streak===1]);
  results.push(['App gespeichert',typeof appS.xp==='number'&&typeof appS.stars==='object']);
  results.push(['Fehler im App-Lauf: '+errors.length,errors.length===0]);
  if(errors.length)console.log(errors.slice(0,5));
  // Boss gesperrt/frei
  results.push(['Boss-Button vorhanden',!!$(w,'[data-act="boss"]')]);
}
// 2) Boss mit freigeschalteten Seiten
{
  const stars={etre:1,avoir:1,aller:1,faire:1,er:1,irre:1};
  const {w,errors}=await boot('apps/franzoesisch-verben/index.html',appCode,{'lernwerkstatt:app:fr-verben':JSON.stringify({xp:10,stars,badges:{},best:{}})});
  const b=$(w,'[data-act="boss"]');results.push(['Boss frei',!b.disabled]);
  click(w,b);results.push(['Boss -> '+await playRound(w,60),!!$(w,'.res')]);
  click(w,$(w,'[data-act="home"]'));
  click(w,$(w,'[data-act="reset"]'));click(w,$(w,'[data-act="resetok"]'));
  const s=JSON.parse(w.localStorage.getItem('lernwerkstatt:app:fr-verben'));
  results.push(['Reset speichert leer',s.xp===0&&Object.keys(s.stars).length===0]);
  click(w,$(w,'[data-act="quick"]'));click(w,$(w,'.opt'));click(w,$(w,'#chk'));click(w,$(w,'#nx'));
  const s2=JSON.parse(w.localStorage.getItem('lernwerkstatt:app:fr-verben'));
  results.push(['Nach Reset weiter speicherbar',s2.xp>=0]);
  results.push(['Fehler Boss: '+errors.length,errors.length===0]);
  if(errors.length)console.log(errors.slice(0,5));
}
// 2b) Zahlenwerkstatt: Theorie-Spielzeuge und eine Runde je Seite
{
  const {w,errors}=await boot('apps/informatik/index.html',infoCode);
  results.push(['Info: Home rendert',!!$(w,'.hero')&&$$(w,'.node').length===6]);
  for(const id of ['stellen','binaer','dez2bin','addieren','hex','binhex']){
    click(w,$(w,`.node[data-id="${id}"]`));
    results.push([`Info Theorie ${id}`,!!$(w,'.toy')&&$$(w,'.note').length>=2]);
    if(id==='binaer'){
      const before=$(w,'[data-sum]').textContent;
      click(w,$(w,'.bit[data-i="0"]'));
      results.push(['Lampe schaltet Summe',$(w,'[data-sum]').textContent!==before&&$(w,'[data-sum]').textContent.includes('139')]);
    }
    if(id==='binhex'){click(w,$(w,'.bit[data-i="7"]'));results.push(['Vierergruppen',$$(w,'.nib').length===2]);}
    if(id==='hex'){const sl=$(w,'#slide');sl.value='47';sl.dispatchEvent(new w.Event('input',{bubbles:true}));results.push(['Schieberegler Hex',$(w,'[data-hex]').textContent==='2F']);}
    click(w,$(w,'[data-act="start"]'));
    const r=await playRound(w);
    results.push([`Info Runde ${id} -> ${r}`,r==='result']);
    click(w,$(w,'[data-act="home"]'));
  }
  click(w,$(w,'[data-act="quick"]'));
  results.push(['Info Quick -> '+await playRound(w),!!$(w,'.res')]);
  click(w,$(w,'[data-act="home"]'));
  results.push(['Info: Fehler '+errors.length,errors.length===0]);
  if(errors.length)console.log(errors.slice(0,5));
}
// 2c) Browser-Datenbank (IndexedDB): Fortschritt landet dort, alter localStorage-Stand wird übernommen
{
  const idb=new IDBFactory();
  const {w,errors}=await boot('apps/informatik/index.html',infoCode,{'lernwerkstatt:app:info-zahlen':JSON.stringify({xp:40,stars:{stellen:2},badges:{},best:{},__v:1})},idb);
  results.push(['IDB: Home rendert',!!$(w,'.hero')]);
  results.push(['IDB: Altstand übernommen (1 Seite)',$$(w,'.node .stars .on').length===2]);
  results.push(['IDB: localStorage aufgeräumt',w.localStorage.getItem('lernwerkstatt:app:info-zahlen')===null]);
  click(w,$(w,'.node[data-id="stellen"]'));click(w,$(w,'[data-act="start"]'));
  results.push(['IDB: Runde -> '+await playRound(w),!!$(w,'.res')]);
  await new Promise(r=>setTimeout(r,100));
  const rows=await new Promise((res,rej)=>{const o=idb.open('lernwerkstatt');o.onsuccess=()=>{const t=o.result.transaction(['docs','log']);const d=t.objectStore('docs').getAll(),l=t.objectStore('log').getAll();t.oncomplete=()=>res({docs:d.result,log:l.result})};o.onerror=()=>rej(o.error)});
  const app=rows.docs.find(r=>r.key==='lernwerkstatt:app:info-zahlen');
  results.push(['IDB: App-Dokument gespeichert',!!app&&app.value.xp>=40&&app.value.__v===1]);
  results.push(['IDB: Profil gespeichert',rows.docs.some(r=>r.key==='lernwerkstatt:profile')]);
  results.push(['IDB: Runde im Protokoll',rows.log.length===1&&rows.log[0].unit==='stellen']);
  results.push(['IDB: Fehler '+errors.length,errors.length===0]);
  if(errors.length)console.log(errors.slice(0,5));
}
// 3) Dashboard
{
  const today=new Date();const d=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
  const {w,errors}=await boot('index.html',dashCode,{
    'lernwerkstatt:profile':JSON.stringify({name:'Sira',xp:120,streak:2,lastDay:d,lastApp:'fr-verben',day:{d,xp:20}}),
    'lernwerkstatt:app:fr-verben':JSON.stringify({xp:120,stars:{etre:3,avoir:1},badges:{first:true},best:{}})});
  results.push(['Dashboard Kacheln = 6',$$(w,'.tile').length===6]);
  results.push(['Live-Kacheln verlinkt',$$(w,'a.tile').length===2&&$$(w,'a.tile').some(a=>a.getAttribute('href').includes('informatik'))]);
  results.push(['Fortschritt 2 von 6',$(w,'a.tile .lab').textContent.includes('2 von 6')]);
  results.push(['Weiter-Karte',!$(w,'#cont-sec').hidden]);
  results.push(['Hero Name',$(w,'#hero h1').textContent.includes('Sira')]);
  click(w,$$(w,'.chip').find(c=>c.dataset.s==='Physik'));
  results.push(['Filter Physik = 1',$$(w,'.tile').length===1]);
  results.push(['Fehler Dashboard: '+errors.length,errors.length===0]);
  if(errors.length)console.log(errors.slice(0,5));
}
let bad=0;for(const [n,ok] of results){if(!ok)bad++;console.log((ok?'PASS ':'FAIL ')+n)}
console.log(bad?`\n${bad} FEHLER`:'\nALLE OK');
process.exit(bad?1:0);
