// Crazy Block Dash · Efeitos de tela: locutor (Good! Great!...), pontos subindo e +pontos
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

let shoutT;
function shout(k){ // mostra Good! / Great! / Incredible! / Unstoppable! em cima do tabuleiro
 const el=$('#shout'),r=boardEl.getBoundingClientRect(),txt=k.toUpperCase()+'!';
 clearTimeout(shoutT);el.className=k;el.style.top=(r.top+r.height*.26)+'px';
 const n={good:8,great:12,incredible:16,unstoppable:22}[k];
 let h='<div class="w"><i class="flash"></i><i class="ring"></i><i class="ring r2"></i>';
 [...txt].forEach((c,i)=>h+=`<span class="ch" style="--i:${i}">${c}</span>`);
 for(let i=0;i<n;i++){const a=i/n*6.283+Math.random()*.4,d=90+Math.random()*90;h+=`<i class="sp" style="--i:${i};--x:${Math.cos(a)*d*1.6|0}px;--y:${Math.sin(a)*d|0}px"></i>`}
 el.innerHTML=h+'</div>';el.style.display='block';
 shoutT=setTimeout(()=>{el.classList.add('out');shoutT=setTimeout(()=>el.style.display='none',400+txt.length*25)},1250);
}
function setNum(el,v){cancelAnimationFrame(el._raf);el._v=v;el.textContent=v}
function countTo(el,to,big){ // números sobem rolando até o valor novo
 cancelAnimationFrame(el._raf);const from=el._v??(+el.textContent||0);el._v=to;
 el.classList.remove('bump','big');void el.offsetWidth;el.classList.add('bump');if(big)el.classList.add('big');
 if(reduce){el.textContent=to;return}
 let t0=0;const ms=Math.min(900,250+Math.abs(to-from)*1.2);
 const step=now=>{if(!t0)t0=now;const p=Math.max(0,Math.min(1,(now-t0)/ms)),e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)el._raf=requestAnimationFrame(step)};
 el._raf=requestAnimationFrame(step);
}
function popPoints(n,at,cls){ // +pontos flutuando de onde a jogada aconteceu
 if(!at)return;const r=boardEl.getBoundingClientRect(),cw=(r.width-14)/N;
 const d=document.createElement('div');d.className='pts '+(cls||'')+(n<0?' neg':'')+(n>=600?' big':'');
 d.innerHTML=(n>0?'+':'')+n+(n>0&&triples>1?`<small>X${triples}</small>`:'');
 d.style.left=Math.max(50,Math.min(innerWidth-50,r.left+7+(at[1]+.5)*cw))+'px';d.style.top=(r.top+7+(at[0]+.5)*cw)+'px';
 document.body.appendChild(d);setTimeout(()=>d.remove(),1000);
}
function addPoints(n,at,cls){if(n>0)n*=Math.max(1,triples); // multiplicador X2, X3... dos combos triplos
 score+=n;popPoints(n,at,cls);countTo(scoreEl,score,n>=200);if(mode==='classic'&&score>best){best=score;countTo(bestEl,best,n>=200);saveBest()}if(mode==='level')drawGoal()}
