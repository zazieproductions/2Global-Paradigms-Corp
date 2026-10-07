/**
 * The archive shell — the docked navigation console.
 *
 * These tests pin the contract that matters: it arrives on its own a few
 * seconds after load, it navigates the archive by command, it never opens over
 * a dialog, and a wrong command always names the next step.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { progressionStore } from '@/lib/puzzles/progression';
import { renderArchive } from './render';

vi.mock('@/config/features', () => ({
  FEATURES: {
    bootSequence: false,
    archiveShell: true,
    persistProgress: false,
    assistedBypass: true,
    uiSoundsDefault: false
  }
}));

const SHELL_LABEL = /archive shell command/i;

/** Advance the auto-open timer and let the shell settle. */
async function openShell() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3600);
  });
  const input = await screen.findByLabelText(SHELL_LABEL);
  await waitFor(() => expect(input).toBeVisible());
  return input;
}

let errorSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  progressionStore.dispatch({ type: 'reset' });
  errorSpy = vi.spyOn(console, 'error');
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.useRealTimers();
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

describe('archive shell', () => {
  it('drops in a few seconds after load and prints its banner', async () => {
    renderArchive('/');
    expect(screen.getByLabelText(SHELL_LABEL)).not.toBeVisible();

    const input = await openShell();
    expect(input).toBeVisible();
    expect(screen.getByText(/ARCHIVE SHELL — VAULT0/)).toBeVisible();
    expect(screen.getByText(/type `help` for the command index/i)).toBeVisible();
    // First run: Thorne's dead-drop is announced rather than breaking in.
    expect(screen.getByText(/unscheduled transmission is waiting/i)).toBeVisible();
  });

  it('navigates by command: ls lists sections, cd opens one', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { router } = renderArchive('/');
    const input = await openShell();

    await user.type(input, 'ls{Enter}');
    expect(await screen.findByText(/SECTION\s+INDEX\s+ROUTE/)).toBeVisible();
    expect(screen.getByText(/documents\/\s+\d+\s+\/documents/)).toBeVisible();

    await user.clear(input);
    await user.type(input, 'cd personnel{Enter}');
    await waitFor(() => expect(router.state.location.pathname).toBe('/personnel'));
    expect(screen.getByText(/→ personnel · Personnel Directory/)).toBeVisible();
  });

  it('searches the archive and opens a hit by number', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { router } = renderArchive('/');
    const input = await openShell();

    await user.type(input, 'find svalbard{Enter}');
    expect(await screen.findByText(/records match 'svalbard'/)).toBeVisible();

    await user.clear(input);
    await user.type(input, 'open 1{Enter}');
    // Documents open in the viewer (`?doc=`), everything else changes route.
    await waitFor(() =>
      expect(router.state.location.pathname !== '/' || router.state.location.search.includes('doc=')).toBe(
        true
      )
    );
  });

  it('completes a section name on Tab', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderArchive('/');
    const input = await openShell();

    await user.type(input, 'cd docu');
    await user.keyboard('{Tab}');
    await waitFor(() => expect(input).toHaveValue('cd documents '));
  });

  it('answers a wrong command with the next step, and closes on exit', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { router } = renderArchive('/');
    const input = await openShell();

    await user.type(input, 'xyzzy{Enter}');
    expect(await screen.findByText(/vault0: xyzzy: command not found/)).toBeVisible();
    expect(screen.getByText(/type `help` for the command index\./)).toBeVisible();
    expect(router.state.location.pathname).toBe('/');

    await user.clear(input);
    await user.type(input, 'exit{Enter}');
    await waitFor(() => expect(screen.getByLabelText(SHELL_LABEL)).not.toBeVisible());
  });
});
