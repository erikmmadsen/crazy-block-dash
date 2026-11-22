// Crazy Block Dash · Início: carrega o save e monta o jogo (tem que ser o último arquivo)
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* início: carrega o save e depois monta o jogo */
drawBoard();
(async()=>{
 await loadData();
 best=bestAtStart=DATA.best;setNum(bestEl,best);
 muted=!DATA.sfx;musicOn=DATA.music;setLang(DATA.lang||detectLang(),false);
 if(loadGame()){hasGame=true;setNum(scoreEl,score);drawBoard();drawTray(false)}
 else makePieces();
 ready=true;show('menu');
 rankStatus().then(st=>{if(st.available)sendScore(best)}); // manda o recorde que já existia
})();
