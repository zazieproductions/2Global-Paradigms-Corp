/**
 * Watches the progression store for newly completed directives / chapters and
 * celebrates them: a revelation toast plus a permanent journal line. The ref
 * is seeded on mount, so a reload never re-announces old completions.
 */
import { useEffect, useRef } from 'react';
import {
  DIRECTIVES,
  DIRECTIVE_CHAPTERS,
  directivesInChapter,
  getChapter
} from '@/content/puzzles/directives';
import { directiveComplete } from '@/lib/puzzles/directives';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { notify } from '@/hooks/use-investigation';
import { useProgression } from '@/hooks/use-progression';

export function DirectiveWatcher() {
  const { state, addJournal } = useProgression();
  const seenDirectives = useRef<Set<string> | null>(null);
  const seenChapters = useRef<Set<string> | null>(null);

  useEffect(() => {
    const completedNow = DIRECTIVES.filter((d) => directiveComplete(state, d));
    const completedIds = new Set(completedNow.map((d) => d.id));
    const chaptersDoneNow = DIRECTIVE_CHAPTERS.filter((c) =>
      directivesInChapter(c.id).every((d) => completedIds.has(d.id))
    );

    // Seed on first render: nothing to announce for progress made earlier.
    if (seenDirectives.current === null || seenChapters.current === null) {
      seenDirectives.current = new Set(completedNow.map((d) => d.id));
      seenChapters.current = new Set(chaptersDoneNow.map((c) => c.id));
      return;
    }

    const fresh = completedNow.filter((d) => !seenDirectives.current!.has(d.id));
    const freshChapters = chaptersDoneNow.filter((c) => !seenChapters.current!.has(c.id));
    if (!fresh.length) return;

    for (const d of fresh) seenDirectives.current.add(d.id);
    for (const c of freshChapters) seenChapters.current.add(c.id);

    // Journal every new directive; toast it; then toast chapter completions.
    for (const d of fresh) addJournal(d.journal, 'directive');
    const last = fresh[fresh.length - 1];
    gpcAudio.playUiSound('grant');
    notify(
      `DIRECTIVE COMPLETE — ${last.code} ${last.title}`,
      `FIELD INTEL RECOVERED: ${last.intel.title}. Mission Control has your next objective.`,
      '✦',
      getChapter(last.chapterId)?.accent
    );
    for (const c of freshChapters) {
      notify(
        `${c.code} COMPLETE — ${c.title}`,
        `Standing raised: ${c.standing}. The next block of directives has been released.`,
        '◈',
        c.accent
      );
    }
  }, [state, addJournal]);

  return null;
}
