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

    // src genelde already https://www.google.com/maps/embed?...
    // Button için embed'i normal maps URL'sine çevirmeye çalışalım:
    let buttonHref = src;

    // Eğer /maps/embed içeren klasik embed URL ise, /maps/embed yerine /maps/place yap
    if (buttonHref.includes("/maps/embed")) {
      buttonHref = buttonHref.replace("/maps/embed", "/maps/place");
    }

    return { embedSrc: src, buttonHref };
  }

  // 2) Kısa URL (maps.app.goo.gl)
  if (trimmed.includes("maps.app.goo.gl")) {
    return {
      embedSrc: "about:blank",
      buttonHref: trimmed,
    };
  }

  // 3) Normal Google Maps linki
  let embedSrc = trimmed;
  let buttonHref = trimmed;

  if (embedSrc.includes("google.com/maps")) {
    if (!embedSrc.includes("/embed")) {
      embedSrc = embedSrc.replace("/maps/", "/maps/embed/");
    }
  }

  return {
    embedSrc,
    buttonHref,
  };
}
