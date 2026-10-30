import fs from 'node:fs';
import path from 'node:path';

let hasErrors = false;

function scanFiles(dir, filter, onFile) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanFiles(fullPath, filter, onFile);
      }
    } else if (filter(entry.name)) {
      onFile(fullPath);
    }
  }
}

console.log('--- Running Quality Gate 2 Repository Verification ---');

// Check 1: No non-logical Tailwind classes in src/
const nonLogicalPattern = /\b(ml-|mr-|pl-|pr-|left-|right-|text-left|text-right)\b/g;
scanFiles('src', (name) => name.endsWith('.tsx') || name.endsWith('.ts'), (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(nonLogicalPattern);
  if (matches) {
    console.error(`❌ Non-logical Tailwind utility found in ${filePath}: ${matches.join(', ')}`);
    hasErrors = true;
  }
});

// Check 2: No raw hex colors in src/components/
const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
scanFiles('src/components', (name) => name.endsWith('.tsx') || name.endsWith('.ts'), (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(hexPattern);
  if (matches) {
    console.error(`❌ Raw hex color found in ${filePath}: ${matches.join(', ')}`);
    hasErrors = true;
  }
});

// Check 3: No eval( in src/
const evalPattern = /\beval\s*\(/g;
scanFiles('src', (name) => name.endsWith('.tsx') || name.endsWith('.ts'), (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(evalPattern);
  if (matches) {
    console.error(`❌ eval() call found in ${filePath}: ${matches.join(', ')}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n❌ Quality gate checks FAILED!');
  process.exit(1);
} else {
  console.log('✅ All Quality Gate 2 repository rules passed (zero violations).');
}
