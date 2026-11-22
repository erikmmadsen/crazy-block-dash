// Crazy Block Dash · Telas e botões (menu, pausa, fim de jogo, voltar do Android)
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ===== TELAS: menu | game | pause | over | howto | lang | levels | lvlEnd | rank ===== */
let screen='menu',howtoReturn='menu';
const LOGO=['AAB.CCD','A.BBC.D','EEE.FFD']; // desenho de blocos do logo (letra = cor, ponto = vazio)
function drawLogo(){
 const el=$('#logo'),pal={A:colors[0],B:colors[1],C:colors[3],D:colors[4],E:colors[2],F:colors[5]};el.innerHTML='';
 LOGO.forEach((row,y)=>[...row].forEach((ch,x)=>{const i=document.createElement('i');if(ch==='.')i.className='e';else{i.style.setProperty('--c',pal[ch]);i.style.setProperty('--d',(x*60+y*90)+'ms')}el.append(i)}));
}
function show(name){
 if(drag)stopDrag();
 ['menu','pause','over','howto','lang','levels','lvlEnd','rank'].forEach(s=>$('#'+s).classList.toggle('show',s===name));
 screen=name;
 if(name==='menu'||name==='levels')backToClassic();
 if(name==='levels')drawLevels();
 if(name==='menu'){
  $('#menuBest').textContent=best;drawLogo();
  $('#playBtn').textContent=hasGame?t('cont'):t('play');$('#newBtn').hidden=!hasGame;
 }
 if(name==='lang')drawLangs();
 $('#restartBtn').innerHTML=mode==='level'?t('lvlRestart'):t('restart');
 if(name==='over'||name==='pause'||name==='howto'||name==='lang'||name==='levels'||name==='lvlEnd')$('#'+name).scrollTop=0;
}
$('#playBtn').onclick=()=>{
 if(!ready)return;
 if(!hasGame)newGame();
 if(!DATA.seenHelp){DATA.seenHelp=true;persist();howtoReturn='game';show('howto')} // 1ª vez: mostra as regras
 else show('game');
};
$('#newBtn').onclick=()=>{if(!ready)return;newGame();show('game')};
$('#pauseBtn').onclick=()=>show('pause');
$('#resumeBtn').onclick=()=>show('game');
$('#restartBtn').onclick=()=>{if(mode==='level')startLevel(lvl);else{newGame();show('game')}};
$('#pauseMenuBtn').onclick=()=>show('menu');
$('#againBtn').onclick=()=>{newGame();show('game')};
$('#overMenuBtn').onclick=()=>show('menu');
document.querySelectorAll('[data-go=howto]').forEach(b=>b.onclick=()=>{howtoReturn=screen;show('howto')});
$('#howtoBack').onclick=()=>show(howtoReturn);
$('#langBtn').onclick=()=>show('lang');
$('#levelsBtn').onclick=()=>{if(ready)show('levels')};
$('#levelsBack').onclick=()=>show('menu');
document.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{if(ready)openRank()});
$('#rankBack').onclick=()=>show(rankReturn);
$('#lvlNext').onclick=()=>startLevel(Math.min(LEVELS.length-1,lvl+1));
$('#lvlRetry').onclick=()=>startLevel(lvl);
$('#lvlToList').onclick=()=>show('levels');
$('#langBack').onclick=()=>show('menu');
// clique dos botões do menu usa o som de encaixe, mais agudo
document.querySelectorAll('.btn').forEach(b=>b.addEventListener('click',()=>play('encaixar',1.3)));

// app foi para segundo plano no meio da partida: abre a pausa
// e garante que tudo fica gravado antes de o Android poder fechar o app
document.addEventListener('visibilitychange',()=>{if(!document.hidden||!ready)return;if(screen==='game')show('pause');DATA.best=best;persist()});

// botão "voltar" do Android
const CapApp=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App;
if(CapApp)CapApp.addListener('backButton',()=>{
 if(screen==='game')show('pause');
 else if(screen==='pause')show('game');
 else if(screen==='howto')show(howtoReturn);
 else if(screen==='lang')show('menu');
 else if(screen==='over')show('menu');
 else if(screen==='levels')show('menu');
 else if(screen==='rank')show(rankReturn);
 else if(screen==='lvlEnd')show('levels');
 else CapApp.exitApp();
});
