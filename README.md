# 🧩 Crazy Block Dash

[![CI](https://github.com/erikmmadsen/crazy-block-dash/actions/workflows/ci.yml/badge.svg)](https://github.com/erikmmadsen/crazy-block-dash/actions/workflows/ci.yml)
[![Deploy](https://github.com/erikmmadsen/crazy-block-dash/actions/workflows/deploy.yml/badge.svg)](https://github.com/erikmmadsen/crazy-block-dash/actions/workflows/deploy.yml)
[![Versão](https://img.shields.io/github/v/release/erikmmadsen/crazy-block-dash?label=vers%C3%A3o)](https://github.com/erikmmadsen/crazy-block-dash/releases)

Quebra-cabeça de blocos colorido e cheio de surpresas. Arraste as peças para o tabuleiro 10×10, complete linhas e colunas, faça combos e use peças especiais malucas!

### 🎮 [Jogar agora no navegador](https://erikmmadsen.github.io/crazy-block-dash/)

Desenvolvido por **Erik Moreira Madsen**.

<p align="center">
  <img src="play-store/imagens/prints/print-1-menu.png" width="200" alt="Menu">
  <img src="play-store/imagens/prints/print-2-jogo.png" width="200" alt="Partida">
  <img src="play-store/imagens/prints/print-3-especiais.png" width="200" alt="Peças especiais">
  <img src="play-store/imagens/prints/print-4-recorde.png" width="200" alt="Recorde">
</p>

## Como jogar
- Arraste as peças para o tabuleiro. A peça aparece acima do dedo para você ver onde vai encaixar.
- Complete uma **linha** ou **coluna** para limpar e ganhar **100 pontos**. Cada bloco encaixado vale **10 pontos**.
- Enquanto você arrasta, as linhas que vão completar ficam com **contorno dourado**.
- Limpe várias linhas de uma vez para fazer um **combo**. O locutor comemora: *Good, Great, Incredible, Unstoppable!*
- **Combo triplo** (3 ou mais linhas):
  - os blocos viram **rubis** ♦️;
  - os personagens comemoram;
  - o **multiplicador** sobe (X2, X3...) e multiplica todos os pontos até o fim da partida.
- Quando nenhuma peça couber mais, o jogo acaba.

### Peças especiais
| | Peça | Efeito |
|---|---|---|
| 💣 | Explosivo | destrói os blocos em volta |
| 💧 | Derrete | derrete um quadrado 2×2 |
| ⏳ | Areia | vira areia e os blocos desabam |
| 🧲 | Ímã | puxa os blocos próximos para cima |
| 🧹 | Limpa tudo | apaga o tabuleiro e dá +300 pontos |

### Modos
- **Clássico**: partida infinita, vale o seu recorde.
- **🗺️ Fases**:
  - 20 fases com objetivos (limpar linhas ou fazer pontos);
  - blocos que já começam no tabuleiro;
  - limite de peças e até 3 ⭐ por fase.
- **🏆 Placar mundial**: ranking pelo Google Play Games (no app Android).

Idiomas: português (Brasil e Portugal), inglês, francês e espanhol.

## Tecnologia
- O jogo é HTML, CSS e JavaScript puros, sem frameworks, dentro de [`src/`](src/).
- **Android**: [Capacitor 8](https://capacitorjs.com/) (API 36), com plugin nativo próprio para o Google Play Games.
- **Web**: GitHub Pages.
- **Sons e personagens**: gerados com Higgsfield.

## Rodar localmente
Requisitos: Node.js 22+. Para o Android, também o Android Studio.

```sh
npm install
npm run site     # monta www/ e site/
npm run check    # verificações automáticas
```

Para jogar no navegador, abra `src/index.html` (ou `www/index.html`, já com a versão), ou sirva a pasta `site/` com qualquer servidor estático.

**Android:**
```sh
npm run sync     # copia o jogo para o projeto Android
npm run open     # abre no Android Studio (▶ para instalar no celular)
```

## Estrutura
```
src/                          o jogo (tudo que vai para o site e para o app)
├── index.html                telas e estrutura da página
├── css/                      jogo.css · telas.css · animacoes.css
├── js/                       rodam na ordem do número e compartilham as variáveis
│   ├── 01-idiomas.js         textos nos 5 idiomas
│   ├── 02-config.js          tabuleiro, cores, formatos de peça, peças especiais
│   ├── 03-save.js            recorde, partida salva, preferências
│   ├── 04-audio.js           sons e música
│   ├── 05-tabuleiro.js       tabuleiro, bandeja, prévia e arrastar
│   ├── 06-efeitos.js         locutor na tela, pontos animados
│   ├── 07-jogada.js          jogada, especiais, combos, rubis, fim de jogo
│   ├── 08-fases.js           modo Fases
│   ├── 09-placar.js          placar mundial
│   ├── 10-telas.js           telas e botões
│   └── 11-inicio.js          início do jogo (sempre o último)
├── sounds/                   só os sons em uso
└── images/                   personagens e ícone
recursos/sons-alternativos/   outras versões dos sons (não vão para o jogo)
android/                      projeto Android (Capacitor)
play-store/                   textos da loja, política de privacidade e imagens/ (ícone, destaque, prints)
docs/                         guias (ex.: como ligar o placar mundial)
scripts/                      build e verificações
.github/                      CI/CD, modelos de issue e PR, CODEOWNERS
CHANGELOG.md                  histórico de versões
```

## Versões e CI/CD
O jogo segue o [SemVer](https://semver.org/lang/pt-BR/). A versão fica no `package.json` e aparece no menu e no app Android. O histórico está no [CHANGELOG](CHANGELOG.md).

| Quando | Workflow | O que faz |
|---|---|---|
| Pull Request para `main` | **CI** | monta o jogo; verifica JavaScript, sons, imagens, os 5 idiomas, se a versão subiu e o CHANGELOG; gera a prévia do site e o **APK de teste** |
| Merge na `main` | **Deploy** | publica o site no GitHub Pages |
| Versão mudou na `main` (`package.json`) | **Release** | cria a **Release `vX.Y.Z`** com o APK (e o `.aab` assinado, se os segredos estiverem configurados) e as notas do CHANGELOG |

### Fluxo de alterações
1. Abrir uma **issue** com o pedido.
2. Criar uma **branch** `feature/<nº>-<resumo>` ou `fix/<nº>-<resumo>`.
3. Fazer a mudança, subir a versão (`npm version patch|minor --no-git-tag-version`) e atualizar o `CHANGELOG.md`.
4. Abrir uma **Pull Request**. A `main` é protegida: precisa do CI passando e da aprovação do Erik.
5. Depois do merge, o site é atualizado e, como a versão mudou, a Release nova é criada automaticamente.

### Segredos opcionais (`.aab` assinado na Release)
Em *Settings › Secrets and variables › Actions*:
- `ANDROID_KEYSTORE_BASE64`: o arquivo `upload-key.jks` em base64;
- `ANDROID_KEYSTORE_PASSWORD`;
- `ANDROID_KEY_ALIAS`;
- `ANDROID_KEY_PASSWORD`.

## Privacidade
Veja a [Política de Privacidade](https://erikmmadsen.github.io/crazy-block-dash/politica-de-privacidade.html).
