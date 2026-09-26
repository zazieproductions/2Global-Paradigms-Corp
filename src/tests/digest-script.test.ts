import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { digestAnswer } from '@/lib/puzzles/validate';

const run = (...args: string[]) =>
  execFileSync(process.execPath, ['scripts/puzzle-digest.mjs', ...args], { encoding: 'utf8' });

describe('puzzle:digest script', () => {
  it('produces the same digests as the runtime validator', () => {
    expect(run('  1480 ')).toContain(digestAnswer('1480', ['trim']));
    expect(run('-n', 'trim,lowercase', 'Some Answer')).toContain(
      digestAnswer('some answer', ['trim', 'lowercase'])
    );
  });
});
