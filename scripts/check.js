// Verificações automáticas do jogo (rodam no CI em toda Pull Request).
// Uso: node scripts/check.js   (depois de "npm run build")
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const r = (...p) => path.join(root, ...p);
const erros = [];
const ok = (msg) => console.log('  ✔ ' + msg);
const falha = (msg) => { erros.push(msg); console.log('  ✘ ' + msg); };

const { version } = require(r('package.json'));
const html = fs.readFileSync(r('www', 'index.html'), 'utf8');
const lista = (pasta, ext) => fs.readdirSync(r('www', pasta)).filter((f) => f.endsWith(ext)).sort();
const jsFiles = lista('js', '.js');
const js = Object.fromEntries(jsFiles.map((f) => [f, fs.readFileSync(r('www', 'js', f), 'utf8')]));
const cssFiles = lista('css', '.css');
const codigo = [html, ...Object.values(js), ...cssFiles.map((f) => fs.readFileSync(r('www', 'css', f), 'utf8'))].join('\n');
const acharJs = (trecho) => Object.values(js).find((c) => c.includes(trecho)) || '';

// 1. versão no formato X.Y.Z e escrita no jogo
console.log('Versão');
if (/^\d+\.\d+\.\d+$/.test(version)) ok(`package.json: ${version}`); else falha(`versão inválida no package.json: "${version}" (use X.Y.Z)`);
if (html.includes(`<span id="ver">v${version}</span>`)) ok('versão aparece no menu'); else falha('a versão não foi escrita no menu (id="ver")');

// 2. JavaScript sem erro de sintaxe, e todos os arquivos js/ e css/ ligados no index.html
console.log('JavaScript e CSS');
if (!jsFiles.length) falha('nenhum arquivo em js/');
for (const [f, code] of Object.entries(js)) {
  try { new vm.Script(code, { filename: f }); ok(`js/${f} compila`); }
  catch (e) { falha(`erro de sintaxe em js/${f}: ${e.message}`); }
}
const tags = [...html.matchAll(/<script src="js\/([^"]+)"/g)].map((m) => m[1]);
if (JSON.stringify(tags) !== JSON.stringify(jsFiles)) falha(`index.html deve carregar os js/ na ordem dos números: ${jsFiles.join(', ')} (está: ${tags.join(', ')})`);
else ok(`index.html carrega os ${tags.length} arquivos js/ na ordem`);
const links = [...html.matchAll(/<link rel="stylesheet" href="css\/([^"]+)"/g)].map((m) => m[1]).sort();
if (JSON.stringify(links) !== JSON.stringify(cssFiles)) falha(`index.html não carrega todos os css/ (${cssFiles.join(', ')})`);
else ok(`index.html carrega os ${links.length} arquivos css/`);

// 3. todos os sons usados existem
console.log('Sons');
const audio = acharJs('const SFX={');
const sfx = audio.slice(audio.indexOf('const SFX={'), audio.indexOf('};', audio.indexOf('const SFX={')));
const sons = [];
for (const m of sfx.matchAll(/(\w+):\{(?:v:(\d+)|file:'([^']+)')/g)) sons.push(m[3] || `${m[1]}_${m[2]}.mp3`);
const musica = audio.match(/const MUSICA=\{file:'([^']+)'/);
if (musica) sons.push(musica[1]);
if (sons.length < 5) falha(`só achei ${sons.length} sons na config SFX (o formato mudou?)`);
const faltaSom = sons.filter((s) => !fs.existsSync(r('www', 'sounds', s)));
if (faltaSom.length) falha('sons que não existem em src/sounds/: ' + faltaSom.join(', ')); else ok(`${sons.length} sons encontrados`);
const sobraSom = fs.readdirSync(r('www', 'sounds')).filter((f) => !sons.includes(f));
if (sobraSom.length) falha('sons em src/sounds/ que o jogo não usa (mova para recursos/sons-alternativos/): ' + sobraSom.join(', ')); else ok('nenhum som sobrando');

// 4. todas as imagens usadas existem
console.log('Imagens');
const imgs = [...new Set([...codigo.matchAll(/images\/([\w.-]+\.(?:png|webp|jpe?g|svg))/g)].map((m) => m[1]))];
const faltaImg = imgs.filter((f) => !fs.existsSync(r('www', 'images', f)));
if (faltaImg.length) falha('imagens que não existem em src/images/: ' + faltaImg.join(', ')); else ok(`${imgs.length} imagens encontradas`);
const sobraImg = fs.readdirSync(r('www', 'images')).filter((f) => !imgs.includes(f));
if (sobraImg.length) falha('imagens em src/images/ que o jogo não usa: ' + sobraImg.join(', ')); else ok('nenhuma imagem sobrando');

// 5. os 5 idiomas têm os mesmos textos
console.log('Idiomas');
try {
  const idiomas = acharJs('const TXT={');
  const ini = idiomas.indexOf('const LANGS='), fim = idiomas.indexOf('let LANG=');
  const { LANGS, TXT } = vm.runInNewContext(idiomas.slice(ini, fim) + ';({LANGS,TXT})');
  const base = Object.keys(TXT['pt-BR']);
  for (const [code] of LANGS) {
    if (!TXT[code]) { falha(`idioma ${code} não existe em TXT`); continue; }
    const falta = base.filter((k) => TXT[code][k] == null);
    const sobra = Object.keys(TXT[code]).filter((k) => !base.includes(k));
    if (falta.length) falha(`${code}: faltam os textos ${falta.join(', ')}`);
    else if (sobra.length) falha(`${code}: textos que não existem no pt-BR: ${sobra.join(', ')}`);
    else ok(`${code}: ${base.length} textos`);
  }
  const usados = [...new Set([...codigo.matchAll(/data-ia?="(\w+)"/g)].map((m) => m[1]))];
  const semTexto = usados.filter((k) => !base.includes(k));
  if (semTexto.length) falha('data-i sem texto em TXT: ' + semTexto.join(', ')); else ok(`${usados.length} textos da página traduzidos`);
} catch (e) { falha('não consegui ler os idiomas (TXT): ' + e.message); }

// 6. CHANGELOG tem a versão atual
console.log('CHANGELOG');
const changelog = fs.existsSync(r('CHANGELOG.md')) ? fs.readFileSync(r('CHANGELOG.md'), 'utf8') : '';
if (changelog.includes(`## [${version}]`)) ok(`CHANGELOG tem a seção [${version}]`); else falha(`CHANGELOG.md não tem a seção "## [${version}]"`);

console.log(erros.length ? `\n${erros.length} problema(s) encontrado(s).` : '\nTudo certo!');
process.exit(erros.length ? 1 : 0);
