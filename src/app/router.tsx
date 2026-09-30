/**
 * Route table. Every public URL is listed here; keep paths in sync with
 * `src/config/navigation.ts` and add a redirect before renaming one.
 */
import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { LEGACY_REDIRECTS } from '@/config/navigation';
import { LegacyRedirect, RootLayout, RouteError } from './route-elements';

const DashboardPage = lazy(() => import('@/pages/dashboard-page'));
const DocumentsPage = lazy(() => import('@/pages/documents-page'));
const PersonnelDirectoryPage = lazy(() => import('@/pages/personnel-directory-page'));
const StationsMapPage = lazy(() => import('@/pages/stations-map-page'));
const ProgramsPage = lazy(() => import('@/pages/programs-page'));
const DepartmentsPage = lazy(() => import('@/pages/departments-page'));
const ProductsArchivePage = lazy(() => import('@/pages/products-archive-page'));
const AudioLabPage = lazy(() => import('@/pages/audio-lab-page'));
const AnnualReportsPage = lazy(() => import('@/pages/annual-reports-page'));
const CommunicationsPage = lazy(() => import('@/pages/communications-page'));
const TimelinePage = lazy(() => import('@/pages/timeline-page'));
const NewslettersPage = lazy(() => import('@/pages/newsletters-page'));
const TrainingPage = lazy(() => import('@/pages/training-page'));
const CareersPage = lazy(() => import('@/pages/careers-page'));
const CompanyValuesPage = lazy(() => import('@/pages/company-values-page'));
const ToolsLabPage = lazy(() => import('@/pages/tools-lab-page'));
const DeadLinksPage = lazy(() => import('@/pages/dead-links-page'));
const SanctumPage = lazy(() => import('@/pages/sanctum-page'));
const DirectivesPage = lazy(() => import('@/pages/directives-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found-page'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'personnel', element: <PersonnelDirectoryPage /> },
      { path: 'stations', element: <StationsMapPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'products', element: <ProductsArchivePage /> },
      { path: 'audio', element: <AudioLabPage /> },
      { path: 'reports', element: <AnnualReportsPage /> },
      { path: 'communications', element: <CommunicationsPage /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'newsletters', element: <NewslettersPage /> },
      { path: 'training', element: <TrainingPage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'values', element: <CompanyValuesPage /> },
      { path: 'tools', element: <ToolsLabPage /> },
      { path: 'deadlinks', element: <DeadLinksPage /> },
      { path: 'sanctum', element: <SanctumPage /> },
      { path: 'directives', element: <DirectivesPage /> },
      ...Object.entries(LEGACY_REDIRECTS).map(([from, to]) => ({
        path: from.replace(/^\//, ''),
        element: <LegacyRedirect to={to} />
      })),
      { path: '*', element: <NotFoundPage /> }
    ]
  }
];

export const createArchiveRouter = () => createBrowserRouter(routes);
