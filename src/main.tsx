import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { App } from '@/app/app';

const root = document.getElementById('root');
if (!root) throw new Error('GPC: #root element missing from index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
