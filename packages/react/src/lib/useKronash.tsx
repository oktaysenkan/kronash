import React, { useEffect } from 'react';
import Kronash, { Task } from '@kronash/core';

import { KronashContext } from './KronashProvider';

type UseKronash = {
  tasks: Task[];
  clear: Kronash['clear'];
  clearAll: Kronash['clearAll'];
  create: Kronash['create'];
  getAll: Kronash['getAll'];
  pause: Kronash['pause'];
  pauseAll: Kronash['pauseAll'];
  resume: Kronash['resume'];
  resumeAll: Kronash['resumeAll'];
  start: Kronash['start'];
  startAll: Kronash['startAll'];
  stop: Kronash['stop'];
  stopAll: Kronash['stopAll'];
  wait: Kronash['wait'];
  getRemainingTime: Kronash['getRemainingTime'];
};

const defaultClient = new Kronash();

export const useKronash = (): UseKronash => {
  const context = React.useContext(KronashContext);

  const client = context?.client || defaultClient;

  const [clientState, setClientState] = React.useState<UseKronash>(
    client.toPlainObject()
  );

  if (context === undefined) {
    throw new Error('useKronash must be used within a KronashProvider');
  }

  if (!client) {
    throw new Error('KronashProvider is provided without a client');
  }

  useEffect(() => {
    const unsubscribe = client.subscribe((newValue) => {
      setClientState(newValue.toPlainObject());
    });

    return () => {
      unsubscribe();
    };
  }, [client]);

  return clientState;
};

export default useKronash;
