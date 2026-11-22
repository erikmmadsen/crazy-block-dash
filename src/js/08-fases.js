// Crazy Block Dash · Modo Fases: as 20 fases, objetivos e estrelas
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ===== MODO FASES =====
   Cada fase: g = objetivo ('lines' = limpar linhas, 'score' = fazer pontos), n = quanto,
   m = quantas peças você tem (0 = sem limite), map = blocos que já começam no tabuleiro
   (linhas de baixo, '#' = bloco). */
const LEVELS=[
 {g:'lines',n:2,m:0,map:['####.#####','####.#####']},
 {g:'lines',n:3,m:0,map:['##.####.##','##.####.##','##.####.##']},
 {g:'score',n:800,m:0,map:[]},
 {g:'lines',n:4,m:20,map:['#.#.#.#.#.','.#.#.#.#.#']},
 {g:'lines',n:5,m:20,map:['###....###','###....###','###....###']},
 {g:'score',n:1500,m:25,map:['#........#','##......##','###....###']},
 {g:'lines',n:6,m:22,map:['.########.','.########.','.########.','.########.']},
 {g:'lines',n:5,m:18,map:['##..##..##','##..##..##']},
 {g:'score',n:2000,m:25,map:['....##....','...####...','..######..']},
 {g:'lines',n:8,m:26,map:['#.#.#.#.#.','#.#.#.#.#.','#.#.#.#.#.','#.#.#.#.#.']},
 {g:'lines',n:6,m:18,map:['#########.','.#########','#########.','.#########']},
 {g:'score',n:3000,m:30,map:['###..###..','..###..###']},
 {g:'lines',n:8,m:22,map:['#....#....','##..###..#','###.####.#']},
 {g:'lines',n:10,m:28,map:['##.##.##.#','#.##.##.##','.##.##.##.']},
 {g:'score',n:4000,m:30,map:['#.........','##........','###.......','####......','#####.....']},
 {g:'lines',n:10,m:25,map:['#..#..#..#','#..#..#..#','#..#..#..#','#..#..#..#','#..#..#..#']},
 {g:'lines',n:12,m:30,map:['..######..','.#......#.','#........#']},
 {g:'score',n:5000,m:32,map:['#.#.#.#.#.','.#.#.#.#.#','#.#.#.#.#.','.#.#.#.#.#']},
 {g:'lines',n:12,m:26,map:['###.##.###','##.####.##','#.######.#','.########.']},
 {g:'score',n:6000,m:35,map:['.#.#.#.#.#','#.#.#.#.#.','##..##..##','..##..##..','####..####']},
];
let mode='classic',lvl=0,lvlLines=0,lvlLeft=0;
const lvData=()=>{if(!DATA.levels||!Array.isArray(DATA.levels.stars))DATA.levels={stars:[]};return DATA.levels};
const lvUnlocked=()=>Math.min(LEVELS.length-1,lvData().stars.filter(x=>x>0).length);
function drawLevels(){
 const box=$('#lvGrid'),st=lvData().stars,open=lvUnlocked();box.innerHTML='';
 LEVELS.forEach((L,i)=>{
  const b=document.createElement('button'),lock=i>open&&!(st[i]>0);
  b.className='lv'+(lock?' lock':st[i]>0?' done':'')+(i===open&&!(st[i]>0)?' cur':'');
  b.innerHTML=lock?'🔒':`${i+1}<small>${st[i]>0?'★'.repeat(st[i])+'☆'.repeat(3-st[i]):''}</small>`;
  if(!lock)b.onclick=()=>{play('encaixar',1.3);startLevel(i)};
  box.append(b);
 });
}
function drawGoal(){
 const L=LEVELS[lvl],have=L.g==='lines'?lvlLines:score;
 $('#goalTxt').textContent='🎯 '+t(L.g==='lines'?'goalLines':'goalScore',L.n)+': '+Math.min(have,L.n)+'/'+L.n;
 $('#goalFill').style.width=Math.min(100,have/L.n*100)+'%';
 const gm=$('#goalMoves');gm.textContent=L.m?'🧩 '+lvlLeft:'';gm.classList.toggle('low',!!L.m&&lvlLeft<=3);
}
function setHud(){ // placar de cima: modo clássico mostra o recorde, modo fases mostra a fase
 const lab=document.querySelector('.stat small[data-i=best]');
 $('#goalBar').hidden=mode!=='level';
 if(mode==='level'){lab.textContent=t('level');setNum(bestEl,lvl+1);drawGoal()}
 else{lab.textContent=t('best');setNum(bestEl,best)}
}
function startLevel(i){
 const L=LEVELS[i];gen++;busy=false;if(drag)stopDrag();
 mode='level';lvl=i;lvlLines=0;lvlLeft=L.m;
 grid=emptyGrid();
 L.map.forEach((row,k)=>{const y=N-L.map.length+k;[...row].forEach((ch,x)=>{if(ch==='#')grid[y][x]={color:'#8a93c4',sand:false}})});
 score=0;setNum(scoreEl,0);msg.textContent=t(L.g==='lines'?'goalLines':'goalScore',L.n);
 setGems(false);triples=0;drawMult();hideParty();
 drawBoard();makePieces();setHud();show('game');
 if(musicOn&&!music.paused)fadeMusic(MUSICA.vol,600);
}
function backToClassic(){ // volta a partida normal que estava salva
 if(mode!=='level')return;
 mode='classic';gen++;busy=false;
 if(loadGame()){hasGame=true;setNum(scoreEl,score);drawBoard();drawTray(false)}
 else{hasGame=false;score=0;setNum(scoreEl,0);grid=emptyGrid();setGems(false);triples=0;drawMult();drawBoard();makePieces()}
 setHud();
}
async function levelAfterMove(g,lines){ // depois de cada jogada no modo fases
 const L=LEVELS[lvl];lvlLines+=lines;if(L.m)lvlLeft--;drawGoal();
 const won=(L.g==='lines'?lvlLines:score)>=L.n;
 if(won)return levelEnd(g,true);
 if(L.m&&lvlLeft<=0)return levelEnd(g,false,'noPieces');
 if(!pieces.some(x=>!x.used&&findAny(x)))return levelEnd(g,false,'noSpace');
}
async function levelEnd(g,won,why){
 busy=true;
 if(won){
  const L=LEVELS[lvl],st=lvData().stars;
  const stars=!L.m?3:1+(lvlLeft>=L.m*.25)+(lvlLeft>=L.m*.45);
  st[lvl]=Math.max(st[lvl]||0,stars);persist();
  buzz([40,60,40,60,80]);play('limpa_tudo');celebrate(Math.max(1,triples));
  await wait(reduce?200:1300);if(g!==gen)return;
  $('#lvlEndTitle').textContent=t('lvlWin');
  $('#lvlStars').innerHTML=[0,1,2].map(k=>`<i class="${k<stars?'on':''}" style="animation-delay:${200+k*250}ms">⭐</i>`).join('');
  $('#lvlWhy').textContent=lvl===LEVELS.length-1?t('allDone'):'';
  $('#lvlNext').hidden=lvl===LEVELS.length-1;
 }else{
  msg.textContent=t(why);buzz(200);play('fim');
  const hit=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(grid[y][x])hit.push([y,x,(N-1-y)*45+x*10]);
  await fxRun(hit,'fx-dead',500);await wait(reduce?0:450);if(g!==gen)return;
  $('#lvlEndTitle').textContent=t('lvlFail');$('#lvlStars').innerHTML='';
  $('#lvlWhy').textContent=t(why);$('#lvlNext').hidden=true;
 }
 busy=false;$('#lvlScore').textContent=score;show('lvlEnd');
}
