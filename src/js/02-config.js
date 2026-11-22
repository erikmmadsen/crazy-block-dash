// Crazy Block Dash · Configuração: tabuleiro, cores, formatos de peça e peças especiais
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

const N=10,$=s=>document.querySelector(s);
const boardEl=$('#board'),trayEl=$('#tray'),scoreEl=$('#score'),bestEl=$('#best'),msg=$('#message'),ghost=$('#ghost');
const colors=['#59d8ff','#ff79bd','#a78bfa','#ffc45c','#6ee7a8','#ff7b69'];
const shapes=[[[0,0]],[[0,0],[0,1]],[[0,0],[1,0]],[[0,0],[0,1],[1,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[0,1],[0,2],[1,1]],[[0,0],[1,0],[1,1],[2,1]],[[0,1],[1,0],[1,1],[1,2]],
 [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], // 3x3
 [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]], // 2x3 deitado
 [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]], // 2x3 em pé
 [[0,0],[0,1],[0,2],[1,2],[2,2]], // L grande: 3 em cima e desce 2 pela direita (bloco.jpeg)
 [[0,0],[1,0],[2,0],[2,1]]]; // L: 3 em pé com o pé pra direita (blocos.jpeg)
const special=['Normal','Explosivo','Derrete','Areia','Ímã','Limpa tudo'];
const specialInfo={Explosivo:{icon:'💣',color:'#ff8a2b'},Derrete:{icon:'💧',color:'#54dfff'},Areia:{icon:'⏳',color:'#f8d879'},'Ímã':{icon:'🧲',color:'#ff5c76'},'Limpa tudo':{icon:'🧹',color:'#ffffff'}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const emptyGrid=()=>Array.from({length:N},()=>Array(N).fill(null));
function buzz(ms){try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}
