import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PalimpsestSafeModal } from '@/components/puzzles/palimpsest-safe-modal';
import { TerminalModal } from '@/components/puzzles/terminal-modal';
import { ClearanceModal } from '@/components/puzzles/clearance-modal';
import { progressionStore } from '@/lib/puzzles/progression';

vi.mock('@/config/features', () => ({
  FEATURES: { bootSequence: false, persistProgress: false, assistedBypass: true, uiSoundsDefault: false }
}));

beforeEach(() => progressionStore.dispatch({ type: 'reset' }));

const state = () => progressionStore.getState();

describe('Whistleblower safe', () => {
  it('rejects a wrong PIN, accepts a right one and grants rewards', async () => {
    const user = userEvent.setup();
    render(<PalimpsestSafeModal open onClose={() => {}} />);
    const keypad = screen.getByRole('group', { name: 'Keypad' });
    for (const d of '0000') await user.click(within(keypad).getByRole('button', { name: d }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/AUTHENTICATION FAILED/);
    expect(state().completed['palimpsest-safe']).toBeUndefined();

    for (const d of '1480') await user.click(within(keypad).getByRole('button', { name: d }));
    await waitFor(() => expect(state().completed['palimpsest-safe']).toMatchObject({ assisted: false }));
    expect(state().access.clearance).toMatch(/^Level 5/);
    expect(screen.getByRole('button', { name: /DOWNLOAD WHISTLEBLOWER DATA DUMP/ })).toBeInTheDocument();
  });

  it('never shows the answer until the final hint is requested', async () => {
    const user = userEvent.setup();
    render(<PalimpsestSafeModal open onClose={() => {}} />);
    expect(screen.getByRole('dialog')).not.toHaveTextContent(/\b1480\b/);
    await user.click(screen.getByRole('button', { name: /STUCK\? INVESTIGATOR ASSISTANCE/ }));
    while (screen.queryByRole('button', { name: /^Open hint/ })) {
      expect(screen.getByRole('dialog')).not.toHaveTextContent(/\b1480\b/);
      await user.click(screen.getByRole('button', { name: /^Open hint/ }));
    }
    await user.click(screen.getByRole('button', { name: /Reveal answer/ }));
    expect(screen.getByRole('dialog')).toHaveTextContent(/1480/);
  });

  it('offers an assisted bypass that is recorded as assisted', async () => {
    const user = userEvent.setup();
    render(<PalimpsestSafeModal open onClose={() => {}} />);
    await user.click(screen.getByRole('button', { name: /STUCK\?/ }));
    const bypassBtn = screen.getByRole('button', { name: /REQUEST ASSISTED DECRYPTION/ });
    await user.click(bypassBtn);
    expect(state().completed['palimpsest-safe']).toMatchObject({ method: 'bypass', assisted: true });
  });
});

describe('Command terminal', () => {
  const renderTerminal = () =>
    render(
      <MemoryRouter>
        <TerminalModal open onClose={() => {}} onOpenDocument={() => {}} />
      </MemoryRouter>
    );

  it('runs help and rejects an unearned clearance 5', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, 'help{Enter}');
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(/override/i);
    await user.type(input, 'clearance 5{Enter}');
    expect(state().access.clearance).not.toMatch(/^Level 5/);
  });

  it('accepts the override code, masks it in the log and grants Level 5', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const input = screen.getByLabelText(/gpc@terminal/);
    await user.type(input, 'override 432-88{Enter}');
    await waitFor(() => expect(state().completed['terminal-override']).toBeTruthy());
    expect(state().access.clearance).toMatch(/^Level 5/);
    expect(screen.getByRole('log')).not.toHaveTextContent('432-88');
    // now the level can be selected freely
    await user.type(input, 'clearance 5{Enter}');
    expect(state().access.clearance).toMatch(/^Level 5/);
  });
});

describe('Clearance profiler', () => {
  it('keeps Level 5 locked until a puzzle grants it', async () => {
    const user = userEvent.setup();
    render(<ClearanceModal open onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/master key/i);
    await user.type(input, 'wrong{Enter}');
    expect(state().access.clearance).not.toMatch(/^Level 5/);
    await user.clear(input);
    await user.type(input, 'Vance{Enter}');
    await waitFor(() => expect(state().completed['executive-master-key']).toBeTruthy());
    expect(state().access.clearance).toMatch(/^Level 5/);
  });
});
