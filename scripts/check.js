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

// 1. versão no formato X.Y.Z e escrita no jogo
console.log('Versão');
if (/^\d+\.\d+\.\d+$/.test(version)) ok(`package.json: ${version}`); else falha(`versão inválida no package.json: "${version}" (use X.Y.Z)`);
if (html.includes(`<span id="ver">v${version}</span>`)) ok('versão aparece no menu'); else falha('a versão não foi escrita no menu (id="ver")');

// 2. JavaScript sem erro de sintaxe
console.log('JavaScript');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!scripts.length) falha('nenhum <script> encontrado');
scripts.forEach((code, i) => {
  try { new vm.Script(code, { filename: `script-${i + 1}.js` }); ok(`script ${i + 1} compila`); }
  catch (e) { falha(`erro de sintaxe no script ${i + 1}: ${e.message}`); }
});

// 3. todos os sons usados existem
console.log('Sons');
const sfx = html.slice(html.indexOf('const SFX={'), html.indexOf('};', html.indexOf('const SFX={')));
const sons = [];
for (const m of sfx.matchAll(/(\w+):\{(?:v:(\d+)|file:'([^']+)')/g)) sons.push(m[3] || `${m[1]}_${m[2]}.mp3`);
const musica = html.match(/const MUSICA=\{file:'([^']+)'/);
if (musica) sons.push(musica[1]);
if (sons.length < 5) falha(`só achei ${sons.length} sons na config SFX (o formato mudou?)`);
const faltaSom = sons.filter((s) => !fs.existsSync(r('www', 'sounds', s)));
if (faltaSom.length) falha('sons que não existem em sounds/: ' + faltaSom.join(', ')); else ok(`${sons.length} sons encontrados`);

// 4. todas as imagens usadas existem
console.log('Imagens');
const imgs = [...new Set([...html.matchAll(/images\/([\w.-]+\.(?:png|webp|jpe?g|svg))/g)].map((m) => m[1]))];
const faltaImg = imgs.filter((f) => !fs.existsSync(r('www', 'images', f)));
if (faltaImg.length) falha('imagens que não existem em images/: ' + faltaImg.join(', ')); else ok(`${imgs.length} imagens encontradas`);

// 5. os 5 idiomas têm os mesmos textos
console.log('Idiomas');
try {
  const ini = html.indexOf('const LANGS='), fim = html.indexOf('let LANG=');
  const { LANGS, TXT } = vm.runInNewContext(html.slice(ini, fim) + ';({LANGS,TXT})');
  const base = Object.keys(TXT['pt-BR']);
  for (const [code] of LANGS) {
    if (!TXT[code]) { falha(`idioma ${code} não existe em TXT`); continue; }
    const falta = base.filter((k) => TXT[code][k] == null);
    const sobra = Object.keys(TXT[code]).filter((k) => !base.includes(k));
    if (falta.length) falha(`${code}: faltam os textos ${falta.join(', ')}`);
    else if (sobra.length) falha(`${code}: textos que não existem no pt-BR: ${sobra.join(', ')}`);
    else ok(`${code}: ${base.length} textos`);
  }
  const usados = [...new Set([...html.matchAll(/data-ia?="(\w+)"/g)].map((m) => m[1]))];
  const semTexto = usados.filter((k) => !base.includes(k));
  if (semTexto.length) falha('data-i sem texto em TXT: ' + semTexto.join(', ')); else ok(`${usados.length} textos da página traduzidos`);
} catch (e) { falha('não consegui ler os idiomas (TXT): ' + e.message); }

// 6. CHANGELOG tem a versão atual
console.log('CHANGELOG');
const changelog = fs.existsSync(r('CHANGELOG.md')) ? fs.readFileSync(r('CHANGELOG.md'), 'utf8') : '';
if (changelog.includes(`## [${version}]`)) ok(`CHANGELOG tem a seção [${version}]`); else falha(`CHANGELOG.md não tem a seção "## [${version}]"`);

console.log(erros.length ? `\n${erros.length} problema(s) encontrado(s).` : '\nTudo certo!');
process.exit(erros.length ? 1 : 0);
