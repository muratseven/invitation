// app/lib/mapUtils.ts
export function parseMapInput(raw: string | undefined): {
    embedSrc: string;
    buttonHref: string;
  } {
    if (!raw) {
      return { embedSrc: "about:blank", buttonHref: "#" };
    }
  
    const trimmed = raw.trim();
  
    // 1) Tam <iframe ...> embed kodu
    if (trimmed.startsWith("<iframe")) {
      const match = trimmed.match(/src="([^"]+)"/);
      const src = match?.[1] ?? "about:blank";
      return { embedSrc: src, buttonHref: src };
    }
  
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
  