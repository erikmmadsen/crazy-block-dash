// Garante que a Pull Request sobe a versão do jogo em relação à branch de destino.
// Uso: node scripts/check-version.js origin/main
const { execSync } = require('child_process');
const path = require('path');

const base = process.argv[2] || 'origin/main';
const atual = require(path.join(__dirname, '..', 'package.json')).version;

let anterior = null;
try {
  anterior = JSON.parse(execSync(`git show ${base}:package.json`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })).version;
} catch (e) {
  console.log(`A branch ${base} ainda não tem package.json: primeira versão (${atual}).`);
  process.exit(0);
}

const num = (v) => v.split('.').map(Number);
const [a, b] = [num(atual), num(anterior)];
const maior = a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
if (maior > 0) {
  console.log(`✔ Versão nova: ${anterior} -> ${atual}`);
} else {
  console.log(`✘ A versão precisa subir. ${base}: ${anterior}, esta PR: ${atual}.`);
  console.log('  Rode "npm version patch --no-git-tag-version" (correção) ou "minor" (novidade) e atualize o CHANGELOG.md.');
  process.exit(1);
}
