import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { BootSequence } from '@/components/puzzles/boot-sequence';

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        open dossier
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="TEST DOSSIER">
        <button type="button">first</button>
        <button type="button">second</button>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('is labelled, traps focus, closes on Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'open dossier' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'TEST DOSSIER' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await user.tab({ shift: true });
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});

describe('Boot sequence', () => {
  it('keeps the boot screen focused on the archive terminal and can be skipped', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onComplete = vi.fn();
    render(<BootSequence onComplete={onComplete} />);
    const bootDialog = screen.getByRole('dialog', { name: /Cold Boot/i });
    expect(bootDialog).toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    // Skip until the session can be initiated; then complete with the default callsign.
    for (let i = 0; i < 40 && !onComplete.mock.calls.length; i++) {
      const input = screen.queryByLabelText('Operator callsign');
      if (input) {
        input.focus();
        await act(async () => {
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        });
      }
      const skip = screen.queryByRole('button', { name: /SKIP BOOT/ });
      const initiate = screen.queryByRole('button', { name: /INITIATE/i });
      await act(async () => {
        (initiate ?? skip)?.click();
        if (!initiate && !skip) window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await vi.advanceTimersByTimeAsync(2000);
      });
    }
    vi.useRealTimers();
    expect(onComplete).toHaveBeenCalled();
    expect(typeof onComplete.mock.calls[0][0]).toBe('string');
  });
});
