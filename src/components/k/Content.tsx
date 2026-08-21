"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONTENT, fetchContent, type Content } from "@/lib/cms";

const Ctx = createContext<Content>(DEFAULT_CONTENT);

/**
 * Serves the site's editable content.
 *
 * It starts on the compiled defaults, so the page paints complete on the first
 * frame and nothing depends on the network. The live rows arrive a moment
 * later and replace them. A visitor sees no flash of empty sections, only the
 * occasional swap of a title, and if the database is down the site is exactly
 * what it was before the CMS existed.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    let alive = true;
    fetchContent().then((c) => {
      if (alive) setContent(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
