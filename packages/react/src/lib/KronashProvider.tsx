import Kronash from '@kronash/core';
import React from 'react';

export type KronashContextType = {
  client: Kronash;
};

export type KronashProviderProps = {
  children: React.ReactNode;
  client: Kronash;
};

export const KronashContext = React.createContext<KronashContextType>(
  undefined as unknown as KronashContextType
);

export const KronashProvider = ({ client, children }: KronashProviderProps) => {
  return (
    <KronashContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </KronashContext.Provider>
  );
};

export default KronashProvider;
