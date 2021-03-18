import { useState } from "react";
export default function usePageLink(links: string[], defaultLink: string) {
  const pageLinks = links;
  const [activeLink, setActiveLink] = useState(defaultLink);
  return { activeLink, setActiveLink, pageLinks };
}
