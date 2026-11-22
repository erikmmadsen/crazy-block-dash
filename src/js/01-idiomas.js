// Crazy Block Dash · Idiomas: textos nos 5 idiomas (TXT) e troca de idioma
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ===== IDIOMAS ===== */
const LANGS=[['pt-BR','🇧🇷','Português (Brasil)'],['pt-PT','🇵🇹','Português (Portugal)'],['en','🇺🇸','English'],['fr','🇫🇷','Français'],['es','🇪🇸','Español']];
const TXT={
'pt-BR':{devBy:'Desenvolvido por',rankBtn:'🏆 Placar mundial',rankTitle:'PLACAR MUNDIAL',rankSoon:'O placar mundial vai funcionar quando o jogo estiver na Play Store. Lá você vai ver quem fez mais pontos no mundo todo!',rankFail:'Não foi possível entrar no Google Play Games. Confira a internet e tente de novo.',rankBest:'Seu recorde:',levelsBtn:'🗺️ Fases',levelsTitle:'FASES',level:'FASE',goalLines:'Limpe {n} linhas',goalScore:'Faça {n} pontos',piecesLeft:'Peças',lvlWin:'FASE CONCLUÍDA!',lvlFail:'NÃO FOI DESSA VEZ',nextLvl:'▶ Próxima fase',retry:'↻ Tentar de novo',noPieces:'Acabaram as peças!',noSpace:'Sem espaço para as peças!',allDone:'🏆 Você venceu todas as fases!',lvlRestart:'↻ Reiniciar fase',r6:'Cada combo triplo aumenta o <b>multiplicador</b> (X2, X3, X4...), que multiplica todos os pontos que você ganhar até o fim da partida!',pauseAria:'Pausar',boardAria:'Tabuleiro 10 por 10',points:'PONTOS',best:'RECORDE',hint:'Arraste uma peça para o tabuleiro',menuBest:'🏆 Recorde:',
 play:'▶ JOGAR',cont:'▶ CONTINUAR',newGame:'↻ Novo jogo',howtoBtn:'❓ Como jogar',langBtn:'🌐 Idiomas',paused:'PAUSADO',resume:'▶ Continuar',restart:'↻ Reiniciar',mainMenu:'⌂ Menu principal',
 overTitle:'FIM DE JOGO',newRecord:'🏆 NOVO RECORDE!',again:'↻ Jogar de novo',howtoTitle:'COMO JOGAR',
 r1:'Arraste as peças para o tabuleiro. Ela aparece acima do dedo para você ver onde vai encaixar.',
 r2:'Complete uma <b>linha</b> ou <b>coluna</b> para limpar e ganhar <b>100 pontos</b>. Várias de uma vez = <b>combo</b>!',
 r3:'Faça um <b>combo triplo</b> (3 linhas de uma vez) e os blocos viram <b>rubis</b> ♦️ até o fim da partida!',
 r4:'Cada bloco encaixado vale <b>10 pontos</b>.',r5:'Quando nenhuma peça couber mais, o jogo acaba.',
 specialsTitle:'Peças especiais',
 sExp:'<b>Explosivo:</b> destrói os blocos em volta da peça.',sMelt:'<b>Derrete:</b> derrete um quadrado 2×2 onde você soltar.',
 sSand:'<b>Areia:</b> vira areia em volta e os blocos do tabuleiro caem.',sMag:'<b>Ímã:</b> puxa os blocos próximos uma casa para cima.',
 sClear:'<b>Limpa tudo:</b> apaga o tabuleiro inteiro e dá +300 pontos.',gotIt:'Entendi!',
 music:'🎵 Música',noMusic:'🎵 Sem música',sfx:'🔊 Efeitos',noSfx:'🔇 Sem efeitos',langTitle:'IDIOMAS',back:'← Voltar',
 dropGreen:'Solte a peça em uma posição verde!',occupied:'Essa posição está ocupada!',boom:'💣 BOOM!',melted:'💧 Derreteu!',sanded:'⏳ Virou areia!',
 magnet:'🧲 Ímã ativado!',cleared:'🧹 Limpou tudo! +300 pontos',combo:'Combo! Você limpou {n} linhas!',oneLine:'Boa! Você limpou 1 linha!',
 ruby:'♦️ Combo triplo! Os blocos viraram rubis!',keepGoing:'Boa! Continue encaixando.',gameOverMsg:'Fim de jogo!',
 name_1:'Explosivo',name_2:'Derrete',name_3:'Areia',name_4:'Ímã',name_5:'Limpa tudo'},
'pt-PT':{devBy:'Desenvolvido por',rankBtn:'🏆 Classificação mundial',rankTitle:'CLASSIFICAÇÃO MUNDIAL',rankSoon:'A classificação mundial vai funcionar quando o jogo estiver na Play Store. Aí vais ver quem fez mais pontos no mundo inteiro!',rankFail:'Não foi possível entrar no Google Play Jogos. Verifica a internet e tenta outra vez.',rankBest:'O teu recorde:',levelsBtn:'🗺️ Níveis',levelsTitle:'NÍVEIS',level:'NÍVEL',goalLines:'Limpa {n} linhas',goalScore:'Faz {n} pontos',piecesLeft:'Peças',lvlWin:'NÍVEL CONCLUÍDO!',lvlFail:'NÃO FOI DESTA VEZ',nextLvl:'▶ Próximo nível',retry:'↻ Tentar outra vez',noPieces:'Acabaram as peças!',noSpace:'Sem espaço para as peças!',allDone:'🏆 Venceste todos os níveis!',lvlRestart:'↻ Reiniciar nível',r6:'Cada combo triplo aumenta o <b>multiplicador</b> (X2, X3, X4...), que multiplica todos os pontos que ganhares até ao fim do jogo!',pauseAria:'Pausa',boardAria:'Tabuleiro 10 por 10',points:'PONTOS',best:'RECORDE',hint:'Arrasta uma peça para o tabuleiro',menuBest:'🏆 Recorde:',
 play:'▶ JOGAR',cont:'▶ CONTINUAR',newGame:'↻ Novo jogo',howtoBtn:'❓ Como jogar',langBtn:'🌐 Idiomas',paused:'PAUSA',resume:'▶ Continuar',restart:'↻ Recomeçar',mainMenu:'⌂ Menu principal',
 overTitle:'FIM DO JOGO',newRecord:'🏆 NOVO RECORDE!',again:'↻ Jogar outra vez',howtoTitle:'COMO JOGAR',
 r1:'Arrasta as peças para o tabuleiro. A peça aparece acima do dedo para veres onde vai encaixar.',
 r2:'Completa uma <b>linha</b> ou <b>coluna</b> para a limpar e ganhar <b>100 pontos</b>. Várias de uma vez = <b>combo</b>!',
 r3:'Faz um <b>combo triplo</b> (3 linhas de uma vez) e os blocos transformam-se em <b>rubis</b> ♦️ até ao fim do jogo!',
 r4:'Cada bloco encaixado vale <b>10 pontos</b>.',r5:'Quando já não couber nenhuma peça, o jogo acaba.',
 specialsTitle:'Peças especiais',
 sExp:'<b>Explosivo:</b> destrói os blocos à volta da peça.',sMelt:'<b>Derrete:</b> derrete um quadrado 2×2 onde largares a peça.',
 sSand:'<b>Areia:</b> transforma tudo à volta em areia e os blocos do tabuleiro caem.',sMag:'<b>Íman:</b> puxa os blocos próximos uma casa para cima.',
 sClear:'<b>Limpa tudo:</b> apaga o tabuleiro inteiro e dá +300 pontos.',gotIt:'Percebi!',
 music:'🎵 Música',noMusic:'🎵 Sem música',sfx:'🔊 Efeitos',noSfx:'🔇 Sem efeitos',langTitle:'IDIOMAS',back:'← Voltar',
 dropGreen:'Larga a peça numa posição verde!',occupied:'Essa posição está ocupada!',boom:'💣 BUM!',melted:'💧 Derreteu!',sanded:'⏳ Transformou-se em areia!',
 magnet:'🧲 Íman ativado!',cleared:'🧹 Limpaste tudo! +300 pontos',combo:'Combo! Limpaste {n} linhas!',oneLine:'Boa! Limpaste 1 linha!',
 ruby:'♦️ Combo triplo! Os blocos transformaram-se em rubis!',keepGoing:'Boa! Continua a encaixar.',gameOverMsg:'Fim do jogo!',
 name_1:'Explosivo',name_2:'Derrete',name_3:'Areia',name_4:'Íman',name_5:'Limpa tudo'},
'en':{devBy:'Developed by',rankBtn:'🏆 World ranking',rankTitle:'WORLD RANKING',rankSoon:'The world ranking will work once the game is on the Play Store. There you will see who scored the most points worldwide!',rankFail:'Could not sign in to Google Play Games. Check your internet and try again.',rankBest:'Your best:',levelsBtn:'🗺️ Levels',levelsTitle:'LEVELS',level:'LEVEL',goalLines:'Clear {n} lines',goalScore:'Score {n} points',piecesLeft:'Pieces',lvlWin:'LEVEL COMPLETE!',lvlFail:'SO CLOSE!',nextLvl:'▶ Next level',retry:'↻ Try again',noPieces:'Out of pieces!',noSpace:'No room for the pieces!',allDone:'🏆 You beat every level!',lvlRestart:'↻ Restart level',r6:'Each triple combo raises the <b>multiplier</b> (X2, X3, X4...), which multiplies every point you earn until the end of the game!',pauseAria:'Pause',boardAria:'10 by 10 board',points:'SCORE',best:'BEST',hint:'Drag a piece onto the board',menuBest:'🏆 Best:',
 play:'▶ PLAY',cont:'▶ CONTINUE',newGame:'↻ New game',howtoBtn:'❓ How to play',langBtn:'🌐 Languages',paused:'PAUSED',resume:'▶ Resume',restart:'↻ Restart',mainMenu:'⌂ Main menu',
 overTitle:'GAME OVER',newRecord:'🏆 NEW RECORD!',again:'↻ Play again',howtoTitle:'HOW TO PLAY',
 r1:'Drag the pieces onto the board. The piece appears above your finger so you can see where it will fit.',
 r2:'Complete a <b>row</b> or <b>column</b> to clear it and earn <b>100 points</b>. Several at once = <b>combo</b>!',
 r3:'Make a <b>triple combo</b> (3 lines at once) and the blocks turn into <b>rubies</b> ♦️ until the end of the game!',
 r4:'Each block you place is worth <b>10 points</b>.',r5:'When no piece fits anymore, the game is over.',
 specialsTitle:'Special pieces',
 sExp:'<b>Explosive:</b> destroys the blocks around the piece.',sMelt:'<b>Melt:</b> melts a 2×2 square where you drop it.',
 sSand:'<b>Sand:</b> turns the area around it into sand and the blocks on the board fall down.',sMag:'<b>Magnet:</b> pulls nearby blocks up one space.',
 sClear:'<b>Clear all:</b> wipes the whole board and gives +300 points.',gotIt:'Got it!',
 music:'🎵 Music',noMusic:'🎵 No music',sfx:'🔊 Sounds',noSfx:'🔇 No sounds',langTitle:'LANGUAGES',back:'← Back',
 dropGreen:'Drop the piece on a green spot!',occupied:'That spot is taken!',boom:'💣 BOOM!',melted:'💧 Melted!',sanded:'⏳ Turned to sand!',
 magnet:'🧲 Magnet on!',cleared:'🧹 All clear! +300 points',combo:'Combo! You cleared {n} lines!',oneLine:'Nice! You cleared 1 line!',
 ruby:'♦️ Triple combo! The blocks turned into rubies!',keepGoing:'Nice! Keep going.',gameOverMsg:'Game over!',
 name_1:'Explosive',name_2:'Melt',name_3:'Sand',name_4:'Magnet',name_5:'Clear all'},
'fr':{devBy:'Développé par',rankBtn:'🏆 Classement mondial',rankTitle:'CLASSEMENT MONDIAL',rankSoon:'Le classement mondial fonctionnera quand le jeu sera sur le Play Store. Tu y verras qui a fait le plus de points dans le monde !',rankFail:'Impossible de se connecter à Google Play Jeux. Vérifie ta connexion et réessaie.',rankBest:'Ton record :',levelsBtn:'🗺️ Niveaux',levelsTitle:'NIVEAUX',level:'NIVEAU',goalLines:'Efface {n} lignes',goalScore:'Fais {n} points',piecesLeft:'Pièces',lvlWin:'NIVEAU RÉUSSI !',lvlFail:'PRESQUE !',nextLvl:'▶ Niveau suivant',retry:'↻ Réessayer',noPieces:'Plus de pièces !',noSpace:'Plus de place pour les pièces !',allDone:'🏆 Tu as réussi tous les niveaux !',lvlRestart:'↻ Recommencer le niveau',r6:'Chaque combo triple augmente le <b>multiplicateur</b> (X2, X3, X4...), qui multiplie tous les points que tu gagnes jusqu’à la fin de la partie !',pauseAria:'Pause',boardAria:'Plateau de 10 sur 10',points:'POINTS',best:'RECORD',hint:'Glisse une pièce sur le plateau',menuBest:'🏆 Record :',
 play:'▶ JOUER',cont:'▶ CONTINUER',newGame:'↻ Nouvelle partie',howtoBtn:'❓ Comment jouer',langBtn:'🌐 Langues',paused:'PAUSE',resume:'▶ Reprendre',restart:'↻ Recommencer',mainMenu:'⌂ Menu principal',
 overTitle:'PARTIE TERMINÉE',newRecord:'🏆 NOUVEAU RECORD !',again:'↻ Rejouer',howtoTitle:'COMMENT JOUER',
 r1:'Glisse les pièces sur le plateau. La pièce apparaît au-dessus de ton doigt pour que tu voies où elle va se placer.',
 r2:'Complète une <b>ligne</b> ou une <b>colonne</b> pour l’effacer et gagner <b>100 points</b>. Plusieurs à la fois = <b>combo</b> !',
 r3:'Fais un <b>combo triple</b> (3 lignes à la fois) et les blocs se transforment en <b>rubis</b> ♦️ jusqu’à la fin de la partie !',
 r4:'Chaque bloc posé vaut <b>10 points</b>.',r5:'Quand plus aucune pièce ne rentre, la partie est terminée.',
 specialsTitle:'Pièces spéciales',
 sExp:'<b>Explosif :</b> détruit les blocs autour de la pièce.',sMelt:'<b>Fonte :</b> fait fondre un carré 2×2 là où tu la lâches.',
 sSand:'<b>Sable :</b> transforme les alentours en sable et les blocs du plateau tombent.',sMag:'<b>Aimant :</b> fait monter d’une case les blocs proches.',
 sClear:'<b>Tout effacer :</b> vide tout le plateau et donne +300 points.',gotIt:'Compris !',
 music:'🎵 Musique',noMusic:'🎵 Sans musique',sfx:'🔊 Effets',noSfx:'🔇 Sans effets',langTitle:'LANGUES',back:'← Retour',
 dropGreen:'Lâche la pièce sur une case verte !',occupied:'Cette case est occupée !',boom:'💣 BOUM !',melted:'💧 Fondu !',sanded:'⏳ Transformé en sable !',
 magnet:'🧲 Aimant activé !',cleared:'🧹 Tout effacé ! +300 points',combo:'Combo ! Tu as effacé {n} lignes !',oneLine:'Bien ! Tu as effacé 1 ligne !',
 ruby:'♦️ Combo triple ! Les blocs sont devenus des rubis !',keepGoing:'Bien ! Continue comme ça.',gameOverMsg:'Partie terminée !',
 name_1:'Explosif',name_2:'Fonte',name_3:'Sable',name_4:'Aimant',name_5:'Tout effacer'},
'es':{devBy:'Desarrollado por',rankBtn:'🏆 Ranking mundial',rankTitle:'RANKING MUNDIAL',rankSoon:'El ranking mundial funcionará cuando el juego esté en Play Store. ¡Allí verás quién hizo más puntos en todo el mundo!',rankFail:'No se pudo iniciar sesión en Google Play Juegos. Revisa tu conexión e inténtalo de nuevo.',rankBest:'Tu récord:',levelsBtn:'🗺️ Niveles',levelsTitle:'NIVELES',level:'NIVEL',goalLines:'Limpia {n} líneas',goalScore:'Haz {n} puntos',piecesLeft:'Piezas',lvlWin:'¡NIVEL SUPERADO!',lvlFail:'¡CASI!',nextLvl:'▶ Siguiente nivel',retry:'↻ Intentar de nuevo',noPieces:'¡Sin piezas!',noSpace:'¡No caben las piezas!',allDone:'🏆 ¡Superaste todos los niveles!',lvlRestart:'↻ Reiniciar nivel',r6:'Cada combo triple sube el <b>multiplicador</b> (X2, X3, X4...), que multiplica todos los puntos que ganes hasta el final de la partida.',pauseAria:'Pausa',boardAria:'Tablero de 10 por 10',points:'PUNTOS',best:'RÉCORD',hint:'Arrastra una pieza al tablero',menuBest:'🏆 Récord:',
 play:'▶ JUGAR',cont:'▶ CONTINUAR',newGame:'↻ Nueva partida',howtoBtn:'❓ Cómo jugar',langBtn:'🌐 Idiomas',paused:'PAUSA',resume:'▶ Continuar',restart:'↻ Reiniciar',mainMenu:'⌂ Menú principal',
 overTitle:'FIN DEL JUEGO',newRecord:'🏆 ¡NUEVO RÉCORD!',again:'↻ Jugar otra vez',howtoTitle:'CÓMO JUGAR',
 r1:'Arrastra las piezas al tablero. La pieza aparece encima de tu dedo para que veas dónde va a encajar.',
 r2:'Completa una <b>fila</b> o <b>columna</b> para limpiarla y ganar <b>100 puntos</b>. Varias a la vez = ¡<b>combo</b>!',
 r3:'Haz un <b>combo triple</b> (3 líneas a la vez) y los bloques se convierten en <b>rubíes</b> ♦️ ¡hasta el final de la partida!',
 r4:'Cada bloque colocado vale <b>10 puntos</b>.',r5:'Cuando ya no cabe ninguna pieza, el juego termina.',
 specialsTitle:'Piezas especiales',
 sExp:'<b>Explosivo:</b> destruye los bloques alrededor de la pieza.',sMelt:'<b>Derrite:</b> derrite un cuadrado de 2×2 donde la sueltes.',
 sSand:'<b>Arena:</b> convierte en arena los alrededores y los bloques del tablero caen.',sMag:'<b>Imán:</b> sube una casilla los bloques cercanos.',
 sClear:'<b>Limpia todo:</b> borra todo el tablero y da +300 puntos.',gotIt:'¡Entendido!',
 music:'🎵 Música',noMusic:'🎵 Sin música',sfx:'🔊 Efectos',noSfx:'🔇 Sin efectos',langTitle:'IDIOMAS',back:'← Volver',
 dropGreen:'¡Suelta la pieza en una posición verde!',occupied:'¡Esa posición está ocupada!',boom:'💣 ¡BUM!',melted:'💧 ¡Se derritió!',sanded:'⏳ ¡Se volvió arena!',
 magnet:'🧲 ¡Imán activado!',cleared:'🧹 ¡Todo limpio! +300 puntos',combo:'¡Combo! ¡Limpiaste {n} líneas!',oneLine:'¡Bien! Limpiaste 1 línea.',
 ruby:'♦️ ¡Combo triple! ¡Los bloques se volvieron rubíes!',keepGoing:'¡Bien! Sigue encajando.',gameOverMsg:'¡Fin del juego!',
 name_1:'Explosivo',name_2:'Derrite',name_3:'Arena',name_4:'Imán',name_5:'Limpia todo'}};
let LANG='pt-BR';
function t(k,n){const d=TXT[LANG]||TXT['pt-BR'];const v=d[k]!=null?d[k]:(TXT['pt-BR'][k]!=null?TXT['pt-BR'][k]:k);return n==null?v:v.replace('{n}',n)}
function detectLang(){ // primeira vez: usa o idioma do celular
 const l=(navigator.language||'pt-BR').toLowerCase();
 if(l.startsWith('pt-pt'))return 'pt-PT';if(l.startsWith('pt'))return 'pt-BR';
 if(l.startsWith('fr'))return 'fr';if(l.startsWith('es'))return 'es';return 'en';
}
function applyLang(){
 document.documentElement.lang=LANG;
 document.querySelectorAll('[data-i]').forEach(el=>el.innerHTML=t(el.dataset.i));
 document.querySelectorAll('[data-ia]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.ia)));
 drawToggles();
 $('#playBtn').textContent=hasGame?t('cont'):t('play');
 try{setHud()}catch(e){} // placar de cima no idioma novo
}
function setLang(code,save=true){
 if(!TXT[code])code='pt-BR';LANG=code;applyLang();
 if(save){DATA.lang=code;persist()}
}
function drawLangs(){
 const box=$('#langList');box.innerHTML='';
 LANGS.forEach(([code,flag,name])=>{
  const b=document.createElement('button');b.className='btn'+(code===LANG?' sel':'');
  b.innerHTML=`<span class="flag">${flag}</span><span>${name}</span>`+(code===LANG?'<span class="ok">✓</span>':'');
  b.onclick=()=>{play('encaixar',1.3);setLang(code);drawLangs();if(pieces&&pieces.length)drawTray(false)};
  box.append(b);
 });
}
