/**
 * Mobile UX guarantees.
 *
 * The archive is a dense desktop terminal; these tests lock in the handful of
 * affordances that keep it usable on a phone, where there is no hover, no
 * physical keyboard and no room for ten header controls.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

beforeEach(() => {
  progressionStore.dispatch({ type: 'reset' });
});

describe('viewport', () => {
  // Root-absolute so it does not trip the repo's `../` import ban.
  const html = Object.values(
    import.meta.glob('/index.html', { query: '?raw', import: 'default', eager: true })
  )[0] as string;

  it('opts into the full screen on notched devices', () => {
    expect(html).toMatch(/name="viewport"[\s\S]*?viewport-fit=cover/);
  });

  it('allows the user to zoom (no maximum-scale / user-scalable lock)', () => {
    expect(html).not.toMatch(/maximum-scale/);
    expect(html).not.toMatch(/user-scalable\s*=\s*no/);
  });
});

describe('top bar on a phone', () => {
  it('keeps every control the narrow bar drops reachable from the overflow menu', async () => {
    const user = userEvent.setup();
    renderArchive('/');

    await user.click(await screen.findByRole('button', { name: /more archive controls/i }));

    const menu = screen.getByRole('menu', { name: /more archive controls/i });

    // Actions
    for (const name of [/GPC:\/\/CLI/i, /whistleblower safe/i, /archive guide/i]) {
      expect(within(menu).getByRole('menuitem', { name })).toBeVisible();
    }
    // Preferences (checkable)
    for (const name of [/CRT scanlines/i, /interface sounds/i]) {
      expect(within(menu).getByRole('menuitemcheckbox', { name })).toBeVisible();
    }
  });

  it('opens the command terminal from the overflow menu (no `~` key on a phone)', async () => {
    const user = userEvent.setup();
    renderArchive('/');

    await user.click(await screen.findByRole('button', { name: /more archive controls/i }));
    await user.click(screen.getByRole('menuitem', { name: /GPC:\/\/CLI/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/terminal command|gpc-terminal-input/i)).toBeInTheDocument();
  });

  it('reports toggle state so the menu works with a screen reader', async () => {
    const user = userEvent.setup();
    renderArchive('/');

    await user.click(await screen.findByRole('button', { name: /more archive controls/i }));
    const crt = screen.getByRole('menuitemcheckbox', { name: /CRT scanlines/i });
    expect(crt).toHaveAttribute('aria-checked', 'false');

    await user.click(crt);
    await user.click(screen.getByRole('button', { name: /more archive controls/i }));
    expect(screen.getByRole('menuitemcheckbox', { name: /CRT scanlines/i })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('closes the overflow menu on Escape', async () => {
    const user = userEvent.setup();
    renderArchive('/');

    const trigger = await screen.findByRole('button', { name: /more archive controls/i });
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('navigation drawer', () => {
  it('is toggled by the hamburger and reports its state', async () => {
    const user = userEvent.setup();
    renderArchive('/');

    const toggle = await screen.findByRole('button', { name: /open archive sections/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'archive-sidebar');

    await user.click(toggle);
    expect(screen.getByRole('button', { name: /close archive sections/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('closes itself when the operator navigates', async () => {
    const user = userEvent.setup();
    renderArchive('/');

    await user.click(await screen.findByRole('button', { name: /open archive sections/i }));
    const nav = screen.getByRole('navigation', { name: /primary/i });
    await user.click(within(nav).getAllByRole('link')[1]);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /open archive sections/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    );
  });
});
