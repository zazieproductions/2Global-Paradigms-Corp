import { RouterProvider } from 'react-router-dom';
import { createArchiveRouter } from './router';

const router = createArchiveRouter();

export function App() {
  return <RouterProvider router={router} />;
}
