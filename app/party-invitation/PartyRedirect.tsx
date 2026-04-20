"use client";

import { useEffect } from "react";

export function PartyRedirect({ pdfPath }: { pdfPath: string }) {
  useEffect(() => {
    window.location.replace(pdfPath);
  }, [pdfPath]);
  return null;
}
