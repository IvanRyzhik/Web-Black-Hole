import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const outputPath = resolve(root, 'black-hole-extension.zip');

if (!existsSync(distDir)) {
  throw new Error('dist/ not found. Run npm run build first.');
}

execSync(`cd "${distDir}" && zip -r "${outputPath}" .`, { stdio: 'inherit' });
console.log(`Created ${outputPath}`);
