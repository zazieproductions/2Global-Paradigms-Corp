#!/usr/bin/env node
/**
 * Generate SHA-256 answer digests for src/content/puzzles/definitions.ts.
 *
 *   npm run puzzle:digest -- "answer one" "answer two"
 *   npm run puzzle:digest -- --normalize trim,lowercase "Vance"
 *
 * Normalisation must match the puzzle's `validation.normalize` list and
 * mirrors normalizeAnswer() in src/lib/puzzles/validate.ts (inputs are cut to
 * PUZZLE_SETTINGS.maxInputLength first). Default steps: trim.
 *
 * Reminder: digests are a spoiler deterrent, not security. Short answers such
 * as 4-digit PINs can be brute-forced in milliseconds. See docs/PUZZLE_SYSTEM.md.
 */
import { createHash } from 'node:crypto';

const MAX_INPUT_LENGTH = 32; // keep in sync with src/config/puzzles.ts
const STEPS = new Set(['trim', 'lowercase', 'collapse-spaces', 'strip-spaces']);

function normalize(input, steps) {
  let out = input.slice(0, MAX_INPUT_LENGTH);
  for (const step of steps) {
    if (step === 'trim') out = out.trim();
    else if (step === 'lowercase') out = out.toLowerCase();
    else if (step === 'collapse-spaces') out = out.replace(/\s+/g, ' ');
    else if (step === 'strip-spaces') out = out.replace(/\s+/g, '');
  }
  return out;
}

const args = process.argv.slice(2);
let steps = ['trim'];
const answers = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--normalize' || args[i] === '-n') {
    steps = (args[++i] ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (args[i] === '--help' || args[i] === '-h') {
    answers.length = 0;
    break;
  } else {
    answers.push(args[i]);
  }
}

const unknown = steps.filter((s) => !STEPS.has(s));
if (unknown.length) {
  console.error(`Unknown normalize step(s): ${unknown.join(', ')}. Allowed: ${[...STEPS].join(', ')}`);
  process.exit(1);
}
if (!answers.length) {
  console.error('Usage: npm run puzzle:digest -- [--normalize trim,lowercase] "answer" ["answer" ...]');
  process.exit(1);
}

console.log(`// normalize: [${steps.map((s) => `'${s}'`).join(', ')}]`);
for (const answer of answers) {
  const digest = createHash('sha256').update(normalize(answer, steps), 'utf8').digest('hex');
  console.log(`'${digest}',`);
}
