// app/lib/mapUtils.ts
export function parseMapInput(raw?: string): {
  embedSrc: string;
  buttonHref: string;
} {
  if (!raw) {
    return { embedSrc: "about:blank", buttonHref: "#" };
  }

  const trimmed = raw.trim();

  // 1) Tam iframe kodu
  if (trimmed.startsWith("<iframe")) {
    const match = trimmed.match(/src="([^"]+)"/);
    const src = match?.[1] ?? "about:blank";
    return { embedSrc: src, buttonHref: src };
  }

  // 2) Kısa URL (maps.app.goo.gl) – hem iframe hem buton
  if (trimmed.includes("maps.app.goo.gl")) {
    return {
      embedSrc: "about:blank",   // iframe de bu adresi kullanmayı denesin
      buttonHref: trimmed, // buton doğrudan kısa linke gitsin
    };
  }

  // 3) Normal Google Maps linki
  let embedSrc = trimmed;
  if (
    embedSrc.includes("google.com/maps") &&
    !embedSrc.includes("/embed")
  ) {
    embedSrc = embedSrc.replace("/maps/", "/maps/embed/");
  }

  return {
    embedSrc,
    buttonHref: trimmed,
  };
}
