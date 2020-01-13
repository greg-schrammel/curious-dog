import { useRef, useEffect } from "react";

export default function useFocus(cond, deps) {
  const ref = useRef();
  useEffect(() => {
    if (cond) ref.current.focus();
  }, deps);
  return ref;
}
