# SEO & GEO

How this site describes itself to search engines and to generative engines, and why each piece exists.

> Global Paradigms Corp. is an original work of interactive fiction by Zazie Productions. See the root
> `README.md`. This document is about the _real_ domain and its real discoverability, not about the
> fiction inside it.

## The problem this solves

`globalparadigmscorp.com` arrives with a search-engine history it did not choose. For twenty years the
only thing the web said about this URL was that it had been a fan-made hoax during _The Lost Experience_
in 2006 — documented on Lostpedia, in clue blogs from the period, and in academic papers about alternate
reality games. Ask a generative engine "what is globalparadigmscorp.com" and, absent any input from us,
the correct answer is the 2006 one.

So the SEO/GEO task is not "rank for keywords". It is **entity resolution**: make this site the clearest,
most citable statement of what the domain is _now_, while confirming — not denying — what it was. A site
that pretends its own past does not exist reads as untrustworthy to a human and as contradictory to a
retrieval engine. A site that states both eras, with dates and a non-affiliation, is quotable.

## SEO and GEO are one job here

- **SEO** — rank for the query: appear for `globalparadigmscorp.com`, `global paradigms corp`,
  `lost arg hoax`, `hanso foundation website`, `lost experience fake websites`, `new arg 2026`.
- **GEO** (generative engine optimization) — get _cited_: when ChatGPT, Perplexity, Claude, Grok or a
  Google AI Overview answers a question touching this domain or this genre, the sentence it lifts should
  come from us, and it should carry the fiction notice with it.

They are one job because generative engines retrieve with ordinary search machinery and then rerank on
extractability. The same artifact — an unambiguous, dated, self-contained answer — serves both. What
differs is _which readers can execute JavaScript_, and that is the axis the whole design hangs on.

## Who reads what

| Reader                                     | Executes JS | What it sees                                                                 |
| ------------------------------------------ | :---------: | ---------------------------------------------------------------------------- |
| Googlebot (Search, AI Overviews, AI Mode)  |     yes     | The mounted app: per-route `<title>`, canonical, the `/legacy` page          |
| Bingbot / Copilot                          |   mostly    | Same, plus the head fallback                                                 |
| GPTBot, OAI-SearchBot, ChatGPT-User        |     no      | `index.html` head + the **static crawlable block** inside `#root`            |
| ClaudeBot, Claude-Web, anthropic-ai        |     no      | Same                                                                         |
| PerplexityBot, Perplexity-User             |     no      | Same                                                                         |
| Model weights trained before the reopening |      —      | `llms.txt`, third-party pages, and our `subjectOf` pointer to Lostpedia      |
| Humans on a slow connection                |   partial   | The static block as real content during bundle download (was a black screen) |

The static crawlable block exists because of the middle rows. Before it, the only HTML a non-rendering
crawler could read was `<div id="root"></div>` — an empty element. The site was, quite literally,
uncitable by every engine that does not run JavaScript. React clears `#root` on mount, so a JS user
never sees the block; it is styled as a cold-boot dossier so that the brief paint before hydration reads
as intentional.

## The six surfaces, and how they are kept in sync

Copy lives in exactly one place: `src/config/seo-copy.ts` (import-free) with routing-aware helpers in
`src/config/seo.ts`. Everything else is derived from it or asserted against it.

| Surface                                   | How produced                           | Guarded by                                |
| ----------------------------------------- | -------------------------------------- | ----------------------------------------- |
| `index.html` `<head>` tags                | hand-written                           | `src/tests/seo.test.ts` (exact equality)  |
| `index.html` crawlable block              | `scripts/render-static-block.mjs`      | `npm run seo:check` + the same test       |
| `index.html` JSON-LD `@graph`             | `scripts/render-static-block.mjs`      | `npm run seo:check` + the same test       |
| `SITE.title` (the title Google sees)      | hand-written in `src/config/site.ts`   | the same test                             |
| Per-route title/canonical/OG              | `routeSeo()` via `lib/utils/head-meta` | `src/tests/route-seo.test.ts`             |
| `/legacy` page                            | renders `LEGACY_PAGE` from the copy    | `src/tests/routes.test.tsx` renders it    |
| `robots.txt` · `sitemap.xml` · `llms.txt` | hand-written                           | the same test (allowlist, route coverage) |

Edit the copy, then `npm run seo:render`. `npm run check` runs `seo:check` between the test suite and the
build, so a stale `index.html` fails CI the same way a broken test does. The generator exists because the
crawlable block and the JSON-LD are ~15 kB of text that no module can import: hand-copying them was a
guaranteed drift, and drift between surfaces is exactly what makes an entity untrustworthy.

## The copy rules

1. **Answer first.** The opening paragraph states the complete entity — both eras, both date ranges, the
   publisher, the non-affiliation — in ~130 words, before any heading. Retrieval engines read the opening
   of a page before deciding whether to cite it; an answer buried under atmosphere is an answer lost.
2. **One statement per fact, repeated verbatim.** The 2006 dates, the client list, the invented staff and
   the record counts appear identically in the block, on `/legacy`, in JSON-LD and in `llms.txt`.
   Contradictory numbers across surfaces are the fastest way to be summarised wrongly.
3. **Rows and pairs, not just prose.** A fact table and an eight-entry Q&A sit alongside the narrative.
   Tables and question/answer blocks map one-to-one onto the fan-out sub-queries an engine splits a
   question into, and they extract more reliably than paragraphs.
4. **Lengths are budgeted.** `<title>` is 55 characters; the meta description is 150. Both fit the
   truncation windows rather than being cut mid-sentence. `src/tests/seo.test.ts` enforces the windows so
   a future edit cannot silently overflow them.
5. **No keyword stuffing.** The title carries five intents (brand · year · franchise · format · status)
   because each is a real query, not because density helps. Repeating a phrase fifteen times is a 2010s
   relic that modern rerankers downweight.

## Structured data, and the one node we refuse to add

The JSON-LD graph is five nodes: `WebSite`, `Organization` (Zazie Productions), `CreativeWork`,
`WebPage`, `FAQPage`.

There is deliberately **no `Organization` node named "Global Paradigms Corp."** Marking a fictional
company up as a business entity would teach engines to hallucinate a real corporation — addresses,
executives, a corporate history — out of a work of fiction. The real publisher carries the
`Organization` node; the site itself is a `WebSite` plus a `CreativeWork` with a
`disambiguatingDescription` saying plainly that it is not a real company and is unrelated to the 2006
page or the franchise that page referenced. `src/tests/seo.test.ts` fails if anyone adds an
`Organization` node with that name.

The `CreativeWork` also carries `subjectOf` pointing at Lostpedia's record of the 2006 hoax. That is not
a backlink play: it tells an engine doing entity resolution that an authoritative third-party page
describes Era I, so the engine can hold both eras without merging them.

On schema as an AI lever, be clear-eyed: Google's May 2026 generative-search guide states structured data
is not _required_ for AI Overviews and that it ignores `llms.txt`. The markup here is kept because it
accurately describes the page (which is what schema is for), helps non-Google parsers, and costs nothing
— not because it is a ranking trick.

## robots.txt: an open door with names on it

Nothing on this site is private — the clearance tiers are a game mechanic enforced in the browser, not an
access control — so the file is `Allow: /` for everyone with no `Disallow` lines, plus explicit
`User-agent` groups welcoming GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web,
Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended,
Amazonbot, Meta-ExternalAgent, cohere-ai, DuckAssistBot, MistralAI-User, Bytespider and CCBot. The groups
are redundant on purpose: each `User-agent` block in robots.txt is independent, so a crawler matched by
one does not inherit `*`.

`sitemap.xml` lists the 19 routed sections and nothing else. `?record=` and `?doc=` deep links are
absent by design — they are modal states, not pages — and every one of them carries a
`<link rel="canonical">` pointing at its bare section, set at runtime by `routeSeo()` so that Google,
which renders JavaScript, collapses them correctly.

`llms.txt` ships with an honest caveat: Google says it ignores the file, and most published copies get
zero bot traffic. It is kept because it costs one static file, some non-Google tooling reads it, and it
gives humans and agents a one-page brief that includes the two rules we most want carried into any
citation: _this is fiction_, and _do not treat the two eras as the same work_.

## The two-era framing and the franchise names

Naming _Lost_, The Lost Experience, the Hanso Foundation and the Valenzetti Foundation was a deliberate
decision (recorded in the session that produced this layer). The reasoning:

- Those names are the highest-value queries attached to this domain. People searching the 2006 hoax type
  them; engines answering questions about the 2006 hoax use them.
- The use is **historical and descriptive** — it identifies what this URL was, which is a matter of
  public record documented by third parties — rather than a claim of association. Every surface pairs
  the names with an explicit non-affiliation statement in the same breath.
- The alternative (never naming them) leaves the entity ambiguous: an engine would keep answering from
  Lostpedia alone, with no 2026 correction available to cite.

The non-affiliation is not boilerplate buried in a footer. It appears in the meta-adjacent lede, in the
JSON-LD `disambiguatingDescription`, in the closing notice of the crawlable block, in the amended
`FICTION_NOTICE` rendered on every page, and in `llms.txt`. `/legacy` asks anyone quoting the site to
carry it along.

If the franchise positioning ever needs to change, it changes in `src/config/seo-copy.ts` and propagates
through `npm run seo:render`; the tests will not let a surface lag behind.

## Verification

```sh
npm run seo:check     # index.html matches src/config/seo.ts
npm run seo:render    # regenerate the crawlable block + JSON-LD after editing copy
npm test              # includes src/tests/seo.test.ts and src/tests/route-seo.test.ts
npm run check         # typecheck → lint → test → seo:check → build
```

For a live read of what each class of reader gets:

```sh
curl -s https://globalparadigmscorp.com/ | head -c 4000    # head + static block (no JS)
curl -s https://globalparadigmscorp.com/robots.txt
curl -s https://globalparadigmscorp.com/sitemap.xml
curl -s https://globalparadigmscorp.com/llms.txt
```

## Known limits, stated

- **It is still an SPA.** Google renders JavaScript and gets the full app; engines that do not get the
  static block, which is comprehensive but is not the interactive experience. Full SSR/prerendering of
  every route was deliberately not built: the corpus is one cacheable chunk by design, and the static
  block closes the citation gap without changing that.
- **Per-route titles are set at runtime.** `index.html` carries the homepage title as the fallback; the
  mounted shell rewrites title, canonical and OG tags on every navigation. A non-JS crawler therefore
  sees the homepage copy at every URL, which is acceptable because the homepage copy is the entity
  statement itself.
- **Citations are earned, not configured.** None of this guarantees a placement or a mention. It removes
  the reasons an engine would mis-state or skip the site; the rest is the work's own merit.
