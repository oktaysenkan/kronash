import React from 'react';

type Props = {
  children?: string;
};

const Warning = ({ children }: Props) => {
  return (
    <div className="bg-yellow-800/20 border-l-4 border-yellow-300/20 text-yellow-100/60 py-2 px-4">
      {children}
    </div>
  );
};

export default Warning;
