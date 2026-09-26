import { X } from 'lucide-react';
import { PlanetGlyph } from '@/components/ui/sigils';
import { useRevelations } from '@/hooks/use-investigation';

/** Toasts that appear when seals break / fragments are found. Announced politely. */
export function RevelationToasts() {
  const { revelations, dismiss } = useRevelations();
  return (
    <div
      className="fixed bottom-16 right-4 z-[60] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]"
      role="status"
      aria-live="polite"
    >
      {revelations.map((r) => {
        const accent = r.accent || 'var(--color-order)';
        return (
          <div
            key={r.id}
            className="ovp-revelation relative p-3 pr-8 rounded border bg-[#07060c]/95 backdrop-blur shadow-2xl"
            style={{
              borderColor: accent,
              boxShadow: `0 0 30px color-mix(in srgb, ${accent} 20%, transparent)`
            }}
          >
            <button
              type="button"
              onClick={() => dismiss(r.id)}
              aria-label="Dismiss notice"
              className="absolute top-2 right-2 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden />
            </button>
            <div className="flex gap-3 items-start">
              {r.glyph && (
                <PlanetGlyph glyph={r.glyph} className="text-2xl leading-none" style={{ color: accent }} />
              )}
              <div>
                <p className="font-occult text-xs tracking-widest font-bold" style={{ color: accent }}>
                  {r.title}
                </p>
                <p className="text-label text-slate-300 mt-0.5 leading-snug">{r.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
