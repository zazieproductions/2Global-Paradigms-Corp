/**
 * Site-wide metadata and the out-of-world fiction notice.
 * `FICTION_NOTICE` must stay visible on every public page (see CONTENT_STYLE_GUIDE).
 */
export const SITE = {
  name: 'Global Paradigms Corp.',
  title: 'Global Paradigms Corp. // Secure Archive & Intelligence Repository',
  studio: 'Zazie Productions',
  osVersion: 'PARADIGM-OS v8.4.2',
  tagline: 'STRATEGIC FORECASTING // CIVIC CONTINUITY // EST. 1971',
  defaultCallsign: 'GUEST_INVESTIGATOR'
} as const;

export const FICTION_NOTICE = {
  short:
    'FICTION // An original interactive story by Zazie Productions. All organisations, people and events are invented.',
  long: 'Global Paradigms Corp. is an original work of interactive fiction by Zazie Productions. The company, its staff, projects, products, documents and events are invented. Real place names are used only as fictional settings. Nothing here describes real organisations, people, science or incidents, and it is not affiliated with any existing franchise, studio or prior third-party website. No information you type is transmitted anywhere.'
} as const;
