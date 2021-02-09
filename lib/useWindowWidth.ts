import { useState, useEffect } from "react";
import mediaqueries from "../types/mediaQueries";
type MediaQuery = keyof typeof mediaqueries;

export default function useWindowWidth(mediaQueryKey: MediaQuery) {
  //check for SSR
  if (typeof window !== "object") return;
  if (!window.matchMedia) return;

  if (!mediaQueryKey) {
    throw new Error("Media Query string must be provided");
  }
  const mediaQuery = mediaqueries[mediaQueryKey];
  const [matched, setMatched] = useState(window.matchMedia(mediaQuery).matches);
  const listener = (e) => setMatched(e.matches);
  useEffect(() => {
    const mql = window.matchMedia(mediaQuery);
    if (mql.matches !== matched) setMatched(mql.matches);
    mql.addEventListener("change", listener);
    return () => {
      mql.removeEventListener("change", listener);
    };
  }, [matched, mediaQuery]);
  return matched;
}
//window.matchMedia(mediaQuery).matches