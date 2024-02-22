import { useMemo } from "react";

export const calc = (a: number, b: number) => a + b;

export const useCalc2 = (a: number, b: number) => {
  const result = useMemo(() => calc(a, b), [a, b]);

  return result;
};
