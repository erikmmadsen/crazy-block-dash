# CLAUDE.md: instruções do projeto Crazy Block Dash

Responda sempre em **português do Brasil**. O desenvolvedor creditado é **Erik Moreira Madsen**.
Repositório: https://github.com/erikmmadsen/crazy-block-dash · Site: https://erikmmadsen.github.io/crazy-block-dash/

## Fluxo obrigatório para TODA alteração

Nunca altere a `main` direto, nem faça merge sozinho. Para cada pedido de mudança:

1. **Issue**: crie uma issue descrevendo o pedido e as tarefas (`--label enhancement` ou `bug`).
2. **Branch** a partir da `main` atualizada: `feature/<nº-da-issue>-<resumo>` ou `fix/<nº-da-issue>-<resumo>`.
3. **Alteração**:
   - faça a mudança;
   - suba a versão (veja "Versão");
   - adicione a seção no `CHANGELOG.md`;
   - rode `npm run site && npm run check`;
   - teste no navegador.
4. **Commit e push** da branch, com mensagem que cite a issue (ex.: `Adiciona modo Zen (#12)`).
5. **Pull Request** para a `main`:
   - use o modelo de `.github/pull_request_template.md`, com `Closes #<nº>`;
   - peça revisão do `erikmmadsen`.
6. **Pare aí**. Quem aprova e faz o merge é o usuário, pela conta **erikmmadsen**. A `main` é protegida: exige 1 aprovação e o CI (Web + Android) passando.
7. Depois do merge, o workflow **Deploy** publica o site e cria a Release `vX.Y.Z` sozinho. Confira se ele passou.

### Contas do GitHub
- **Issues, branches, commits e PRs**: conta **caiomadsen** (colaboradora com escrita).
  - Comandos: `GH_TOKEN=$(gh auth token --user caiomadsen) gh ...`
  - Push: `GH_TOKEN=$(gh auth token --user caiomadsen) git -c credential.helper= -c "credential.helper=!gh auth git-credential" push`
  - Autor dos commits (já configurado no repo local): `Caio Madsen <26187952+caiomadsen@users.noreply.github.com>`.
- **Aprovação e merge**: conta **erikmmadsen**, feitos pelo usuário. O GitHub não deixa a mesma conta abrir e aprovar uma PR.
- Configurações do repositório (proteção de branch, Pages, segredos): conta erikmmadsen (admin).

## Versão (SemVer)
- A única fonte da versão é o `"version"` do `package.json`. Ela vai para:
  - o rodapé do menu (`<span id="ver">`, escrito pelo `scripts/build.js`);
  - o Android: `versionName` e `versionCode = MAJOR*10000 + MINOR*100 + PATCH`.
- Qual parte subir:
  - **PATCH** (`npm version patch --no-git-tag-version`): correção ou ajuste pequeno;
  - **MINOR**: novidade;
  - **MAJOR**: mudança grande ou que quebra o save.
- O CI falha se a versão da PR não for maior que a da `main`, ou se faltar `## [X.Y.Z]` no `CHANGELOG.md`.

## Comandos
| Comando | O que faz |
|---|---|
| `npm run build` | monta `www/` (app) com a versão |
| `npm run site` | monta `www/` e `site/` (GitHub Pages + política de privacidade) |
| `npm run check` | verifica versão, sintaxe JS, sons, imagens, 5 idiomas e CHANGELOG |
| `npm run sync` | build + `npx cap sync android`. Rode depois de toda mudança no jogo |
| `npm run aab` | gera o .aab assinado localmente (precisa de `assinatura/`) |

Para compilar o Android localmente, use o JBR do Android Studio (Java 25) com Gradle 9.2.1:

```sh
JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" ANDROID_HOME="$(cygpath -m ~/AppData/Local/Android/Sdk)" ./gradlew.bat assembleDebug
```

## Estrutura
- `BlockBlastMaluco_v2.html`: o jogo inteiro (HTML + CSS + JS num arquivo só). É a fonte. `www/` e `site/` são gerados.
- `sounds/`, `images/`: arquivos do jogo.
- `android/`: projeto Capacitor 8 (API 36). Tem o plugin nativo `PlacarOnlinePlugin.java` (Google Play Games).
- `play-store/`: textos da loja, política de privacidade, artes, prints e o guia `placar-mundial.md`.
- `scripts/`: build e verificações usados pelo CI.
- `.github/workflows/`:
  - `ci.yml`: roda em PRs e gera a prévia do site e o APK de teste;
  - `deploy.yml`: roda em push na main e faz Pages + Release.

## Convenções do código do jogo
- **Textos**:
  - todo texto visível vai no dicionário `TXT`, nos **5 idiomas** (pt-BR, pt-PT, en, fr, es), com as mesmas chaves;
  - no HTML, use `data-i="chave"` (conteúdo) ou `data-ia="chave"` (aria-label); no JS, use `t('chave')`;
  - o bloco de IDIOMAS fica no topo do `<script>`, porque é usado antes de outras declarações.
- **Sons**:
  - entram na config `SFX` como `{v, vol}`, e o arquivo deve ser `sounds/<chave>_<v>.mp3`;
  - os sons do jogo vêm do Higgsfield, e o da bomba é o mp4 do usuário.
- **Telas**: novas telas são `<section class="screen">`. Adicione o id na lista de `show()` e trate o botão voltar do Android (`backButton`).
- **Animações**:
  - respeite `reduce` (prefers-reduced-motion);
  - confira se uma classe CSS nova já existe antes de usar o nome (ex.: `.pop` é do selo do multiplicador).
- **Modos**:
  - `mode` é `'classic'` ou `'level'`;
  - o recorde e o save (`DATA.game`) são só do modo clássico, e as fases salvam em `DATA.levels`.
- **Testes visuais**:
  - use o Edge headless com um iframe de harness, chamando funções do jogo via `w.eval(...)` depois de `ready`;
  - o tempo virtual do headless atrapalha `setTimeout` e `requestAnimationFrame`: congele animações com `document.getAnimations()`.

## Cuidados
- **Nunca** envie `assinatura/` (chave e senha da Play Store), arquivos `.jks` ou `keystore.properties`. O `.gitignore` já bloqueia.
- **Nunca** coloque e-mail ou dados pessoais em commits, código ou chamadas a serviços externos. Use os e-mails `noreply` do GitHub.
- **Publicar, fazer push, criar issue ou PR e mexer nas configurações do repositório** são ações externas. Siga o fluxo acima, e para qualquer outra coisa pública pergunte antes.
- O placar mundial fica desligado até preencher os IDs em `android/app/src/main/res/values/strings.xml` (ver `play-store/placar-mundial.md`).
- Se o jogo passar a enviar algum dado novo, atualize a política de privacidade (`play-store/politica-de-privacidade.html`) e a seção "Segurança dos dados" de `play-store/textos-da-loja.md`.
