/**
 * Revelation toasts — ephemeral, in-memory notices ("SEAL I BROKEN — ORDO").
 * Never persisted: the investigation journal is the permanent record.
 */
export interface Revelation {
  id: number;
  title: string;
  body: string;
  glyph?: string;
  /** CSS colour for the accent rule / glyph. */
  accent?: string;
}

/** How long a toast stays up. Long enough to read; dismissible at any time. */
export const REVELATION_TTL_MS = 9000;
const MAX_VISIBLE = 3;

type Listener = () => void;

export function createRevelationStore(ttl = REVELATION_TTL_MS) {
  let items: Revelation[] = [];
  let seq = 1;
  const listeners = new Set<Listener>();
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  const emit = () => listeners.forEach((l) => l());

  const dismiss = (id: number) => {
    const t = timers.get(id);
    if (t) clearTimeout(t);
    timers.delete(id);
    const next = items.filter((r) => r.id !== id);
    if (next.length !== items.length) {
      items = next;
      emit();
    }
  };

  return {
    getSnapshot: () => items,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    notify(r: Omit<Revelation, 'id'>): number {
      const id = seq++;
      items = [...items.slice(-(MAX_VISIBLE - 1)), { ...r, id }];
      timers.set(
        id,
        setTimeout(() => dismiss(id), ttl)
      );
      emit();
      return id;
    },
    dismiss
  };
}

export const revelationStore = createRevelationStore();
