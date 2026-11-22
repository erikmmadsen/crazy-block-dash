// Crazy Block Dash · Tabuleiro, bandeja de peças, prévia e arrastar
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

function drawBoard(){
 boardEl.innerHTML='';cellEls=[];
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const v=grid[r][c],d=document.createElement('div');
  d.className='cell'+(v?' filled':'')+(v&&v.sand?' sand':'');
  if(v)d.style.setProperty('--c',v.color);
  boardEl.append(d);cellEls.push(d);
 }
}
const cellEl=(y,x)=>cellEls[y*N+x];

/* aplica uma animação em vários blocos. list: [linha,coluna,atrasoMs,{vars css}] */
function fxRun(list,cls,dur){
 let maxD=0;
 list.forEach(([y,x,d=0,vars])=>{const el=cellEl(y,x);if(!el)return;el.style.setProperty('--d',d+'ms');if(vars)for(const k in vars)el.style.setProperty(k,vars[k]);el.classList.add(cls);maxD=Math.max(maxD,d)});
 return wait(reduce?40:dur+maxD+30);
}

function makePieces(){
 pieces=Array.from({length:3},()=>({shape:shapes[Math.floor(Math.random()*shapes.length)],type:Math.random()<.20?special[1+Math.floor(Math.random()*5)]:'Normal',color:colors[Math.floor(Math.random()*colors.length)],used:false}));
 drawTray(true);play('pecas_novas');
}
function miniFor(p,cols,size){
 const m=document.createElement('div');m.className='mini';
 if(size){m.style.gridTemplateColumns=`repeat(${cols},${size}px)`;m.style.gridAutoRows=size+'px';m.style.gap=getComputedStyle(boardEl).columnGap;m.style.setProperty('--icfs',(size*.55|0)+'px')}
 const ic=p.type!=='Normal'&&specialInfo[p.type]?specialInfo[p.type].icon:'';
 const rows=Math.max(...p.shape.map(s=>s[0]))+1;let k=0;
 for(let r=0;r<(size?rows:3);r++)for(let c=0;c<(size?cols:3);c++){
  const i=document.createElement('i');
  if(p.shape.some(s=>s[0]===r&&s[1]===c)){i.style.setProperty('--pc',p.color);if(ic)i.dataset.ic=ic;i.style.setProperty('--d',(k++*45)+'ms')}else i.className='empty';
  m.append(i);
 }
 return m;
}
function drawTray(fresh){
 trayEl.innerHTML='';
 pieces.forEach((p,i)=>{
  const box=document.createElement('div');
  box.className='piece'+(p.used?' used':'')+(fresh?' new':'')+(p.type!=='Normal'?' special':'');
  if(p.type!=='Normal'){box.style.setProperty('--sc',specialInfo[p.type].color);const tg=document.createElement('span'),nm=t('name_'+special.indexOf(p.type));tg.className='tag';tg.innerHTML=`<b>${specialInfo[p.type].icon}</b><span>${nm}</span>`;tg.title=nm;box.append(tg)}
  box.append(miniFor(p));
  box.addEventListener('pointerdown',e=>startDrag(e,i));
  trayEl.append(box);
 });
}

function canPlace(p,r,c){return p.shape.every(([y,x])=>r+y>=0&&r+y<N&&c+x>=0&&c+x<N&&!grid[r+y][c+x])}
function clearPreview(){cellEls.forEach(x=>x.classList.remove('preview-valid','preview-invalid','preview-line'));boardEl.querySelectorAll('.line-hl').forEach(e=>e.remove())}
function outlineLine(cells){ // contorna as casas de uma linha ou coluna inteira
 const a=cells[0],b=cells[cells.length-1],o=document.createElement('div');o.className='line-hl';
 const pad=3;o.style.left=(a.offsetLeft-pad)+'px';o.style.top=(a.offsetTop-pad)+'px';
 o.style.width=(b.offsetLeft+b.offsetWidth-a.offsetLeft+pad*2)+'px';o.style.height=(b.offsetTop+b.offsetHeight-a.offsetTop+pad*2)+'px';
 boardEl.append(o);cells.forEach(e=>e.classList.add('preview-line'));
}
function preview(p,r,c){clearPreview();const ok=canPlace(p,r,c);p.shape.forEach(([y,x])=>{if(r+y>=0&&r+y<N&&c+x>=0&&c+x<N)cellEl(r+y,c+x).classList.add(ok?'preview-valid':'preview-invalid')});
 if(ok){ // mostra quais linhas e colunas vão ser completadas
  const will=(y,x)=>grid[y][x]||p.shape.some(([dy,dx])=>r+dy===y&&c+dx===x),idx=[...Array(N).keys()];
  idx.forEach(y=>{if(idx.every(x=>will(y,x)))outlineLine(idx.map(x=>cellEl(y,x)))});
  idx.forEach(x=>{if(idx.every(y=>will(y,x)))outlineLine(idx.map(y=>cellEl(y,x)))});
 }
 return ok}

/* ---------- arrastar: a peça fantasma tem o tamanho real das casas e fica acima do dedo ---------- */
function startDrag(e,i){
 if(busy||pieces[i].used)return;e.preventDefault();
 const p=pieces[i],a=cellEls[0].getBoundingClientRect(),b=cellEls[1].getBoundingClientRect();
 const cols=Math.max(...p.shape.map(s=>s[1]))+1;
 drag={i,p,row:null,col:null,valid:false,size:a.width,step:b.left-a.left};
 ghost.innerHTML='';ghost.append(miniFor(p,cols,a.width));ghost.style.display='block';
 trayEl.children[i].classList.add('lifted');
 moveDrag(e);
 window.addEventListener('pointermove',moveDrag);
 window.addEventListener('pointerup',endDrag,{once:true});
 window.addEventListener('pointercancel',cancelDrag,{once:true});
}
function moveDrag(e){
 if(!drag)return;
 const gw=ghost.offsetWidth,gh=ghost.offsetHeight,lift=e.pointerType==='mouse'?gh/2:gh+30;
 const gx=e.clientX-gw/2,gy=e.clientY-lift;
 ghost.style.left=gx+'px';ghost.style.top=gy+'px';
 const br=boardEl.getBoundingClientRect(),o=cellEls[0].getBoundingClientRect();
 const cx=gx+gw/2,cy=gy+gh/2;
 if(cx<br.left||cx>br.right||cy<br.top||cy>br.bottom){clearPreview();drag.row=drag.col=null;drag.valid=false;return}
 const c=Math.round((gx-o.left)/drag.step),r=Math.round((gy-o.top)/drag.step);
 if(r===drag.row&&c===drag.col)return;
 drag.row=r;drag.col=c;drag.valid=preview(drag.p,r,c);
}
function stopDrag(){ghost.style.display='none';clearPreview();window.removeEventListener('pointermove',moveDrag);window.removeEventListener('pointercancel',cancelDrag);const t=drag&&trayEl.children[drag.i];if(t)t.classList.remove('lifted');const d=drag;drag=null;return d}
function endDrag(){if(!drag)return;const d=stopDrag();if(d.valid)placePiece(d.i,d.row,d.col);else if(d.row!==null){msg.textContent=t('dropGreen');play('erro')}}
function cancelDrag(){if(drag)stopDrag()}
