// Crazy Block Dash · Placar mundial (Google Play Games)
// Os arquivos js/ rodam na ordem do número (01, 02...) e compartilham as mesmas variáveis.

/* ===== PLACAR MUNDIAL (Google Play Games) =====
   Usa o plugin nativo PlacarOnline (android/.../PlacarOnlinePlugin.java).
   No navegador, ou enquanto os IDs do Play Console não forem preenchidos, mostra um aviso. */
const Placar=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.PlacarOnline;
let rankReturn='menu';
async function rankStatus(){try{return Placar?await Placar.status():{available:false}}catch(e){return {available:false}}}
function sendScore(n){if(Placar&&n>0)Placar.submitScore({score:n}).catch(()=>{})} // o placar guarda só o maior de cada jogador
async function openRank(){
 rankReturn=screen;
 const st=await rankStatus();
 if(st.available){try{await Placar.showLeaderboard();sendScore(best);return}catch(e){$('#rankMsg').textContent=t('rankFail')}}
 else $('#rankMsg').textContent=t('rankSoon');
 $('#rankBest').textContent=best;show('rank');
}
