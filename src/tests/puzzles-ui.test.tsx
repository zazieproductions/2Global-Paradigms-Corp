import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PalimpsestSafeModal } from '@/components/puzzles/palimpsest-safe-modal';
import { TerminalModal } from '@/components/puzzles/terminal-modal';
import { ClearanceModal } from '@/components/puzzles/clearance-modal';
import { progressionStore } from '@/lib/puzzles/progression';
import { earnedLevel, effectiveClearance } from '@/lib/puzzles/investigation';
import { renderArchive } from './render';
import { SEAL_ANSWERS } from './seal-fixtures';

vi.mock('@/config/features', () => ({
  FEATURES: {
    bootSequence: false,
    archiveShell: false,
    persistProgress: false,
    assistedBypass: true,
    uiSoundsDefault: false
  }
}));

const state = () => progressionStore.getState();

/** Break seals 1..n through the real store. */
const breakSeals = (n: number) => {
  for (let id = 1; id <= n; id++) {
    progressionStore.dispatch({ type: 'complete', puzzleId: `seal-${id}`, method: 'answer' });
  }
};

beforeEach(() => {
  progressionStore.dispatch({ type: 'reset' });
  progressionStore.dispatch({ type: 'mark-prologue-seen' });
});

describe('Whistleblower safe (Seal VI)', () => {
  const renderSafe = (onGoToSanctum = () => {}) =>
    render(<PalimpsestSafeModal open onClose={() => {}} onGoToSanctum={onGoToSanctum} />);

  it('rejects a wrong code and binds on the right one until Venus is broken', async () => {
    const user = userEvent.setup();
    renderSafe();
    const keypad = screen.getByRole('group', { name: 'Keypad' });
    for (const d of '0000') await user.click(within(keypad).getByRole('button', { name: d }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/AUTHENTICATION FAILED/);

    for (const d of SEAL_ANSWERS[6]) await user.click(within(keypad).getByRole('button', { name: d }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/NOT YET/);
    expect(state().completed['seal-6']).toBeUndefined();
  });

  it('opens after Seal V, grants Level 5 and the dump', async () => {
    breakSeals(5);
    const user = userEvent.setup();
    renderSafe();
    const keypad = screen.getByRole('group', { name: 'Keypad' });
    for (const d of SEAL_ANSWERS[6]) await user.click(within(keypad).getByRole('button', { name: d }));
    await waitFor(() => expect(state().completed['seal-6']).toMatchObject({ assisted: false }));
    expect(effectiveClearance(state())).toMatch(/^Level 5/);
    expect(screen.getByRole('button', { name: /DOWNLOAD WHISTLEBLOWER DATA DUMP/ })).toBeInTheDocument();
  });

  it('grants nothing for the revoked v1 combinations', async () => {
    breakSeals(5);
    const user = userEvent.setup();
    renderSafe();
    const keypad = screen.getByRole('group', { name: 'Keypad' });
    for (const code of ['1480', '1989', '3120']) {
      for (const d of code) await user.click(within(keypad).getByRole('button', { name: d }));
    }
    expect(state().completed['seal-6']).toBeUndefined();
  });

  it('never shows the combination and points to the seal', async () => {
    const onGo = vi.fn();
    const user = userEvent.setup();
    renderSafe(onGo);
    expect(screen.getByRole('dialog')).not.toHaveTextContent(new RegExp(`\\b${SEAL_ANSWERS[6]}\\b`));
    await user.click(screen.getByRole('button', { name: /Seal VI/ }));
    expect(onGo).toHaveBeenCalled();
  });
});

const renderTerminal = (onInvoke = () => {}) =>
  render(
    <MemoryRouter>
      <TerminalModal
        open
        onClose={() => {}}
        onOpenDocument={() => {}}
        onInvoke={onInvoke}
        onOpenSalvage={() => {}}
      />
    </MemoryRouter>
  );

describe('Command terminal', () => {
  it('runs help and refuses an unearned clearance 5', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, 'help{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent(/seals/i);
    await user.type(input, 'clearance 5{Enter}');
    expect(effectiveClearance(state())).not.toMatch(/^Level 5/);
  });

  it('rejects the revoked override key and masks it in the log', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, 'override 432-88{Enter}');
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(/OVERRIDE REJECTED/);
    expect(log).not.toHaveTextContent('432-88');
    expect(earnedLevel(state())).toBe(1);
  });

  it('invokes the Name only once six seals are broken', async () => {
    const onInvoke = vi.fn();
    const user = userEvent.setup();
    renderTerminal(onInvoke);
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, `invoke ${SEAL_ANSWERS[7].toLowerCase()}{Enter}`);
    expect(screen.getByRole('log')).toHaveTextContent(/Six seals still bind/);
    act(() => breakSeals(6));
    await user.type(input, `invoke ${SEAL_ANSWERS[7].toLowerCase()}{Enter}`);
    await waitFor(() => expect(onInvoke).toHaveBeenCalled(), { timeout: 2500 });
  });
});

describe('Clearance profiler', () => {
  it('treats the old master key as revoked and caps levels at what is earned', async () => {
    const onOpenSanctum = vi.fn();
    const user = userEvent.setup();
    render(<ClearanceModal open onClose={() => {}} onOpenSanctum={onOpenSanctum} />);
    // Let the modal's initial-focus frame run before typing into a field.
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    const input = screen.getByPlaceholderText(/master key/i);
    await user.type(input, 'Warrender{Enter}');
    expect(await screen.findByText(/NO MASTER KEYS REMAIN IN SERVICE/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Level 5/i }));
    expect(await screen.findByText(/DEGREE NOT YET EARNED/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /CONTINUE AT SEAL I\b/ }));
    expect(onOpenSanctum).toHaveBeenCalled();
    expect(earnedLevel(state())).toBe(1);
    expect(effectiveClearance(state())).toMatch(/^Level 1/);
  });
});

describe('Field directives UI', () => {
  it('shows the board on the case file, ticks a step and files the intel', async () => {
    const user = userEvent.setup();
    renderArchive('/sanctum');
    await screen.findByRole('heading', { name: 'The Seven Seals', level: 1 });

    // The dead drop closed itself on the first visit; the run is on directive 02.
    expect(state().directives.completed['dir-01']).toBeTruthy();
    expect(screen.getByText(/Directive 02 — THE CHANGELOG/)).toBeInTheDocument();
    expect(screen.getAllByText(/Walk the Historical Timeline/).length).toBeGreaterThan(0);
    expect(screen.getByText('FIELD INTEL 01')).toBeInTheDocument();

    // The reader walks the timeline: the step completes itself, no bookkeeping.
    await user.click(screen.getByRole('link', { name: /Historical Timeline/i }));
    await waitFor(() => expect(state().directives.completed['dir-02']).toBeTruthy());
    expect(state().directives.intel).toContain('intel-02');
  });

  it('announces a closed directive and its chapter as revelation toasts', async () => {
    renderArchive('/sanctum');
    await screen.findByRole('heading', { name: 'The Seven Seals', level: 1 });
    act(() => {
      progressionStore.dispatch({ type: 'observe', event: { kind: 'section-visited', target: 'timeline' } });
      progressionStore.dispatch({ type: 'observe', event: { kind: 'audio-played', target: 'audio-01' } });
    });
    // Directives 02 and 03 close together: chapter I announces itself, once.
    expect((await screen.findAllByText(/FIELD INTEL 03/)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CHAPTER I COMPLETE — THE DEAD DROP/).length).toBeGreaterThan(0);
    expect(state().directives.chapters['ch-1']).toBeTruthy();
  });

  it('puts the directive run and the intel filings on the terminal', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, 'directives{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent(/FIELD DIRECTIVES — THORNE'S RUN/);
    expect(screen.getByRole('log')).toHaveTextContent(/ON YOU NOW/);

    act(() => {
      progressionStore.dispatch({ type: 'observe', event: { kind: 'section-visited', target: 'timeline' } });
    });
    await user.type(input, 'intel{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent(/FIELD INTEL 02/);
    await user.type(input, 'intel 1{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent(/Whoever wrote the dead drop kept a diary/);
  });

  it('records the scan command as the sweep step', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, 'scan{Enter}');
    expect(state().directives.ledger.map((r) => r.id)).toContain('m-scan');
  });
});

describe('Sealed records and the de-scrambler', () => {
  it('shows a sealed notice for an Order record above your clearance and refuses export', async () => {
    const user = userEvent.setup();
    const { router } = renderArchive('/documents?doc=ovp-009');
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('This record is sealed.')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /COPY/i }));
    expect(await screen.findByText('RECORD SEALED')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /GO TO THE SEVEN SEALS/ }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/sanctum'));
  });

  it('keeps the de-scrambler locked below Level 3', async () => {
    const user = userEvent.setup();
    renderArchive('/documents');
    await screen.findByRole('heading', { level: 1 });
    await user.keyboard('u');
    expect(await screen.findByText(/DE-SCRAMBLER LOCKED/)).toBeInTheDocument();
    expect(state().access.unredacted).toBe(false);
  });
});
