import {
  BarChart3,
  Briefcase,
  Building2,
  Clock,
  Compass,
  FileText,
  FolderLock,
  GraduationCap,
  LayoutDashboard,
  Link2Off,
  Mail,
  MapPin,
  Newspaper,
  PackageX,
  Radio,
  Users,
  Wrench,
  type LucideIcon
} from 'lucide-react';
import type { ActiveTab } from '@/types';
import {
  ANNUAL_REPORTS,
  AUDIO_ARTIFACTS,
  DEAD_LINKS,
  DEPARTMENTS,
  DISCONTINUED_PRODUCTS,
  DOCUMENTS,
  EMAIL_THREADS,
  INTERNAL_PROGRAMS,
  JOB_POSTINGS,
  MEETING_RECORDS,
  NEWSLETTERS,
  PERSONNEL,
  REGIONAL_STATIONS,
  TIMELINE_ENTRIES,
  TRAINING_MODULES
} from '@/content';
import type { BadgeTone } from '@/components/ui/badge';

/** Number of interactive utilities in the Tools Lab page. */
export const TOOLS_LAB_COUNT = 4;

export interface NavItem {
  id: ActiveTab;
  /** Public URL. Stable — changing one requires a redirect in `LEGACY_REDIRECTS`. */
  path: string;
  label: string;
  icon: LucideIcon;
  badge: string;
  badgeTone: BadgeTone;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** Sidebar structure, labels and live record counts. */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'CORE REPOSITORIES',
    items: [
      {
        id: 'dashboard',
        path: '/',
        label: 'Command Dashboard',
        icon: LayoutDashboard,
        badge: 'SYS 8.4',
        badgeTone: 'signal'
      },
      {
        id: 'documents',
        path: '/documents',
        label: 'Master Document Vault',
        icon: FileText,
        badge: `${DOCUMENTS.length}`,
        badgeTone: 'indigo'
      },
      {
        id: 'personnel',
        path: '/personnel',
        label: 'Personnel Directory',
        icon: Users,
        badge: `${PERSONNEL.length}`,
        badgeTone: 'neutral'
      },
      {
        id: 'stations',
        path: '/stations',
        label: 'Regional Stations & Arrays',
        icon: MapPin,
        badge: `${REGIONAL_STATIONS.length}`,
        badgeTone: 'success'
      },
      {
        id: 'programs',
        path: '/programs',
        label: 'Project Dossiers',
        icon: FolderLock,
        badge: `${INTERNAL_PROGRAMS.length}`,
        badgeTone: 'danger'
      },
      {
        id: 'departments',
        path: '/departments',
        label: 'Department Charters',
        icon: Building2,
        badge: `${DEPARTMENTS.length} Depts`,
        badgeTone: 'purple'
      },
      {
        id: 'products',
        path: '/products',
        label: 'Recalled Products Archive',
        icon: PackageX,
        badge: `${DISCONTINUED_PRODUCTS.length}`,
        badgeTone: 'warning'
      }
    ]
  },
  {
    title: 'ACOUSTICS & TELEMETRY',
    items: [
      {
        id: 'audio',
        path: '/audio',
        label: 'Acoustic Artifacts & Synth',
        icon: Radio,
        badge: `${AUDIO_ARTIFACTS.length} Feeds`,
        badgeTone: 'signal'
      },
      {
        id: 'tools',
        path: '/tools',
        label: 'Sub-Audible Software Tools',
        icon: Wrench,
        badge: `${TOOLS_LAB_COUNT} Tools`,
        badgeTone: 'success'
      }
    ]
  },
  {
    title: 'CONTINUITY & ARCHIVES',
    items: [
      {
        id: 'reports',
        path: '/reports',
        label: 'Annual Strategic Disclosures',
        icon: BarChart3,
        badge: `${ANNUAL_REPORTS.length} Years`,
        badgeTone: 'neutral'
      },
      {
        id: 'communications',
        path: '/communications',
        label: 'Emails & Meeting Minutes',
        icon: Mail,
        badge: `${EMAIL_THREADS.length + MEETING_RECORDS.length} Records`,
        badgeTone: 'info'
      },
      {
        id: 'timeline',
        path: '/timeline',
        label: 'Historical Timeline (1971-2026)',
        icon: Clock,
        badge: `${TIMELINE_ENTRIES.length} Events`,
        badgeTone: 'indigo'
      },
      {
        id: 'newsletters',
        path: '/newsletters',
        label: 'Internal Staff Newsletters',
        icon: Newspaper,
        badge: `${NEWSLETTERS.length} Issues`,
        badgeTone: 'neutral'
      }
    ]
  },
  {
    title: 'CORPORATE & HUMAN CAPITAL',
    items: [
      {
        id: 'training',
        path: '/training',
        label: 'Employee Training Modules',
        icon: GraduationCap,
        badge: `${TRAINING_MODULES.length} Modules`,
        badgeTone: 'warning'
      },
      {
        id: 'careers',
        path: '/careers',
        label: 'Classified Job Postings',
        icon: Briefcase,
        badge: `${JOB_POSTINGS.length} Open`,
        badgeTone: 'success'
      },
      {
        id: 'values',
        path: '/values',
        label: '5 Pillars of Certainty',
        icon: Compass,
        badge: 'Doctrine',
        badgeTone: 'neutral'
      },
      {
        id: 'deadlinks',
        path: '/deadlinks',
        label: 'Dead Links & Wayback Mirrors',
        icon: Link2Off,
        badge: `${DEAD_LINKS.length} Broken`,
        badgeTone: 'danger'
      }
    ]
  }
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

const PATH_BY_TAB = Object.fromEntries(NAV_ITEMS.map((i) => [i.id, i.path])) as Record<ActiveTab, string>;

/** URL for an archive section. */
export const pathForTab = (tab: ActiveTab): string => PATH_BY_TAB[tab];

/** Resolve the active section from a pathname (`/documents/…` → `documents`). */
export const tabForPath = (pathname: string): ActiveTab | null => {
  if (pathname === '/' || pathname === '') return 'dashboard';
  const first = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`;
  return NAV_ITEMS.find((i) => i.path === first)?.id ?? null;
};

/**
 * Safe redirects for URLs that are not canonical. The app previously had a
 * single URL (`/`) with in-memory tabs, so these cover obvious aliases.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/dashboard': '/',
  '/index.html': '/',
  '/dead-links': '/deadlinks',
  '/stations-map': '/stations',
  '/projects': '/programs',
  '/offices': '/stations'
};
