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

const convertToPlainObject = (kronash: Kronash | undefined): UseKronash => {
  const client = kronash || defaultClient;

  return {
    tasks: client.tasks,
    clear: (...args) => client.clear(...args),
    clearAll: (...args) => client.clearAll(...args),
    create: (...args) => client.create(...args),
    getAll: (...args) => client.getAll(...args),
    pause: (...args) => client.pause(...args),
    pauseAll: (...args) => client.pauseAll(...args),
    resume: (...args) => client.resume(...args),
    resumeAll: (...args) => client.resumeAll(...args),
    start: (...args) => client.start(...args),
    startAll: (...args) => client.startAll(...args),
    stop: (...args) => client.stop(...args),
    stopAll: (...args) => client.stopAll(...args),
    wait: (...args) => client.wait(...args),
    getRemainingTime: (...args) => client.getRemainingTime(...args),
  };
};

export const useKronash = (): UseKronash => {
  const context = React.useContext(KronashContext);

  const [clientState, setClientState] = React.useState<UseKronash>(
    convertToPlainObject(context.client)
  );

  if (context === undefined) {
    throw new Error('useKronash must be used within a KronashProvider');
  }

  if (!context.client) {
    throw new Error('KronashProvider is provided without a client');
  }

  useEffect(() => {
    const unsubscribe = context.client.subscribe((newValue) => {
      setClientState(convertToPlainObject(newValue));
    });

    return () => {
      unsubscribe();
    };
  }, [context.client]);

  return clientState;
};

export default useKronash;
