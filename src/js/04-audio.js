// Crazy Block Dash · Sons, música e botões de liga/desliga
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ===== SONS (pasta src/sounds/) =====
   v = qual versão do arquivo usar: o jogo carrega sounds/<nome>_<v>.mp3. vol = volume relativo.
   Em src/sounds/ ficam só os sons em uso. As outras versões (explosao e pecas_novas têm 1 a 4, os outros 1 e 2)
   ficam em recursos/sons-alternativos/: para trocar, mova o arquivo de lá para src/sounds/ e mude o v aqui.
   file = usa um arquivo com outro nome (ignora o v). max = duração máxima em segundos. fade = parte final que vai sumindo (0 a 1). */
const SFX={
 encaixar:{v:1,vol:.55}, pecas_novas:{v:3,vol:.4}, erro:{v:1,vol:.5}, linha:{v:1,vol:.8},
 explosao:{file:'bomba.mp4',vol:.6,max:2.5,fade:.2}, derrete:{v:1,vol:.7}, areia:{v:1,vol:.65}, ima:{v:1,vol:.7},
 limpa_tudo:{v:1,vol:.8}, fim:{v:1,vol:.75},
 voz_good:{v:2,vol:1.5}, voz_great:{v:2,vol:1.5}, voz_incredible:{v:1,vol:1.5}, voz_unstoppable:{v:2,vol:1.5}
};
const EFEITOS_VOL=2; // volume geral de TODOS os efeitos (1 = antigo, 2 = dobro). Um limitador evita que estoure.
let master=null;
let actx=null,muted=false; // vem do DATA ao abrir
const sounds={};
function initAudio(){
 if(actx)return;
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 actx=new AC();
 // volume geral -> limitador -> alto-falante (deixa mais alto sem distorcer)
 const lim=actx.createDynamicsCompressor();
 lim.threshold.value=-3;lim.knee.value=2;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.15;
 master=actx.createGain();master.gain.value=EFEITOS_VOL;
 master.connect(lim).connect(actx.destination);
 for(const k in SFX)loadSound(k);
}
async function loadSound(k){
 const url='sounds/'+encodeURIComponent(SFX[k].file||`${k}_${SFX[k].v}.mp3`);
 try{
  const buf=await actx.decodeAudioData(await (await fetch(url)).arrayBuffer());
  const d=buf.getChannelData(0);let peak=0,start=0;
  for(let i=0;i<d.length;i++){const a=Math.abs(d[i]);if(a>peak)peak=a}
  for(let i=0;i<d.length;i++)if(Math.abs(d[i])>peak*.08){start=Math.max(0,i/buf.sampleRate-.004);break} // pula o silêncio do começo
  // iguala pela altura média (RMS) da parte com som, sem deixar o pico estourar
  let sum=0,n=0;for(let i=Math.floor(start*buf.sampleRate);i<d.length;i++){const a=Math.abs(d[i]);if(a>peak*.05){sum+=a*a;n++}}
  const rms=n?Math.sqrt(sum/n):peak;
  sounds[k]={buf,start,norm:peak>0?Math.min(.18/rms,.95/peak):1};
 }catch(e){sounds[k]={el:new Audio(url)}} // reserva para quando o arquivo é aberto direto no navegador (file://)
}
function play(k,rate=1){
 if(muted||!actx||!sounds[k])return;
 if(actx.state==='suspended')actx.resume();
 const s=sounds[k],vol=SFX[k].vol;
 if(s.buf){
  const src=actx.createBufferSource(),g=actx.createGain();
  src.buffer=s.buf;src.playbackRate.value=rate;
  // envelope: entrada rápida e saída suave no final do som (nada corta seco)
  const t=actx.currentTime,len=Math.min((s.buf.duration-s.start)/rate,SFX[k].max||99),v=vol*s.norm,fade=SFX[k].fade??.35;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.006);
  g.gain.setValueAtTime(v,t+len*(1-fade));g.gain.linearRampToValueAtTime(0,t+len);src.stop(t+len+.05);
  src.connect(g).connect(master);src.start(t,s.start);
 }else{const a=s.el.cloneNode();a.volume=Math.min(1,vol*EFEITOS_VOL);a.playbackRate=rate;a.play().catch(()=>{});if(SFX[k].max)setTimeout(()=>a.pause(),SFX[k].max*1000/rate)}
}
/* ===== MÚSICA DE FUNDO (gerada no Higgsfield) ===== */
const MUSICA={file:'musica_1.mp3',vol:.3}; // vol = volume da música (0 a 1); fica mais baixa que os efeitos
const music=new Audio('sounds/'+MUSICA.file);music.loop=true;music.preload='auto';music.volume=0;
let musicOn=true,musicFade=null; // vem do DATA ao abrir
function fadeMusic(to,ms=800){
 clearInterval(musicFade);const from=music.volume,t0=performance.now();
 musicFade=setInterval(()=>{const p=Math.min(1,(performance.now()-t0)/ms);music.volume=from+(to-from)*p;if(p>=1){clearInterval(musicFade);if(to===0)music.pause()}},30);
}
function startMusic(){if(!musicOn||document.hidden)return;music.play().then(()=>fadeMusic(MUSICA.vol,1500)).catch(()=>{})}
/* botões de liga/desliga (aparecem no menu e na pausa) */
function drawToggles(){
 document.querySelectorAll('[data-toggle=music]').forEach(b=>{b.textContent=musicOn?t('music'):t('noMusic');b.classList.toggle('off',!musicOn)});
 document.querySelectorAll('[data-toggle=sfx]').forEach(b=>{b.textContent=muted?t('noSfx'):t('sfx');b.classList.toggle('off',muted)});
}
document.querySelectorAll('[data-toggle]').forEach(b=>b.addEventListener('click',()=>{
 initAudio();
 if(b.dataset.toggle==='music'){musicOn=!musicOn;musicOn?startMusic():fadeMusic(0,300)}
 else muted=!muted;
 DATA.music=musicOn;DATA.sfx=!muted;persist();
 drawToggles();
}));
drawToggles();

window.addEventListener('pointerdown',()=>{initAudio();startMusic()},{once:true,capture:true}); // o áudio só pode começar depois de um toque
document.addEventListener('visibilitychange',()=>{ // silencia tudo quando o app vai para segundo plano
 if(document.hidden){if(actx)actx.suspend();clearInterval(musicFade);music.pause()}
 else{if(actx)actx.resume();if(musicOn&&music.volume>0)music.play().catch(()=>{})}
});
