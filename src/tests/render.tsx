import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/app/router';

/** Render the full archive (shell + routes) at a URL. */
export function renderArchive(url = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  const utils = render(<RouterProvider router={router} />);
  return { router, ...utils };
}
