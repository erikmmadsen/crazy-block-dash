# Changelog

Todas as mudanças do Crazy Block Dash ficam registradas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e a versão segue o [SemVer](https://semver.org/lang/pt-BR/):

- **MAJOR** (2.0.0): mudança grande que quebra o jogo salvo ou muda o jogo por completo
- **MINOR** (1.1.0): novidade (modo novo, peça nova, tela nova)
- **PATCH** (1.0.1): correção ou ajuste pequeno (texto, som, cor, bug)

## [1.0.2] - 2026-11-22

### Corrigido
- Depois de encaixar a primeira peça, nenhuma outra podia ser arrastada: o som do encaixe dava erro (`stop()` chamado antes de `start()`) e a jogada ficava presa (#7)
- Um erro de som não trava mais a jogada, e um erro inesperado durante a jogada libera as peças

## [1.0.1] - 2026-11-22

### Alterado
- Projeto reorganizado: o jogo agora fica em `src/`, com o código separado em `css/` (3 arquivos) e `js/` (11 arquivos, um por assunto)
- `src/sounds/` só com os sons em uso; as versões alternativas foram para `recursos/sons-alternativos/`
- Som da bomba renomeado para `bomba.mp4` (sem espaços)
- Imagens da loja em `play-store/imagens/` e guias em `docs/`
- Release automática em workflow próprio (`release.yml`), disparada quando a versão muda
- Verificação do CI agora acusa sons e imagens que sobram sem uso

## [1.0.0] - 2026-11-22

Primeira versão com esteira de CI/CD.

### Adicionado
- Tabuleiro 10×10 com 15 formatos de peça (incluindo 3×3, 2×3 e os dois L novos)
- Peças especiais: 💣 Explosivo, 💧 Derrete, ⏳ Areia, 🧲 Ímã e 🧹 Limpa tudo (+300 pontos)
- Combo triplo: blocos viram rubis, fundo creme e comemoração com os personagens e o multiplicador X2, X3...
- Locutor (Good, Great, Incredible, Unstoppable) com o texto animado na tela
- Pontos subindo animados e "+pontos" flutuando no lugar da jogada
- Contorno dourado nas linhas e colunas que vão completar
- Modo **Fases**: 20 fases com objetivos, limite de peças e até 3 estrelas
- **Placar mundial** pelo Google Play Games (ativa depois da configuração no Play Console)
- 5 idiomas: português (Brasil e Portugal), inglês, francês e espanhol
- Música, efeitos sonoros, partida salva e recorde
- Versão para navegador no GitHub Pages
- CI/CD com GitHub Actions: verificações e APK de teste em toda PR; site e Release a cada versão aprovada
