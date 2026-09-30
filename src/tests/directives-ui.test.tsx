/**
 * UI-level tests for the directive layer: the Mission Control page, the
 * dashboard tracker strip, and the completion watcher (toasts + journal).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { progressionStore } from '@/lib/puzzles/progression';
import { revelationStore } from '@/lib/puzzles/revelations';
import { renderArchive } from './render';

vi.mock('@/config/features', () => ({
  FEATURES: { bootSequence: false, persistProgress: false, assistedBypass: true, uiSoundsDefault: false }
}));

let errorSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error');
  progressionStore.dispatch({ type: 'reset' });
  // Toasts are an app-wide singleton; clear leftovers from previous tests.
  for (const r of revelationStore.getSnapshot()) revelationStore.dismiss(r.id);
});
afterEach(() => {
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

describe('Mission Control (/directives)', () => {
  it('shows the current objective and locks later chapters', async () => {
    renderArchive('/directives');
    await screen.findAllByRole('heading', { level: 1 });
    const objective = screen.getByRole('region', { name: /current objective/i });
    expect(within(objective).getByRole('heading', { name: 'OP-01 · FIRST SHIFT' })).toBeInTheDocument();
    // Chapter I active, chapter II sealed.
    expect(screen.getByText(/CH-1 · CHAPTER 1 OF 5 · ACTIVE/i)).toBeInTheDocument();
    expect(screen.getByText(/CH-2 · CHAPTER 2 OF 5 · SEALED/i)).toBeInTheDocument();
    // The OP-01 checklist is visible with its first step open.
    expect(screen.getAllByText('Report to the Command Dashboard').length).toBeGreaterThan(0);
    // Intel stays hidden until the directive completes.
    expect(screen.queryByText(/FIELD INTEL RECOVERED/i)).not.toBeInTheDocument();
  });

  it('marks steps done as events happen and reveals intel on completion', async () => {
    renderArchive('/directives');
    await screen.findAllByRole('heading', { level: 1 });
    act(() => {
      progressionStore.dispatch({ type: 'milestone', id: 'route:dashboard' });
      progressionStore.dispatch({ type: 'mark-prologue-seen' });
      progressionStore.dispatch({ type: 'milestone', id: 'terminal-scan' });
    });
    await waitFor(() => {
      expect(screen.getByText(/FIELD INTEL RECOVERED — THE WELL/i)).toBeInTheDocument();
    });
    // OP-01 done, OP-02 is now the current objective.
    const objective = screen.getByRole('region', { name: /current objective/i });
    expect(
      within(objective).getByRole('heading', { name: 'OP-02 · THE GATEWAY TRANSMISSION' })
    ).toBeInTheDocument();
  });
});

describe('dashboard directive tracker', () => {
  it('shows the current directive and its next step', async () => {
    renderArchive('/');
    await screen.findAllByRole('heading', { level: 1 });
    const tracker = screen.getByRole('region', { name: /current objective/i });
    expect(within(tracker).getByText(/OPERATION SILENTIUM/i)).toBeInTheDocument();
    expect(within(tracker).getByText(/OP-01 · FIRST SHIFT/i)).toBeInTheDocument();
    expect(within(tracker).getByText(/NEXT:/i)).toBeInTheDocument();
    expect(within(tracker).getByRole('link', { name: /MISSION CONTROL/i })).toBeInTheDocument();
  });
});

describe('directive completion watcher', () => {
  it('writes a journal line and raises a toast when a directive completes', async () => {
    renderArchive('/');
    await screen.findAllByRole('heading', { level: 1 });
    act(() => {
      // route:dashboard was recorded by the shell already; finish OP-01.
      progressionStore.dispatch({ type: 'mark-prologue-seen' });
      progressionStore.dispatch({ type: 'milestone', id: 'terminal-scan' });
    });
    await waitFor(() => {
      const { journal } = progressionStore.getState().investigation;
      expect(journal.some((j) => j.kind === 'directive' && j.text.includes('OP-01 complete'))).toBe(true);
    });
    expect(screen.getByText(/DIRECTIVE COMPLETE — OP-01 FIRST SHIFT/i)).toBeInTheDocument();
  });
});
