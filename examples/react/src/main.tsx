import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import Kronash from '@kronash/core';

import App from './app/app';
import { KronashProvider } from '@kronash/react';

import './global.css';
import { Toaster } from 'sonner';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new Kronash();

root.render(
  <StrictMode>
    <KronashProvider client={client}>
      <App />
      <Toaster />
    </KronashProvider>
  </StrictMode>
);
