import { useEffect, useRef } from "react";

export const usePrevious = (value = undefined) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
