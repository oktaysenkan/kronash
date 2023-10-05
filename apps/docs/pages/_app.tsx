import { AppProps } from 'next/app';
import './styles.css';
import { KronashProvider } from '@kronash/react';
import Kronash from '@kronash/core';
import { Toaster } from 'sonner';

const client = new Kronash();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <KronashProvider client={client}>
      <Component {...pageProps} />
      <Toaster />
    </KronashProvider>
  );
}

export default CustomApp;
