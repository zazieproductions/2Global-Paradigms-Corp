/**
 * Directive 17 — the unquiet tape (UI layer).
 *
 * Covers the discovery paths and the splice surface: the terminal's purge
 * manifest and salvage command, the anomalous `cat` / `?doc=` refusals, the
 * dossier citation that leads to the spool, and the Directive 17 replay that
 * opens when every ghost is spliced.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GHOSTS } from '@/content';
import { scrambledShards } from '@/lib/puzzles/salvage';
import type { SalvageShard } from '@/types';
import { progressionStore } from '@/lib/puzzles/progression';
import { renderArchive } from './render';

vi.mock('@/config/features', () => ({
  FEATURES: {
    bootSequence: false,
    archiveShell: false,
    persistProgress: false,
    assistedBypass: true,
    uiSoundsDefault: false
  }
}));

let errorSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error');
  progressionStore.dispatch({ type: 'reset' });
});
afterEach(() => {
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

const ghost = GHOSTS[0]; // MEMO-1989-EXEC-TERMINATION

async function openTerminal(user: ReturnType<typeof userEvent.setup>) {
  renderArchive('/');
  await screen.findAllByRole('heading', { level: 1 });
  await user.keyboard('~');
  const input = await screen.findByLabelText(/gpc@terminal/);
  return input;
}

/** Bubble-sort the scrambled shards back to tape order using the move buttons. */
async function spliceByButtons(user: ReturnType<typeof userEvent.setup>, shards: SalvageShard[]) {
  const current = [...shards];
  for (let target = 0; target < current.length; target++) {
    const want = target + 1;
    let idx = current.findIndex((s) => s.order === want);
    while (idx > target) {
      await user.click(screen.getByRole('button', { name: `Move fragment ${current[idx].locator} earlier` }));
      [current[idx], current[idx - 1]] = [current[idx - 1], current[idx]];
      idx--;
    }
  }
}

describe('the unquiet tape — terminal surface', () => {
  it('lists the Directive 17 purge manifest', async () => {
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, 'purge{Enter}');
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(/DIRECTIVE 17 — PURGE MANIFEST/);
    for (const g of GHOSTS) expect(log).toHaveTextContent(g.code);
    expect(log).toHaveTextContent(/salvage MEMO-1989-EXEC-TERMINATION/);
  });

  it('refuses a purged file in `cat` but points at the tape', async () => {
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, `cat ${ghost.code}{Enter}`);
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(/INDEX REFUSES THIS FILE/);
    expect(log).toHaveTextContent(/THE TAPE REMEMBERS/);
    expect(progressionStore.getState().discovered[ghost.id]).toBeUndefined();
  });

  it('opens the tape spool from `salvage <code>`', async () => {
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, `salvage ${ghost.code.toLowerCase()}{Enter}`);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(ghost.code);
    expect(dialog).toHaveTextContent(/TAPE GHOST · STRUCK UNDER DIRECTIVE 17/);
  });

  it('reports ghosts spliced in `progress`', async () => {
    progressionStore.dispatch({ type: 'salvage-ghost', ghostId: GHOSTS[1].id });
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, 'progress{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent(/DIRECTIVE 17 GHOSTS SPLICED: 1\/3/);
  });
});

describe('the unquiet tape — the splice', () => {
  it('refuses the scrambled order and accepts the tape order', async () => {
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, `salvage ${ghost.code}{Enter}`);
    await screen.findByRole('dialog');

    // The spool never presents the solution, so the scrambled order must fail…
    await user.click(screen.getByRole('button', { name: /SPLICE THE TAPE/ }));
    expect(await screen.findByText(/The reels fight each other/)).toBeInTheDocument();
    expect(progressionStore.getState().investigation.salvaged).toEqual([]);

    // …and the ascending order must hold.
    await spliceByButtons(user, scrambledShards(ghost));
    await user.click(screen.getByRole('button', { name: /SPLICE THE TAPE/ }));
    expect(await screen.findByText(/Splice holds/)).toBeInTheDocument();
    await waitFor(() => expect(progressionStore.getState().investigation.salvaged).toContain(ghost.id));
    const entry = progressionStore.getState().investigation.journal.at(-1);
    expect(entry?.kind).toBe('salvage');
    expect(entry?.text).toContain(ghost.code);
  });

  it('replays a spliced ghost as recovered text', async () => {
    progressionStore.dispatch({ type: 'salvage-ghost', ghostId: ghost.id });
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, `salvage ${ghost.code}{Enter}`);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(/RECOVERED TEXT/);
    expect(dialog).toHaveTextContent(/E\. CROSS, for the executive floor/);
  });

  it('replays Directive 17 itself when every ghost is spliced', async () => {
    for (const g of GHOSTS) progressionStore.dispatch({ type: 'salvage-ghost', ghostId: g.id });
    const user = userEvent.setup();
    const input = await openTerminal(user);
    await user.type(input, `salvage ${ghost.code}{Enter}`);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(/ALL GHOSTS SPLICED/);
    expect(dialog).toHaveTextContent(/Purge of the Live Index/);
    expect(dialog).toHaveTextContent(/THE TAPE WILL REMEMBER/);
  });
});

describe('the unquiet tape — discovery paths', () => {
  it('offers the spool from a dossier citation the index refuses', async () => {
    const user = userEvent.setup();
    renderArchive('/personnel?record=p-001');
    const button = await screen.findByRole('button', { name: /REPLAY THE TAPE GHOST/ });
    expect(button).toHaveTextContent(ghost.code);
    await user.click(button);
    expect(await screen.findByText(/TAPE GHOST · STRUCK UNDER DIRECTIVE 17/)).toBeInTheDocument();
  });

  it('answers ?doc= with a ghost notice instead of a flat 404', async () => {
    renderArchive(`/?doc=${ghost.code}`);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(/Ghost on the tape/);
    expect(dialog).toHaveTextContent(/THE TAPE REMEMBERS/);
  });
});
