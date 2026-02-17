#!/usr/bin/env node
import { execSync } from 'node:child_process';

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  } catch (e) {
    return (e.stdout?.toString() || e.stderr?.toString() || e.message).trim();
  }
}

console.log('== Football Agent Web Doctor ==');
console.log('node:', process.version);
console.log('npm :', run('npm -v'));

const proxyVars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'npm_config_http_proxy', 'npm_config_https_proxy'];
const active = proxyVars.filter((k) => process.env[k]);
if (active.length) {
  console.log('\nProxy env aktif:');
  active.forEach((k) => console.log(`- ${k}=${process.env[k]}`));
}

console.log('\nCek akses registry npm...');
const curl = run('curl -I https://registry.npmjs.org/prisma --max-time 12 || true');
console.log(curl.split('\n').slice(0, 8).join('\n'));

console.log('\nSaran jika install gagal 403 karena proxy policy:');
console.log('1) Jalankan di mesin dengan akses npm registry.');
console.log('2) Atau set registry internal perusahaan: npm config set registry <your-internal-registry>');
console.log('3) Coba tanpa proxy env (jika diizinkan):');
console.log('   env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy npm install');
