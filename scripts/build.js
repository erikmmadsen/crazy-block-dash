// Monta o jogo para publicação.
//   node scripts/build.js         -> www/   (usado pelo Capacitor / app Android)
//   node scripts/build.js --site  -> www/ e site/ (GitHub Pages, com a política de privacidade)
// A versão vem do package.json e é escrita no rodapé do menu (id="ver").
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const r = (...p) => path.join(root, ...p);
const { version } = require(r('package.json'));

// copia todo o src/ (index.html, css/, js/, sounds/, images/) para www/
fs.rmSync(r('www'), { recursive: true, force: true });
fs.cpSync(r('src'), r('www'), { recursive: true });

let html = fs.readFileSync(r('www', 'index.html'), 'utf8');
const marca = /(<span id="ver">)v[^<]*(<\/span>)/;
if (!marca.test(html)) throw new Error('Não achei <span id="ver"> no src/index.html para escrever a versão.');
html = html.replace(marca, `$1v${version}$2`);
fs.writeFileSync(r('www', 'index.html'), html);
console.log(`www/ pronto (v${version})`);

if (process.argv.includes('--site')) {
  fs.rmSync(r('site'), { recursive: true, force: true });
  fs.cpSync(r('www'), r('site'), { recursive: true });
  fs.copyFileSync(r('play-store', 'politica-de-privacidade.html'), r('site', 'politica-de-privacidade.html'));
  fs.writeFileSync(r('site', '.nojekyll'), '');
  console.log(`site/ pronto (v${version})`);
}
