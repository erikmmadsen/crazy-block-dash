// Crazy Block Dash · Jogada: encaixar peça, peças especiais, linhas, combos, rubis e fim de jogo
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ---------- jogada ---------- */
async function placePiece(i,r,c){
 const p=pieces[i],g=gen;
 if(!canPlace(p,r,c)){msg.textContent=t('occupied');return}
 busy=true;p.used=true;drawTray(false);
 const fx=async(...a)=>{await fxRun(...a);if(g!==gen)throw 'cancelado'}; // para no meio se começou outra partida
 try{
 const cells=p.shape.map(([y,x])=>[r+y,c+x]);
 const midY=cells.reduce((s,a)=>s+a[0],0)/cells.length,midX=cells.reduce((s,a)=>s+a[1],0)/cells.length;
 cells.forEach(([y,x])=>grid[y][x]={color:p.color,sand:false});
 addPoints(p.shape.length*10,[midY,midX]);
 drawBoard();play('encaixar',.95+Math.random()*.12);
 await fx(cells.map(([y,x],k)=>[y,x,k*35]),'fx-land',340);

 if(p.type==='Explosivo'){
  const hit=new Map();
  cells.forEach(([a,b])=>{for(let y=a-1;y<=a+1;y++)for(let x=b-1;x<=b+1;x++)if(y>=0&&y<N&&x>=0&&x<N&&grid[y][x])hit.set(y*N+x,[y,x])});
  msg.textContent=t('boom');buzz([30,40,60]);setTimeout(()=>play('explosao'),reduce?0:300);
  await fx([...hit.values()].map(([y,x])=>[y,x,Math.max(Math.abs(y-midY),Math.abs(x-midX))*70,{'--rot':(Math.random()*80-40|0)+'deg'}]),'fx-explode',600);
  hit.forEach(([y,x])=>grid[y][x]=null);addPoints(-10,[midY,midX]);drawBoard();
 }
 if(p.type==='Derrete'){
  const hit=[];for(let y=r;y<Math.min(N,r+2);y++)for(let x=c;x<Math.min(N,c+2);x++)if(grid[y][x])hit.push([y,x]);
  msg.textContent=t('melted');play('derrete');
  await fx(hit.map(([y,x])=>[y,x,(x-c)*60+(y-r)*120]),'fx-melt',750);
  hit.forEach(([y,x])=>grid[y][x]=null);drawBoard();
 }
 if(p.type==='Areia'){
  const hit=[];
  for(let y=Math.max(0,r-1);y<=Math.min(N-1,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(N-1,c+1);x++)if(grid[y][x]){grid[y][x]={color:'#e6b75d',sand:true};hit.push([y,x])}
  msg.textContent=t('sanded');drawBoard();play('areia');
  await fx(hit.map(([y,x])=>[y,x,(Math.random()*120)|0]),'fx-sandify',450);
  const moved=[];
  for(let x=0;x<N;x++){
   const vals=[];for(let y=N-1;y>=0;y--)if(grid[y][x])vals.push([grid[y][x],y]);
   for(let y=N-1;y>=0;y--){const v=vals[N-1-y];grid[y][x]=v?v[0]:null;if(v&&v[1]!==y)moved.push([y,x,x*15,{'--fy':v[1]-y}])}
  }
  drawBoard();if(moved.length)await fx(moved,'fx-fall',450);
 }
 if(p.type==='Ímã'){
  const found=[];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(grid[y][x]&&Math.max(Math.abs(y-r),Math.abs(x-c))<=2&&!(y>=r&&y<r+2&&x>=c&&x<c+2))found.push([y,x,grid[y][x]]);
  msg.textContent=t('magnet');play('ima');
  await fx(found.map(([y,x])=>[y,x,0]).concat(cells.map(([y,x])=>[y,x,0])),'fx-magnet',500);
  const moved=[];
  found.forEach(([y,x,v])=>{const ny=Math.max(0,y-1);if(ny!==y&&!grid[ny][x]){grid[ny][x]=v;grid[y][x]=null;moved.push([ny,x,0,{'--fy':1}])}});
  drawBoard();if(moved.length)await fx(moved,'fx-fall',450);
 }
 if(p.type==='Limpa tudo'){
  const hit=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(grid[y][x])hit.push([y,x,(y+x)*28]);
  msg.textContent=t('cleared');buzz(80);play('limpa_tudo');
  await fx(hit,'fx-wipe',500);
  grid=emptyGrid();addPoints(300,[4.5,4.5],'lines');drawBoard();
 }

 /* linhas e colunas completas */
 const rows=[],colsFull=[];
 for(let y=0;y<N;y++)if(grid[y].every(Boolean))rows.push(y);
 for(let x=0;x<N;x++)if(grid.every(row=>row[x]))colsFull.push(x);
 const lines=rows.length+colsFull.length;
 if(lines){
  const hit=new Map(),put=(y,x,d)=>{const k=y*N+x;if(!hit.has(k)||hit.get(k)[2]>d)hit.set(k,[y,x,d])};
  rows.forEach(y=>{for(let x=0;x<N;x++)put(y,x,Math.abs(x-midX)*35)});
  colsFull.forEach(x=>{for(let y=0;y<N;y++)put(y,x,Math.abs(y-midY)*35)});
  buzz(lines>1?[40,30,40]:40);play('linha',Math.min(1.5,1+(lines-1)*.12)); // combo = som mais agudo
  const voz=lines>=4?'voz_unstoppable':lines===3?'voz_incredible':lines===2?'voz_great':'voz_good';
  setTimeout(()=>{play(voz);shout(voz.slice(4))},reduce?0:180); // locutor: Good / Great / Incredible / Unstoppable + texto na tela
  await fx([...hit.values()],'fx-clear',420);
  hit.forEach(([y,x])=>grid[y][x]=null);
  addPoints(lines*100,[rows.length?rows.reduce((a,b)=>a+b)/rows.length:midY,colsFull.length?colsFull.reduce((a,b)=>a+b)/colsFull.length:midX],'lines');drawBoard();
 }
 if(lines)msg.textContent=lines>1?t('combo',lines):t('oneLine');
 if(lines>=3){triples++;celebrate(triples);drawMult()} // combo triplo: os personagens comemoram
 if(lines>=3&&!gems){ // combo triplo: os blocos viram rubis
  setGems(true);msg.textContent=t('ruby');buzz([30,40,30,40,60]);play('limpa_tudo',1.25);
  const all=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(grid[y][x])all.push([y,x,(y+x)*30]);
  drawTray(false);await fx(all,'fx-gem',600);drawBoard();
 }
 else if(p.type==='Normal')msg.textContent=t('keepGoing');

 if(pieces.every(x=>x.used))makePieces();
 busy=false;
 if(mode==='level')await levelAfterMove(g,lines);
 else if(!pieces.some(x=>!x.used&&findAny(x)))await gameOver(g);else saveGame();
 }catch(e){if(e!=='cancelado')throw e}
}
function celebrate(n){
 const el=$('#party');clearTimeout(partyTimer);
 el.classList.remove('on','out');void el.offsetWidth; // reinicia as animações
 $('#partyMult').textContent='X'+n;
 el.querySelectorAll('.conf').forEach(c=>c.remove());
 const cols=['#64f59b','#ff79bd','#ffe066','#59d8ff','#a78bfa','#ff7b69'];
 for(let i=0;i<28;i++){const c=document.createElement('i');c.className='conf';const left=i%2===0;
  c.style.cssText=`--cc:${cols[i%6]};--dx:${(left?-1:1)*(40+Math.random()*150)}px;--dy:${-230+Math.random()*330}px;--cd:${250+Math.random()*450}ms`;el.prepend(c)}
 el.classList.add('on');buzz([40,60,40,60,80]);
 partyTimer=setTimeout(()=>{el.classList.add('out');partyTimer=setTimeout(hideParty,350)},reduce?1200:2600);
}
function drawMult(){const b=$('#multBadge');if(!b)return;b.hidden=triples<2;b.textContent='x'+triples;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
function hideParty(){clearTimeout(partyTimer);const el=$('#party');if(el)el.classList.remove('on','out')}
function setGems(on){gems=on;document.body.classList.toggle('gems',on);
 try{const SB=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.SystemBars;if(SB)SB.setStyle({style:on?'LIGHT':'DARK'}).catch(()=>{})}catch(e){} // ícones da barra do Android escuros no fundo claro
}
function findAny(p){for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(canPlace(p,r,c))return true;return false}
async function gameOver(g){
 busy=true;hasGame=false;clearSave();sendScore(score);
 msg.textContent=t('gameOverMsg');buzz(200);play('fim');if(musicOn&&!music.paused)fadeMusic(MUSICA.vol*.35,600);
 const hit=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(grid[y][x])hit.push([y,x,(N-1-y)*45+x*10]);
 await fxRun(hit,'fx-dead',500);await wait(reduce?0:450);
 if(g!==gen)return;
 busy=false;
 $('#overScore').textContent=score;$('#overBest').textContent=best;
 $('#newRec').hidden=!(score>bestAtStart&&score>0);
 show('over');
}

/* ===== PARTIDA ===== */
function newGame(){
 gen++;busy=false;if(drag)stopDrag();
 grid=emptyGrid();score=0;setNum(scoreEl,0);bestAtStart=best;msg.textContent='';setGems(false);triples=0;drawMult();hideParty();
 hasGame=true;drawBoard();makePieces();saveGame();
 if(musicOn&&!music.paused)fadeMusic(MUSICA.vol,600);
}
