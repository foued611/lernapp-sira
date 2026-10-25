import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { IDBFactory } from 'fake-indexeddb';
import { existsSync } from 'node:fs';
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

// ---------------------------------------------------------------------------
// Durchspiel-Test für ALLE Apps aus registry.js. Es steht kein App-Name im Skript.
// App-spezifische Prüfungen (z. B. Lampen, Verbtabellen) liegen in apps/<name>/smoke.mjs:
//   export default { theory: async ({ w, unit, click, $, $$ }) => [[Name, ok], ...] }
// ---------------------------------------------------------------------------
import { APPS } from '../registry.js';

const results=[];
const live=APPS.filter(a=>a.status==='live');
const folderOf=a=>a.href.replace(/index\.html$/,'');
const dashCode=await bundle('dashboard.js');
const api={click,$,$$};

async function loadHooks(app){
  const f=folderOf(app)+'smoke.mjs';
  return existsSync(repo+'/'+f)?(await import(repo+'/'+f)).default:{};
}

for(const app of live){
  const folder=folderOf(app), tag=app.id+': ';
  const {default:config}=await import(repo+'/'+folder+'config.js');
  const hooks=await loadHooks(app);
  const code=await bundle(folder+'main.js');
  const key='lernwerkstatt:app:'+app.id;
  const unitIds=config.units.map(u=>u.id);

  // 1) Startseite, jede Seite: Lektion, Theorie-Spielzeug, Runde
  {
    const {w,errors}=await boot(folder+'index.html',code);
    results.push([tag+'Startseite mit '+unitIds.length+' Seiten',!!$(w,'.hero')&&$$(w,'.node').length===unitIds.length]);
    results.push([tag+'Sammelalbum hat eine Karte je Seite',$$(w,'.gcard').length===config.units.filter(u=>u.card).length]);
    for(const unit of config.units){
      click(w,$(w,`.node[data-id="${unit.id}"]`));
      const items=$$(w,'.lsn-list li'),shown=()=>items.filter(li=>!li.hidden).length;
      results.push([tag+unit.id+': Lektion vollständig',!!$(w,'.lsn-goal')&&!!$(w,'.lsn-tldr')&&!!$(w,'.lsn-fig svg')&&!!$(w,'.lsn-pit')&&!!$(w,'.lsn-check')&&shown()===1]);
      const nx=$(w,'[data-lsn="next"]');click(w,nx);
      results.push([tag+unit.id+': Schritt klappt auf',shown()===2]);
      for(let i=0;i<10;i++)if(!nx.hidden)click(w,nx);
      results.push([tag+unit.id+': alle Schritte, Button weg',shown()===items.length&&nx.hidden]);
      const group=$(w,'.lsn-opts'),wrong=$$(w,'.lsn-opts .opt').find(b=>b.dataset.id!==group.dataset.answer);
      click(w,wrong);
      results.push([tag+unit.id+': Mini-Check zeigt Lösung',$(w,'.lsn-fb').classList.contains('bad')&&!!$(w,'.lsn-opts .opt.right')]);
      if(hooks.theory)for(const [n,ok] of await hooks.theory({w,unit,...api}))results.push([tag+unit.id+': '+n,ok]);
      click(w,$(w,'[data-act="start"]'));
      const r=await playRound(w);
      results.push([tag+unit.id+': Runde -> '+r,r==='result']);
      click(w,$(w,'[data-act="home"]'));
    }
    if(config.rounds.quick){click(w,$(w,'[data-act="quick"]'));results.push([tag+'Quick -> '+await playRound(w),!!$(w,'.res')]);click(w,$(w,'[data-act="home"]'))}
    if(config.blitz){
      click(w,$(w,'[data-act="blitz"]'));results.push([tag+'Blitz startet',!!$(w,'.timer')]);
      click(w,$(w,'.opt'));await new Promise(r=>setTimeout(r,400));click(w,$(w,'[data-act="exit"]'));
      results.push([tag+'Blitz Exit -> Home',!!$(w,'.hero')]);
    }
    const nm=$(w,'#nm');nm.value='Sira';click(w,$(w,'[data-act="savename"]'));
    results.push([tag+'Name wird angezeigt',$(w,'.hero h1').textContent.includes('Sira')]);
    const prof=JSON.parse(w.localStorage.getItem('lernwerkstatt:profile')),appS=JSON.parse(w.localStorage.getItem(key));
    results.push([tag+'Profil und App gespeichert',prof.name==='Sira'&&prof.xp>0&&typeof appS.xp==='number'&&typeof appS.stars==='object']);
    results.push([tag+'Fehler: '+errors.length,errors.length===0]);
    if(errors.length)console.log(errors.slice(0,5));
  }

  // 2) Endgegner mit freigeschalteten Seiten, danach Zurücksetzen
  if(config.rounds.boss){
    const stars=Object.fromEntries(unitIds.map(id=>[id,1]));
    const {w,errors}=await boot(folder+'index.html',code,{[key]:JSON.stringify({xp:10,stars,badges:{},best:{}})});
    const b=$(w,'[data-act="boss"]');results.push([tag+'Endgegner frei',!b.disabled]);
    click(w,b);results.push([tag+'Endgegner -> '+await playRound(w,60),!!$(w,'.res')]);
    click(w,$(w,'[data-act="home"]'));
    click(w,$(w,'[data-act="reset"]'));click(w,$(w,'[data-act="resetok"]'));
    const s=JSON.parse(w.localStorage.getItem(key));
    results.push([tag+'Zurücksetzen speichert leer',s.xp===0&&Object.keys(s.stars).length===0]);
    click(w,$(w,'[data-act="quick"]')||$(w,'.node'));
    results.push([tag+'Fehler Endgegner: '+errors.length,errors.length===0]);
    if(errors.length)console.log(errors.slice(0,5));
  }

  // 3) Browser-Datenbank: alter localStorage-Stand wird übernommen, neuer landet in IndexedDB und im Protokoll
  {
    const idb=new IDBFactory(), first=unitIds[0];
    const {w,errors}=await boot(folder+'index.html',code,{[key]:JSON.stringify({xp:40,stars:{[first]:2},badges:{},best:{},__v:1})},idb);
    results.push([tag+'IDB: Altstand übernommen',$$(w,'.node .stars .on').length===2&&w.localStorage.getItem(key)===null]);
    results.push([tag+'IDB: Sammelkarte Silber',$$(w,'.gcard.t2').length===1]);
    click(w,$(w,`.node[data-id="${first}"]`));click(w,$(w,'[data-act="start"]'));
    results.push([tag+'IDB: Runde -> '+await playRound(w),!!$(w,'.res')]);
    await new Promise(r=>setTimeout(r,100));
    const rows=await new Promise((res,rej)=>{const o=idb.open('lernwerkstatt');o.onsuccess=()=>{const t=o.result.transaction(['docs','log']);const d=t.objectStore('docs').getAll(),l=t.objectStore('log').getAll();t.oncomplete=()=>res({docs:d.result,log:l.result})};o.onerror=()=>rej(o.error)});
    const doc=rows.docs.find(r=>r.key===key);
    results.push([tag+'IDB: App-Dokument und Profil gespeichert',!!doc&&doc.value.xp>=40&&doc.value.__v===1&&rows.docs.some(r=>r.key==='lernwerkstatt:profile')]);
    results.push([tag+'IDB: Runde im Protokoll',rows.log.length===1&&rows.log[0].unit===first&&rows.log[0].app===app.id]);
    results.push([tag+'IDB: Fehler '+errors.length,errors.length===0]);
    if(errors.length)console.log(errors.slice(0,5));
  }
}

// Zweiter Versuch (gehört zum gemeinsamen Quiz-Kern, daher nur einmal): Genauigkeit zählt nur Erstversuche
{
  const code=(await build({stdin:{contents:`import {startQuiz} from '${repo}/core/js/quiz.js'; window.__startQuiz=startQuiz;`,resolveDir:repo},bundle:true,format:'iife',write:false})).outputFiles[0].text;
  const dom=new JSDOM('<div id="m"></div>',{runScripts:'outside-only',url:'https://x.test/',pretendToBeVisual:true});
  const w=dom.window;w.scrollTo=()=>{};w.eval(code);
  const q=(n)=>({kind:'choice',label:'T',prompt:'Frage '+n,answer:'a',options:[{id:'a',html:'a'},{id:'b',html:'b'}],why:'weil'});
  let result=null;
  w.__startQuiz({mount:w.document.getElementById('m'),ctx:{profile:{xp:0,day:{d:'',xp:0}},app:{xp:0},save(){},refreshHeader(){},words:{praise:['ok']},inputChars:[]},mode:'lesson',questions:[q(1),q(2),q(3)],onExit(){},onFinish(r){result=r}});
  const answer=(id)=>{click(w,$$(w,'.opt').find(b=>b.textContent.includes(id)));click(w,$(w,'#chk'));click(w,$(w,'#nx'))};
  answer('b');answer('a');answer('a');
  const retryShown=!!$(w,'.retry-tag');
  answer('a');
  results.push(['Zweiter Versuch erscheint nach Fehler',retryShown]);
  results.push(['Zweiter Versuch: Runde endet mit 3 Aufgaben',!!result&&result.total===3&&result.wrong===1&&result.correct===2&&result.relearned===1]);
  results.push(['Zweiter Versuch: Genauigkeit zählt nur Erstversuche',!!result&&Math.abs(result.accuracy-2/3)<1e-9]);
}

// Dashboard: Kacheln, Fortschritt, Weiter-Karte, Filter
{
  const app=live[0];
  const {default:config}=await import(repo+'/'+folderOf(app)+'config.js');
  const day=(d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))(new Date());
  const ids=config.units.map(u=>u.id);
  const {w,errors}=await boot('index.html',dashCode,{
    'lernwerkstatt:profile':JSON.stringify({name:'Sira',xp:120,streak:2,lastDay:day,lastApp:app.id,day:{d:day,xp:20}}),
    ['lernwerkstatt:app:'+app.id]:JSON.stringify({xp:120,stars:{[ids[0]]:3,[ids[1]]:1},badges:{},best:{}})});
  results.push(['Dashboard: eine Kachel je App',$$(w,'.tile').length===APPS.length]);
  results.push(['Dashboard: Live-Apps verlinkt',$$(w,'a.tile').length===live.length&&live.every(a=>$$(w,'a.tile').some(t=>t.getAttribute('href')===a.href))]);
  results.push(['Dashboard: Fortschritt der ersten App',$$(w,'a.tile').find(t=>t.getAttribute('href')===app.href).querySelector('.lab').textContent.includes('2 von '+ids.length)]);
  results.push(['Dashboard: Weiter-Karte',!$(w,'#cont-sec').hidden]);
  results.push(['Dashboard: Name',$(w,'#hero h1').textContent.includes('Sira')]);
  const subject=[...new Set(APPS.map(a=>a.subject))].find(s=>APPS.filter(a=>a.subject===s).length===1);
  click(w,$$(w,'.chip').find(c=>c.dataset.s===subject));
  results.push(['Dashboard: Filter '+subject,$$(w,'.tile').length===1]);
  results.push(['Dashboard: Fehler '+errors.length,errors.length===0]);
  if(errors.length)console.log(errors.slice(0,5));
}

let bad=0;for(const [n,ok] of results){if(!ok)bad++;console.log((ok?'PASS ':'FAIL ')+n)}
console.log(bad?`\n${bad} FEHLER`:`\nALLE OK (${results.length} Prüfungen, ${live.length} Apps)`);
process.exit(bad?1:0);
