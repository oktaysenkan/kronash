import React, { useEffect } from 'react';
import Kronash from '@kronash/core';

import { KronashContext } from './KronashProvider';

const defaultClient = new Kronash();

export const useKronash = () => {
  const context = React.useContext(KronashContext);

  const client = context?.client || defaultClient;

  const [clientState, setClientState] = React.useState(client.toPlainObject());

  if (context === undefined) {
    throw new Error('useKronash must be used within a KronashProvider');
  }

  if (!client) {
    throw new Error('KronashProvider is provided without a client');
  }

  useEffect(() => {
    const unsubscribe = client.subscribe((newValue) => {
      setClientState(newValue);
    });

    return () => {
      unsubscribe();
    };
  }, [client]);

  return clientState;
};

export default useKronash;
