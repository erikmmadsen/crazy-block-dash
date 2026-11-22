// Crazy Block Dash · Save: dados do jogador (recorde, partida salva, preferências, fases)
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ===== DATA SAVE =====
   Tudo que o jogo guarda fica num único objeto (DATA), salvo em 2 lugares:
   1) Preferences do Capacitor: armazenamento nativo do Android. O sistema não limpa,
      e entra no backup automático do Google (volta ao reinstalar ou trocar de celular).
   2) localStorage: cópia rápida, e é o que funciona quando o jogo roda no navegador.
   Cada lugar guarda também a versão anterior (_bak). Ao abrir, o jogo usa a cópia válida
   mais recente. Se uma estiver corrompida, usa a outra. O recorde nunca diminui. */
const DATA_KEY='blocosmalucos_data',DATA_VERSION=1;
const Prefs=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Preferences;
const defaultData=()=>({v:DATA_VERSION,savedAt:0,best:0,music:true,sfx:true,seenHelp:false,lang:null,game:null,levels:{stars:[]}});
let DATA=defaultData(),lastRaw=null;
const parseJSON=r=>{try{return JSON.parse(r)}catch(e){return null}};
const validData=d=>d&&typeof d==='object'&&typeof d.best==='number'&&isFinite(d.best)?d:null;
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
async function prefGet(k){if(!Prefs)return null;try{return (await Prefs.get({key:k})).value}catch(e){return null}}
function prefSet(k,v){if(Prefs)Prefs.set({key:k,value:v}).catch(()=>{})}
function migrateOld(){ // traz os dados das versões antigas do jogo (chaves bb*)
 const d=defaultData();
 d.best=Number(lsGet('bbBest'))||0;d.sfx=lsGet('bbMute')!=='1';d.music=lsGet('bbMusic')!=='0';d.seenHelp=lsGet('bbHelp')==='1';
 d.game=parseJSON(lsGet('bbSave'));
 return d;
}
async function loadData(){
 const raws=await Promise.all([prefGet(DATA_KEY),prefGet(DATA_KEY+'_bak')]);
 raws.push(lsGet(DATA_KEY),lsGet(DATA_KEY+'_bak'));
 const found=raws.map(r=>r&&validData(parseJSON(r))).filter(Boolean).sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
 DATA=Object.assign(defaultData(),found[0]||migrateOld(),{v:DATA_VERSION});
 DATA.best=Math.max(DATA.best,...found.map(x=>x.best||0));
 persist();
}
function persist(){
 DATA.savedAt=Date.now();
 const raw=JSON.stringify(DATA);
 if(lastRaw){lsSet(DATA_KEY+'_bak',lastRaw);prefSet(DATA_KEY+'_bak',lastRaw)}
 lsSet(DATA_KEY,raw);prefSet(DATA_KEY,raw);
 lastRaw=raw;
}

let grid=emptyGrid(),score=0,best=0,pieces=[],drag=null,busy=false,cellEls=[];
let triples=0,partyTimer=0,gems=false,gen=0,bestAtStart=0,hasGame=false,ready=false; // gen muda a cada partida nova: cancela animações da partida anterior
function saveBest(){DATA.best=best} // grava junto com a jogada (saveGame) ou ao sair do app

/* partida salva: dá para fechar o app e continuar depois */
function saveGame(){DATA.game={grid,score,pieces,bestAtStart,gems,triples};DATA.best=best;persist()}
function clearSave(){DATA.game=null;DATA.best=best;persist()}
function loadGame(){
 const s=DATA.game;
 const ok=s&&Array.isArray(s.grid)&&s.grid.length===N&&s.grid.every(r=>Array.isArray(r)&&r.length===N)
  &&Array.isArray(s.pieces)&&s.pieces.length===3&&s.pieces.every(p=>p&&Array.isArray(p.shape)&&p.shape.length);
 if(!ok){DATA.game=null;return false}
 grid=s.grid;score=s.score|0;pieces=s.pieces;bestAtStart=s.bestAtStart|0;setGems(!!s.gems);triples=s.triples|0;drawMult();return true;
}
