import { useEffect } from "react";

export default function useFocusOnRender(ref) {
  useEffect(() => {
    ref.current?.focus();
  }, [ref.current]);
}
