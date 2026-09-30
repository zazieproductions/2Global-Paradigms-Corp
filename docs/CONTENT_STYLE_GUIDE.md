# Content style guide

How the archive writes. Applies to everything in `src/content/**` and to any in-world string inside a
component: transmissions, objectives, hints, revelations, terminal output, denials, empty states.

The house voice is **a 1971 British strategic-forecasting company that has gone bad underneath**. Most of
the corpus is paperwork: memos, minutes, specs, incident logs, press releases, HR notes. Paperwork is
terse, concrete, and slightly defensive. The fiction is carried by what the paperwork lets slip, not by
how it sounds.

## The one rule

**A number, a date, a name or a place beats an adjective.** If a sentence can be made more specific, it
should be. `Fourteen redoubts and ten thousand seats, timed to one morning` lands; `an immense,
carefully-laid preparation` does not.

## Do

- **Be concrete.** Frequencies, depths, £ figures, dates, station numbers, room numbers, extensions.
- **Let documents contradict each other.** The cover story and the internal subtext disagree on purpose.
- **Keep sentences short, especially in the Order's own papers.** The Rule reads like a set of standing
  orders, because it is one.
- **Use British spelling and British idiom** throughout: `catalogued`, `initialised`, `metre`, `whilst`
  is fine, `fortnightly` is better than `biweekly`.
- **Give characters a tell.** Naylor understates and counts things. Cross writes like someone closing a
  file. Kiernan writes like a man who would like this to be over.
- **Earn the big line.** One aphorism per document, at most, and only from a character with a reason to
  say it.
- **Use real register.** A facilities spec says `Contractors are not to be told what the inlay means.`

## Don't

These are the patterns that make the prose read as machine-written:

| Pattern                                                                               | Instead                                                                                                                                                   |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sentence-internal em-dashes as rhetorical pauses                                      | Split it into two sentences, or use a colon. Em-dashes survive only in document headers (`COUNTER-LEAK ADVISORY — 2019-11-02`) and signatures (`— E.N.`). |
| `It's not X. It's Y.`                                                                 | Say the Y and let the reader infer the X.                                                                                                                 |
| Triads (`seven planets, seven metals, seven days`)                                    | Use the triad once, where the fiction calls for it, and never as decoration.                                                                              |
| Grandiose abstractions (`the tapestry of`, `a testament to`, `the veil between`)      | The concrete fact that produced the feeling.                                                                                                              |
| `the truth lies`, `delve`, `realm`, `myriad`, `speaks to`, `navigate the`             | Cut.                                                                                                                                                      |
| Mystic vagueness (`whispers of`, `echoes of`, `unseen forces`, `forbidden knowledge`) | What was actually heard, and by whom.                                                                                                                     |
| Stock surnames that read as thriller filler                                           | Names should be ordinary and regional.                                                                                                                    |
| Explaining the joke                                                                   | State the fact; trust the reader.                                                                                                                         |

## The Order's voice

The Order does not talk like a cult in a film. Real British esoteric bodies from this period sound like
a vestry meeting crossed with a masonic minute book: procedure, budgets, who was present, what was
minuted, and one line at the end where something else shows through.

- Liturgical material is filed, not intoned. `The Rule`, section IV, not `Liber Carrier §IV`.
- No Latin beyond the Order's own name, the seven Seal-Words (which spell the name), and the degree
  names. Everything else is English.
- The Order's people are employees. They have extensions, expense codes, and opinions about the budget.

## Thorne, and other names to avoid

`Thorne` was the whistleblower's surname for a while and was renamed to `Naylor`. It is on this list
because a surname that appears in every thriller ever written makes a cast read as generated. Prefer
plain, regional, slightly unglamorous names: Naylor, Sedley, Ashby, Kiernan, Holt, Adeyemi, Calderon.

## Before you commit

- Read the paragraph aloud. If you would not say it to a colleague, rewrite it.
- Search the corpus for the phrase you are about to use. If it is already in there, find another one.
- `npm run check` (typecheck, lint, tests, build) must pass; `validate:content` catches dangling
  cross-references and redaction pairs that no longer match.
