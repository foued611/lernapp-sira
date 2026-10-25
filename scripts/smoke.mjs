import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const repo=fileURLToPath(new URL('..', import.meta.url));
async function bundle(entry){const r=await build({entryPoints:[repo+'/'+entry],bundle:true,format:'iife',write:false});return r.outputFiles[0].text}
function boot(htmlFile,code,store={}){
  const html=readFileSync(repo+'/'+htmlFile,'utf8').replace(/<script[^>]*><\/script>/g,'').replace(/<link[^>]*>/g,'');
  const errors=[];
  const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/not implemented/i.test(e.message))errors.push(e.message)});
  const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://x.test/',virtualConsole:vc,pretendToBeVisual:true});
  const w=dom.window;w.scrollTo=()=>{};
  for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);
  w.addEventListener('error',e=>errors.push(String(e.message)));
  try{w.eval(code)}catch(e){errors.push('eval: '+e.stack)}
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
        const lefts=()=>$$(w,'.mb').slice(0,6),rights=()=>$$(w,'.mb').slice(6);
        const li=lefts().findIndex(b=>!b.classList.contains('dn'));
        if(li<0)break;
        for(let j=0;j<6&&!$(w,'#nx');j++){
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

// 1) Alle Seiten durchspielen
{
  const {w,errors}=boot('apps/franzoesisch-verben/index.html',appCode);
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
  const {w,errors}=boot('apps/franzoesisch-verben/index.html',appCode,{'lernwerkstatt:app:fr-verben':JSON.stringify({xp:10,stars,badges:{},best:{}})});
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
// 3) Dashboard
{
  const today=new Date();const d=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
  const {w,errors}=boot('index.html',dashCode,{
    'lernwerkstatt:profile':JSON.stringify({name:'Sira',xp:120,streak:2,lastDay:d,lastApp:'fr-verben',day:{d,xp:20}}),
    'lernwerkstatt:app:fr-verben':JSON.stringify({xp:120,stars:{etre:3,avoir:1},badges:{first:true},best:{}})});
  results.push(['Dashboard Kacheln = 6',$$(w,'.tile').length===6]);
  results.push(['Live-Kachel verlinkt',$$(w,'a.tile').length===1&&$(w,'a.tile').getAttribute('href').includes('franzoesisch')]);
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
