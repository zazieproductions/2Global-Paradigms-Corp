/**
 * Archive shell — a docked, non-modal command console for navigating the
 * archive by typed command.
 *
 * It is deliberately a real shell rather than a movie terminal: a prompt that
 * shows the operator, the host and the current route; a scrollback of
 * commands and their output; tab completion; `↑`/`↓` history recall; `Ctrl+L`,
 * `Ctrl+C`; and a `command not found` that tells you what to type instead.
 *
 * Boundaries:
 *  - It navigates and reports. It never changes progression state, never
 *    reveals a redaction, never names an answer. The one thing it hands off is
 *    the Channel 9 backdoor (`cli`), which owns all of that.
 *  - Non-modal on purpose: the archive behind it stays readable and usable
 *    while the shell is open, so it is a `region`, not a `dialog`, and it
 *    traps nothing. Escape closes it only while focus is inside it.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp, ChevronDown, ChevronUp, Terminal as TerminalIcon, X } from 'lucide-react';
import { NAV_ITEMS, type NavItem } from '@/config/navigation';
import { SITE } from '@/config/site';
import { SHELL_ALIASES, SHELL_COMMANDS, SHELL_HELP_HEADING, SHELL_INTRO } from '@/content';
import { getArchiveEntries } from '@/lib/archive/records';
import { searchArchive } from '@/lib/search/search-index';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { useInvestigation } from '@/hooks/use-investigation';
import { useArchiveUi } from '@/app/archive-ui-context';
import { cn } from '@/lib/utils/cn';

interface ArchiveShellTerminalProps {
  open: boolean;
  onClose: () => void;
  /** Opens the Channel 9 backdoor (the puzzle terminal). */
  onOpenCli: () => void;
  /** Opens the unscheduled Channel 9 transmission (first-run message). */
  onOpenTransmission: () => void;
  /** Replays the cold-boot sequence. */
  onReplayBoot: () => void;
}

type LineKind = 'in' | 'out' | 'dim' | 'err' | 'ok' | 'accent';

interface Line {
  id: number;
  kind: LineKind;
  text: string;
}

const KIND_CLASS: Record<LineKind, string> = {
  in: 'text-slate-200',
  out: 'text-slate-300',
  dim: 'text-slate-500',
  err: 'text-rose-400',
  ok: 'text-emerald-400',
  accent: 'text-cyan-300'
};

/** Directory name of a section: `/documents` → `documents`, `/` → dashboard. */
const dirName = (item: NavItem) => item.path.replace(/^\//, '') || item.id;

const slug = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isTypingTarget = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/**
 * Resolve a section token against ids, paths, labels and aliases.
 * `~`, `/`, `.` and `..` all mean the dashboard: the routes are flat, so there
 * is no parent directory to walk up into.
 */
function resolveSection(token: string): NavItem | null {
  const raw = token.trim().toLowerCase().replace(/\/+$/, '');
  const bare = raw.replace(/^\//, '');
  if (bare === '' || bare === '~' || bare === '.' || bare === '..') {
    return NAV_ITEMS.find((i) => i.id === 'dashboard') ?? null;
  }
  const id = SHELL_ALIASES[bare] ?? bare;
  return (
    NAV_ITEMS.find((i) => i.id === id) ??
    NAV_ITEMS.find((i) => dirName(i) === bare) ??
    NAV_ITEMS.find((i) => slug(i.label) === bare) ??
    null
  );
}

export function ArchiveShellTerminal({
  open,
  onClose,
  onOpenCli,
  onOpenTransmission,
  onReplayBoot
}: ArchiveShellTerminalProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ui = useArchiveUi();
  const progression = useProgression();
  const investigation = useInvestigation();
  const { state, clearance, setCallsign, setPreference } = progression;
  const { earnedLevel, solved } = investigation;

  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [recall, setRecall] = useState(-1);
  const [minimized, setMinimized] = useState(false);
  const [hits, setHits] = useState<string[]>([]);
  const shownTransmission = useRef(false);
  const showedPrompt = useRef(false);

  const emit = useCallback((text: string, kind: LineKind = 'out') => {
    setLines((prev) => [...prev, { id: nextId.current++, kind, text }].slice(-400));
  }, []);

  const emitMany = useCallback(
    (rows: Array<[string, LineKind?]>) => {
      rows.forEach(([text, kind]) => emit(text, kind ?? 'out'));
    },
    [emit]
  );

  // Keep the scrollback pinned to the newest line (never scrolls the page).
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines, open, minimized]);

  const route = pathname || '/';
  const section = NAV_ITEMS.find((i) => i.path === route);
  const promptPath = route;
  const operator = state.callsign.toLowerCase().slice(0, 24) || 'operator';
  const prompt = `${operator}@vault0:${promptPath}$`;

  // Opening the shell prints the login banner once per page load.
  useEffect(() => {
    if (!open || showedPrompt.current) return;
    showedPrompt.current = true;
    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    emitMany([
      [SHELL_INTRO.banner, 'accent'],
      [
        `last login: ${stamp} UTC · operator ${state.callsign.toUpperCase()} · clearance ${clearance.toUpperCase()}`,
        'dim'
      ],
      [SHELL_INTRO.hint, 'dim']
    ]);
    if (!state.investigation.prologueSeen && !shownTransmission.current) {
      shownTransmission.current = true;
      emit(SHELL_INTRO.transmissionWaiting, 'accent');
    }
  }, [open, emit, emitMany, clearance, state.callsign, state.investigation.prologueSeen]);

  // Move focus into the shell when it opens, but never pop a phone keyboard
  // and never steal focus the operator already placed somewhere.
  useEffect(() => {
    if (!open) return;
    const fine = window.matchMedia?.('(pointer: fine)').matches ?? true;
    if (!fine || isTypingTarget(document.activeElement)) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  /** Records a record-shaped argument (code, id or exact title) → route + kind. */
  const lookupRecord = useCallback((token: string) => {
    const t = token.trim().toLowerCase();
    return (
      getArchiveEntries().find(
        (e) => e.id.toLowerCase() === t || e.code.toLowerCase() === t || slug(e.title) === t
      ) ?? null
    );
  }, []);

  const openTarget = useCallback(
    (token: string) => {
      if (!token) {
        emit('open: which section? try `ls`.', 'err');
        return;
      }
      const hit = /^#?(\d+)$/.exec(token);
      if (hit && hits.length) {
        const index = Number(hit[1]);
        const target = hits[index - 1];
        if (!target) {
          emit(`open: no hit ${index} in the last search (1-${hits.length}).`, 'err');
          return;
        }
        const entry = lookupRecord(target);
        if (!entry) {
          emit(`open: hit ${index} is no longer in the index.`, 'err');
          return;
        }
        if (entry.kind === 'document') ui.openDocument(entry.id);
        else navigate(entry.route);
        emit(`→ ${entry.code} · ${entry.title}`, 'dim');
        return;
      }
      const sectionMatch = resolveSection(token);
      if (sectionMatch) {
        ui.navigateToTab(sectionMatch.id);
        emit(`→ ${dirName(sectionMatch)} · ${sectionMatch.label}`, 'dim');
        return;
      }
      const record = lookupRecord(token);
      if (record) {
        if (record.kind === 'document') ui.openDocument(record.id);
        else navigate(record.route);
        emit(`→ ${record.code} · ${record.title}`, 'dim');
        return;
      }
      emit(`open: no section or record matches '${token}'.`, 'err');
      emit('sections: `ls`. records: `find <terms>`.', 'dim');
    },
    [emit, hits, lookupRecord, navigate, ui]
  );

  const run = useCallback(
    (raw: string) => {
      const trimmed = raw.trim().slice(0, 120);
      if (!trimmed) return;
      setHistory((h) => [...h, trimmed].slice(-100));
      setRecall(-1);
      setInputVal('');
      gpcAudio.playUiSound('keystroke');

      const [head, ...rest] = trimmed.split(/\s+/);
      const cmd = head.toLowerCase();
      const arg = rest.join(' ');
      emit(prompt + ' ' + trimmed, 'in');

      switch (cmd) {
        case 'help': {
          if (arg) {
            const one = SHELL_COMMANDS.find((c) => c.cmd === arg.toLowerCase());
            if (!one) {
              emit(`help: no such command: ${arg}.`, 'err');
              break;
            }
            emit(`usage: ${one.cmd}${one.arg ? ` ${one.arg}` : ''}`, 'accent');
            emit(`  ${one.desc}`);
            break;
          }
          emit(SHELL_HELP_HEADING, 'accent');
          const width = Math.max(...SHELL_COMMANDS.map((c) => `${c.cmd} ${c.arg ?? ''}`.length));
          for (const c of SHELL_COMMANDS) {
            const usage = `${c.cmd}${c.arg ? ` ${c.arg}` : ''}`;
            emit(`  ${usage.padEnd(width)}   ${c.desc}`);
          }
          emit('sections are also arguments: `cd documents`, `open personnel`.', 'dim');
          break;
        }

        case 'ls': {
          if (arg) {
            const target = resolveSection(arg);
            if (!target) {
              emit(`ls: no such section: ${arg}.`, 'err');
              emit('run `ls` for the section list.', 'dim');
              break;
            }
            emit(`${target.path} · ${target.label}`);
            emit(`  mounted at ${target.path} · index ${target.badge}`);
            emit(`  open with: cd ${dirName(target)}`);
            break;
          }
          const width = Math.max(...NAV_ITEMS.map((i) => dirName(i).length));
          emit('SECTION'.padEnd(width) + '   INDEX     ROUTE');
          for (const item of NAV_ITEMS) {
            emit(`${(dirName(item) + '/').padEnd(width)}   ${item.badge.padEnd(9)} ${item.path}`);
          }
          emit(`${NAV_ITEMS.length} sections · \`cd <section>\` to open one`, 'dim');
          break;
        }

        case 'cd':
        case 'open':
        case 'goto':
        case 'go': {
          if (!arg) {
            if (cmd !== 'cd') {
              emit(`${cmd}: which section or record?`, 'err');
              break;
            }
          }
          openTarget(arg || '~');
          break;
        }

        case 'pwd':
          emit(route);
          emit(section ? `${section.label} — ${section.badge} on the index` : 'not a routed section', 'dim');
          break;

        case 'read': {
          if (!arg) {
            emit('read: name a document code or record id. `find <terms>` lists candidates.', 'err');
            break;
          }
          const record = lookupRecord(arg);
          if (!record) {
            emit(`read: no document matches '${arg}'.`, 'err');
            break;
          }
          if (record.kind !== 'document') {
            emit(
              `read: '${record.code}' is a ${record.kind}, not a document. open it with: open ${record.code}`,
              'err'
            );
            break;
          }
          ui.openDocument(record.id);
          emit(`→ ${record.code} · ${record.title}`, 'dim');
          break;
        }

        case 'find':
        case 'search': {
          if (!arg) {
            emit('find: give me something to look for. quotes keep phrases together.', 'err');
            break;
          }
          const results = searchArchive({ text: arg, limit: 8 });
          setHits(results.map((r) => r.entry.id));
          if (!results.length) {
            emit(`find: 0 records match '${arg}'.`, 'err');
            emit('find matches one term at a time. For filters and phrases use the search palette: /', 'dim');
            break;
          }
          emit(`${results.length} of ${getArchiveEntries().length} records match '${arg}':`, 'accent');
          results.forEach((r, i) => {
            const snippet = r.snippet.replace(/\s+/g, ' ').trim();
            emit(`  [${i + 1}] ${r.entry.code} · ${r.entry.title}`);
            emit(`      ${snippet.length > 96 ? `${snippet.slice(0, 96)}…` : snippet}`, 'dim');
          });
          emit('open one with: open <n>', 'dim');
          break;
        }

        case 'back':
          navigate(-1);
          emit('back', 'dim');
          break;

        case 'history':
          if (!history.length) {
            emit('history: nothing typed yet.', 'dim');
            break;
          }
          history.forEach((h, i) => emit(`  ${String(i + 1).padStart(3)}  ${h}`));
          break;

        case 'clear':
          setLines([]);
          break;

        case 'whoami':
          emit(`operator: ${state.callsign}`);
          emit(`clearance: ${clearance} (earned level ${earnedLevel})`);
          emit(`seals broken: ${solved.length} of 7`);
          emit(`redaction de-scrambler: ${progression.unredacted ? 'active' : 'inactive'}`);
          emit(`shell: vault0 (read-only index) · route ${route}`, 'dim');
          emit('the case file is not reachable from this shell — the backdoor owns it (`cli`).', 'dim');
          break;

        case 'callsign': {
          if (!arg) {
            emit(`callsign: ${state.callsign}`);
            emit(`set it with: callsign <name>`, 'dim');
            break;
          }
          const next = arg.trim().slice(0, 24);
          setCallsign(next);
          emit(`callsign: ${next || SITE.defaultCallsign}`, 'ok');
          break;
        }

        case 'crt':
        case 'sound': {
          const want = arg.toLowerCase();
          const current = cmd === 'crt' ? state.preferences.crt : state.preferences.sound;
          if (want && want !== 'on' && want !== 'off') {
            emit(`${cmd}: usage: ${cmd} [on|off]`, 'err');
            break;
          }
          const next = want ? want === 'on' : !current;
          setPreference(cmd, next);
          emit(`${cmd}: ${next ? 'on' : 'off'}`, next ? 'ok' : 'dim');
          break;
        }

        case 'transmission':
          onOpenTransmission();
          emit(SHELL_INTRO.transmissionOpened, 'dim');
          break;

        case 'cli':
        case 'terminal':
          onOpenCli();
          emit(SHELL_INTRO.cliOpened, 'dim');
          break;

        case 'boot':
          onReplayBoot();
          emit(SHELL_INTRO.bootReplay, 'dim');
          break;

        case 'exit':
        case 'quit':
        case 'close':
          onClose();
          return;

        default:
          emit(`vault0: ${cmd}: command not found`, 'err');
          emit(SHELL_INTRO.notFoundHint, 'dim');
          break;
      }
    },
    [
      clearance,
      emit,
      earnedLevel,
      history,
      lookupRecord,
      navigate,
      onClose,
      onOpenCli,
      onOpenTransmission,
      onReplayBoot,
      openTarget,
      prompt,
      progression.unredacted,
      route,
      section,
      setPreference,
      solved.length,
      setCallsign,
      state.callsign,
      state.preferences.crt,
      state.preferences.sound,
      ui
    ]
  );

  /** Tab completion: commands in the first word, sections after cd/open/ls. */
  const complete = useCallback(
    (value: string) => {
      const trailing = value.endsWith(' ') || value === '';
      const parts = value.split(/\s+/).filter(Boolean);
      const first = parts[0] ?? '';
      const wantsSection =
        !trailing && parts.length > 1 && ['cd', 'open', 'goto', 'go', 'ls'].includes(first.toLowerCase());
      if (!wantsSection) {
        const names = SHELL_COMMANDS.map((c) => c.cmd);
        const matches = names.filter((n) => n.startsWith(first.toLowerCase()));
        if (!matches.length) return;
        if (matches.length === 1) {
          setInputVal(`${matches[0]} `);
          return;
        }
        const common = matches.reduce((acc, n) => {
          let i = 0;
          while (i < acc.length && i < n.length && acc[i] === n[i]) i++;
          return acc.slice(0, i);
        });
        setInputVal(common);
        emit(matches.join('   '), 'dim');
        return;
      }
      const token = parts[parts.length - 1].toLowerCase();
      const names = [...new Set([...Object.keys(SHELL_ALIASES), ...NAV_ITEMS.map(dirName)])].sort();
      const matches = names.filter((n) => n.startsWith(token));
      if (!matches.length) return;
      if (matches.length === 1) {
        setInputVal([...parts.slice(0, -1), matches[0]].join(' ') + ' ');
        return;
      }
      const common = matches.reduce((acc, n) => {
        let i = 0;
        while (i < acc.length && i < n.length && acc[i] === n[i]) i++;
        return acc.slice(0, i);
      });
      setInputVal([...parts.slice(0, -1), common].join(' '));
      emit(matches.join('   '), 'dim');
    },
    [emit]
  );

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const index = recall === -1 ? history.length - 1 : Math.max(recall - 1, 0);
      setRecall(index);
      setInputVal(history[index]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (recall === -1) return;
      const index = recall + 1;
      if (index >= history.length) {
        setRecall(-1);
        setInputVal('');
      } else {
        setRecall(index);
        setInputVal(history[index]);
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      complete(inputVal);
      return;
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
      return;
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      emit(`${prompt} ${inputVal}^C`, 'in');
      setInputVal('');
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const sectionsHint = useMemo(() => NAV_ITEMS.map(dirName).join(' '), []);

  return (
    <section
      aria-label="Archive shell"
      hidden={!open}
      className="shrink-0 flex flex-col bg-void border-t border-line-strong font-mono text-caption"
    >
      <div className="flex items-center gap-2 px-2 py-1 bg-shell border-b border-line-subtle">
        <TerminalIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden />
        <span className="text-slate-400 truncate">
          ARCHIVE SHELL <span className="text-slate-600">·</span> {promptPath}
        </span>
        <span className="hidden md:inline text-slate-600 truncate">sections: {sectionsHint}</span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => {
            setMinimized((v) => !v);
            gpcAudio.playUiSound('click');
          }}
          className="tap-target p-1 rounded text-slate-400 hover:text-white hover:bg-hover cursor-pointer"
          aria-label={minimized ? 'Expand the archive shell' : 'Minimize the archive shell'}
          aria-expanded={!minimized}
        >
          {minimized ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="tap-target p-1 rounded text-slate-400 hover:text-white hover:bg-hover cursor-pointer"
          aria-label="Close the archive shell"
        >
          <X className="w-3.5 h-3.5" aria-hidden />
        </button>
      </div>

      {!minimized && (
        <div
          ref={logRef}
          role="log"
          aria-label="Shell output"
          aria-live="polite"
          onClick={() => inputRef.current?.focus()}
          className="h-[min(26vh,15rem)] sm:h-[min(32vh,15rem)] overflow-y-auto overscroll-contain px-2 py-2 space-y-0.5 scrollbar-thin break-words"
        >
          {lines.map((line) => (
            <p key={line.id} className={cn('whitespace-pre-wrap', KIND_CLASS[line.kind])}>
              {line.text}
            </p>
          ))}
        </div>
      )}

      <form
        className="flex items-center gap-2 px-2 py-1.5 bg-shell border-t border-line-subtle shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          run(inputVal);
        }}
      >
        <label
          htmlFor="gpc-shell-input"
          className="shrink-0 text-cyan-400 truncate max-w-[45%] hidden xs:inline"
        >
          {prompt}
        </label>
        <label htmlFor="gpc-shell-input" className="shrink-0 text-cyan-400 xs:hidden">
          <span className="sr-only">Archive shell command</span>
          <span aria-hidden>$</span>
        </label>
        <input
          id="gpc-shell-input"
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          enterKeyHint="send"
          spellCheck={false}
          maxLength={200}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="help · ls · cd documents · find svalbard"
          aria-label="Archive shell command"
          className="flex-1 min-w-0 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
        />
        <button
          type="button"
          onClick={() => {
            if (!history.length) return;
            const index = recall === -1 ? history.length - 1 : Math.max(recall - 1, 0);
            setRecall(index);
            setInputVal(history[index]);
            inputRef.current?.focus();
          }}
          disabled={!history.length}
          aria-label="Recall previous command"
          className="tap-target sm:hidden shrink-0 px-2 py-1 rounded border border-line-bright bg-hover text-slate-300 disabled:opacity-40"
        >
          <ArrowUp className="w-3.5 h-3.5" aria-hidden />
        </button>
        <button
          type="submit"
          className="tap-target sm:hidden shrink-0 px-2.5 py-1 rounded border border-cyan-500/60 bg-cyan-950 text-cyan-300 font-bold"
        >
          RUN
        </button>
      </form>
    </section>
  );
}
