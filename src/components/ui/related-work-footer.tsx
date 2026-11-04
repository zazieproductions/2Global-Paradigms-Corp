import { RELATED_WORK } from '@/config/seo-copy';

/** A creator credit outside the fictional archive. */
export function RelatedWorkFooter() {
  return (
    <footer className="border-t border-line pt-4 text-caption text-slate-400">
      {RELATED_WORK.intro}{' '}
      <a
        href={RELATED_WORK.url}
        className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        {RELATED_WORK.label}
      </a>
    </footer>
  );
}
