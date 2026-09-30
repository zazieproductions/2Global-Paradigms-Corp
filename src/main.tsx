import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts for the Order's liturgical layer (no third-party font CDN:
// keeps the CSP tight and the reader's IP away from Google).
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/800.css';
import '@fontsource/noto-sans-symbols/400.css';
import '@fontsource/noto-sans-symbols-2/400.css';
import '@/styles/index.css';
import { App } from '@/app/app';

const root = document.getElementById('root');
if (!root) throw new Error('GPC: #root element missing from index.html');

// Production HTML contains crawlable, no-JavaScript route content. React owns
// the root once the interactive archive starts, so remove that fallback first.
root.replaceChildren();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
