import { useEffect } from "react";

export default function useOutsideObserver(ref, onTapOutside) {
  function handleOutsideTap(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      onTapOutside();
    }
  }
  useEffect(() => {
    document.addEventListener("touchend", handleOutsideTap);
    document.addEventListener("mousedown", handleOutsideTap);
    return () => {
      document.removeEventListener("touchend", handleOutsideTap);
      document.removeEventListener("mousedown", handleOutsideTap);
    };
  });
}
