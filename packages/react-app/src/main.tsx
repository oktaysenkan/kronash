import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import Kronash from '@kronash/core';
import { KronashProvider } from '@kronash/react';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new Kronash();

root.render(
  <StrictMode>
    <KronashProvider client={client}>
      <App />
    </KronashProvider>
  </StrictMode>
);
