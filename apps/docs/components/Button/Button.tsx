import React from 'react';

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  children?: string;
};

const Button = ({ children, ...props }: Props) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
