# Como ligar o Placar Mundial (Google Play Games)

O código do placar já está pronto no jogo. Ele só começa a funcionar depois destes passos no Play Console.
Até lá, o botão "🏆 Placar mundial" mostra um aviso dizendo que o placar chega quando o jogo estiver na Play Store.

## 1. Criar o Play Games Services
1. Abra o **Play Console**, escolha o app **Crazy Block Dash**.
2. No menu da esquerda: **Crescer usuários › Play Games Services › Configuração e gerenciamento › Configuração**.
3. Escolha **"Não, meu jogo não usa as APIs do Google"** e crie o projeto.
4. Copie o **ID do projeto** (um número com uns 12 dígitos).

## 2. Criar a credencial (liga o jogo ao Play Games)
1. Ainda em **Configuração**, clique em **Adicionar credencial › Android**.
2. Siga o link para o **Google Cloud** e crie um **ID do cliente OAuth** do tipo **Android**:
   - Nome do pacote: `com.temauraaqui.blocosmalucos`
   - Impressão digital SHA-1: use a do **certificado de assinatura do app** (Play Console › Testar e lançar › Configuração › Integridade do app). Para testar instalando pelo Android Studio, crie outra credencial com o SHA-1 da chave de depuração.
3. Volte ao Play Console e salve a credencial.

## 3. Criar o placar
1. **Play Games Services › Placares › Criar placar**.
2. Nome: `Pontos` · Formato: **Numérico** · Ordem: **Maior é melhor**.
3. Salve e copie o **ID do placar** (começa com `CgkI...`).

## 4. Colar os IDs no jogo
Abra `android/app/src/main/res/values/strings.xml` e troque:
```xml
<string name="game_services_project_id" translatable="false">000000000000</string>
<string name="leaderboard_pontos" translatable="false">COLE_AQUI_O_ID_DO_PLACAR</string>
```
pelos dois IDs copiados. Depois gere o `.aab` de novo.

## 5. Publicar o Play Games Services
Em **Play Games Services › Configuração**, adicione seu e-mail em **Testadores** para testar, e quando estiver tudo certo clique em **Publicar**.

## Como funciona no jogo
- Ao abrir o jogo, o Play Games entra sozinho (sem tela de login) e envia o seu recorde.
- No fim de cada partida, os pontos são enviados. O placar guarda só o melhor de cada jogador.
- O botão **🏆 Placar mundial** (menu e fim de jogo) abre o placar do Google com o mundo todo, amigos, do dia, da semana e de sempre.

## Política de privacidade
Com o placar ligado, o jogo envia o **nome de jogador do Play Games e a pontuação** para o Google.
Atualize a política de privacidade e o formulário de **Segurança dos dados** no Play Console (dados: "ID do usuário/Nome no jogo" e "Atividade no app", usados para "Funcionalidade do app").
