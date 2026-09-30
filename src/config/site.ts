/**
 * Site-wide metadata and the out-of-world fiction notice.
 * `FICTION_NOTICE` must stay visible on every public page (see CONTENT_STYLE_GUIDE).
 *
 * `title` and `description` are SEO/GEO copy. They are duplicated — deliberately —
 * in `index.html` (which no module can import) and mirrored in `src/config/seo.ts`.
 * `src/tests/seo.test.ts` fails the build if any of the three drift, so treat
 * `seo.ts` as the place you edit and let the test tell you what else to change.
 */
export const SITE = {
  name: 'Global Paradigms Corp.',
  /**
   * The homepage <title>. The shell writes this into `document.title` once React
   * mounts, so it — not the tag in index.html — is what Google renders and indexes.
   * 55 characters: brand · year · franchise · format · status.
   */
  title: 'Global Paradigms Corp. // 2006 Lost ARG Hoax — Reopened',
  /** The homepage meta description. 150 characters, answer-first. */
  description:
    'The bankrupt-corporation hoax that misled Lost fans in 2006 — client of the Hanso and Valenzetti Foundations — reopened in 2026 as a new playable ARG.',
  studio: 'Zazie Productions',
  osVersion: 'PARADIGM-OS v8.4.2',
  tagline: 'STRATEGIC FORECASTING // CIVIC CONTINUITY // EST. 1971',
  defaultCallsign: 'GUEST_INVESTIGATOR'
} as const;

/**
 * The out-of-world disclaimer, amended for the domain's real history.
 *
 * The 2006 predecessor is acknowledged rather than denied: this URL genuinely
 * did host an unauthorized fan hoax during The Lost Experience, and pretending
 * otherwise would make the site a worse source about itself. Acknowledging it
 * and disclaiming it in the same breath is both more honest and safer — it
 * states the historical fact without claiming any association with the
 * franchise, and it stops a reader (or an AI engine) inferring one.
 */
export const FICTION_NOTICE = {
  short:
    'FICTION // An original interactive story by Zazie Productions. All organisations, people and events are invented. This domain hosted an unauthorized fan hoax in 2006; the 2026 archive is unrelated to it and to any franchise.',
  long: 'Global Paradigms Corp. is an original work of interactive fiction by Zazie Productions. The company, its staff, projects, products, documents and events are invented. Real place names are used only as fictional settings. Nothing here describes real organisations, people, science or incidents. This domain previously hosted an unrelated, unauthorized fan-made hoax page during the 2006 alternate reality game for a television series; that page was taken down the same year and is not preserved, continued, endorsed or referenced by this work. The 2026 archive is not affiliated with any existing franchise, studio, broadcaster, or the author of that earlier site. No information you type is transmitted anywhere.'
} as const;
