import { useEffect, useRef } from "react";

export default function useClickOutside(elementRef, callback) {
  const callbackRef = useRef<any>();
  callbackRef.current = callback;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!elementRef?.current?.contains(e.target) && callbackRef.current) {
        callbackRef.current(e);
      }
    };
    document.body.addEventListener("click", handleClickOutside, true);
    return () => {
      document.body.removeEventListener("click", handleClickOutside, true);
    };
  }, [callbackRef, elementRef]);
}
