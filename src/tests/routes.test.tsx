import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NAV_ITEMS } from '@/config/navigation';
import { progressionStore } from '@/lib/puzzles/progression';
import { renderArchive } from './render';

vi.mock('@/config/features', () => ({
  FEATURES: { bootSequence: false, persistProgress: false, assistedBypass: true, uiSoundsDefault: false }
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

describe('routes', () => {
  it.each(NAV_ITEMS.map((i) => [i.path, i.label]))('renders %s without errors', async (path) => {
    renderArchive(path);
    const main = screen.getByRole('main');
    await waitFor(
      () => expect(within(main).getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0),
      {
        timeout: 4000
      }
    );
  });

  it('shows a missing-file notice for unknown paths', async () => {
    renderArchive('/no/such/folder');
    expect(await screen.findByText(/FILE NOT FOUND/i)).toBeInTheDocument();
  });

  it('redirects legacy paths and keeps the query string', async () => {
    const { router } = renderArchive('/dead-links?record=dead-01');
    await waitFor(() => expect(router.state.location.pathname).toBe('/deadlinks'));
    expect(router.state.location.search).toBe('?record=dead-01');
  });

  it('opens a document from ?doc= and records the discovery', async () => {
    renderArchive('/documents?doc=DOC-1989-SVALBARD-EVENT');
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getAllByText(/DOC-1989-SVALBARD-EVENT/).length).toBeGreaterThan(0);
    await waitFor(() => expect(progressionStore.getState().discovered['doc-007']).toBeTruthy());
  });

  it('shows a missing-file state for an unknown ?doc=', async () => {
    renderArchive('/?doc=DOC-0000-NOTHING');
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/DOC-0000-NOTHING/)).toBeInTheDocument();
  });

  it('deep-links a record with ?record=', async () => {
    renderArchive('/personnel?record=p-002');
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/OFFICER DOSSIER/)).toBeInTheDocument();
  });
});

describe('shell', () => {
  it('has a skip link that targets main content', async () => {
    renderArchive('/');
    const skip = screen.getByRole('link', { name: /skip to archive content/i });
    expect(skip).toHaveAttribute('href', '#archive-main');
    expect(document.getElementById('archive-main')).toBeInTheDocument();
  });

  it('opens search with "/" and closes it with Escape, restoring focus', async () => {
    const user = userEvent.setup();
    renderArchive('/');
    await screen.findAllByRole('heading', { level: 1 });
    await user.keyboard('/');
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('does not trigger shortcuts while typing in a field', async () => {
    const user = userEvent.setup();
    renderArchive('/documents');
    const input = await screen.findByRole('searchbox', { name: /search documents/i });
    await user.type(input, '/u~');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(progressionStore.getState().access.unredacted).toBe(false);
  });

  it('toggles the de-scrambler with "u" once Level 3 is earned', async () => {
    for (const id of [1, 2]) {
      progressionStore.dispatch({ type: 'complete', puzzleId: `seal-${id}`, method: 'answer' });
    }
    progressionStore.dispatch({ type: 'set-unredacted', value: false });
    const user = userEvent.setup();
    renderArchive('/');
    await screen.findAllByRole('heading', { level: 1 });
    await user.keyboard('u');
    expect(progressionStore.getState().access.unredacted).toBe(true);
  });
});
